import { db } from './firebase';
import {
    collection,
    getDocs,
    getDoc,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    Timestamp,
    orderBy,
    limit,
    startAfter,
    runTransaction,
    increment,
    DocumentSnapshot
} from 'firebase/firestore';
import { DailySummaryService } from './DailySummaryService';
import { CounterService } from './CounterService';

export interface TransaksiItem {
    jenisSampahId: string;
    namaSampah: string;
    berat: number;
    hargaBeli: number;
    subtotal: number;
}

export interface TransaksiNasabah {
    id: string;
    nasabahId: string;
    nasabahName?: string;
    tanggal: Timestamp;
    total: number;
    items: TransaksiItem[];
    createdAt?: Timestamp;
}

export class TransaksiNasabahService {
    private static COLLECTION_NAME = 'transaksi_nasabah';

    /**
     * Map Firestore data to TransaksiNasabah object
     */
    static mapDoc(docSnap: DocumentSnapshot): TransaksiNasabah {
        const data = docSnap.data();
        if (!data) throw new Error('Document data is undefined');
        return {
            id: docSnap.id,
            nasabahId: data.nasabahId || '',
            nasabahName: data.nasabahName,
            tanggal: data.tanggal,
            total: data.total || 0,
            items: data.items || [],
            createdAt: data.createdAt
        };
    }

    /**
     * Fetch transactions sorted by date with pagination
     */
    static async getAllTransactions(limitCount: number = 20, lastDoc?: any): Promise<{ data: TransaksiNasabah[], docs: any[] }> {
        try {
            let q = query(
                collection(db, this.COLLECTION_NAME),
                orderBy('tanggal', 'desc'),
                limit(limitCount)
            );

            if (lastDoc) {
                q = query(q, startAfter(lastDoc));
            }

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => this.mapDoc(doc));

            return { data, docs: querySnapshot.docs };
        } catch (error) {
            console.error('Error fetching transactions with pagination:', error);
            throw error;
        }
    }

    /**
     * Search transactions by nasabah name (prefix search)
     */
    static async searchTransactions(searchTerm: string): Promise<TransaksiNasabah[]> {
        try {
            const q = query(
                collection(db, this.COLLECTION_NAME),
                where('nasabahName', '>=', searchTerm),
                where('nasabahName', '<=', searchTerm + '\uf8ff'),
                limit(50)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => this.mapDoc(doc));
        } catch (error) {
            console.error('Error searching transactions:', error);
            throw error;
        }
    }

    /**
     * Fetch transactions for a specific nasabah
     */
    static async getTransactionsByNasabah(nasabahId: string): Promise<TransaksiNasabah[]> {
        try {
            const q = query(
                collection(db, this.COLLECTION_NAME),
                where('nasabahId', '==', nasabahId),
                orderBy('tanggal', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => this.mapDoc(doc));
        } catch (error) {
            console.error('Error fetching transactions by nasabah:', error);
            throw error;
        }
    }

    /**
     * Create a new transaction with atomic updates to saldo and stock
     */
    static async createTransaction(data: Omit<TransaksiNasabah, 'id'>): Promise<string> {
        try {
            // Generate custom transaction ID: NSX + 4 digits seq + 5 digits random
            const customId = await CounterService.generateTransactionId(this.COLLECTION_NAME, 'NSX');

            return await runTransaction(db, async (transaction) => {
                // 1. Create Transaction Document with custom ID
                const transRef = doc(db, this.COLLECTION_NAME, customId);
                transaction.set(transRef, {
                    ...data,
                    createdAt: Timestamp.now()
                });

                // 2. Update Nasabah Saldo
                const nasabahRef = doc(db, 'nasabah', data.nasabahId);
                transaction.update(nasabahRef, {
                    saldo: increment(data.total),
                    updatedAt: Timestamp.now()
                });

                // 3. Update Jenis Sampah Stock
                for (const item of data.items) {
                    const sampahRef = doc(db, 'jenis_sampah', item.jenisSampahId);
                    transaction.update(sampahRef, {
                        stok: increment(item.berat)
                    });
                }

                return customId;
            }).then(async (id) => {
                await DailySummaryService.updateDailySummary(data.total);
                return id;
            });
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
    }

    /**
     * Delete a transaction and rollback saldo and stock
     */
    static async deleteTransaction(id: string): Promise<void> {
        try {
            const transRef = doc(db, this.COLLECTION_NAME, id);
            const transSnap = await getDoc(transRef);

            if (!transSnap.exists()) throw new Error('Transaction not found');
            const data = transSnap.data() as TransaksiNasabah;

            await runTransaction(db, async (transaction) => {
                // 1. Rollback Nasabah Saldo
                const nasabahRef = doc(db, 'nasabah', data.nasabahId);
                transaction.update(nasabahRef, {
                    saldo: increment(-data.total)
                });

                // 2. Rollback Stock
                for (const item of data.items) {
                    const sampahRef = doc(db, 'jenis_sampah', item.jenisSampahId);
                    transaction.update(sampahRef, {
                        stok: increment(-item.berat)
                    });
                }

                // 3. Delete Transaction
                transaction.delete(transRef);
            });

            // 4. Update Daily Summary
            await DailySummaryService.decrementDailySummary(data.total, data.tanggal);
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    }
}
