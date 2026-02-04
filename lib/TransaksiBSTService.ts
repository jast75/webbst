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
import { CounterService } from './CounterService';

export interface TransaksiBSTItem {
    jenisSampahId: string;
    nama: string;
    berat: number;
    hargaJual: number;
    subtotal: number;
}

export interface TransaksiBST {
    id: string;
    buyerName: string;
    buyerId?: string;
    buyerType: 'registered' | 'manual';
    tanggal: Timestamp;
    totalPenjualan: number;
    totalPembelian: number;
    keuntungan: number;
    items: TransaksiBSTItem[];
    createdAt?: Timestamp;
}

export class TransaksiBSTService {
    private static COLLECTION_NAME = 'transaksi_bst';

    /**
     * Map Firestore data to TransaksiBST object
     */
    static mapDoc(docSnap: DocumentSnapshot): TransaksiBST {
        const data = docSnap.data();
        if (!data) throw new Error('Document data is undefined');
        return {
            id: docSnap.id,
            buyerName: data.buyerName || 'Umum',
            buyerId: data.buyerId,
            buyerType: data.buyerType || 'manual',
            tanggal: data.tanggal,
            totalPenjualan: data.totalPenjualan || 0,
            totalPembelian: data.totalPembelian || 0,
            keuntungan: data.keuntungan || 0,
            items: data.items || [],
            createdAt: data.createdAt
        };
    }

    /**
     * Fetch sales transactions sorted by date with pagination
     */
    static async getAllSales(limitCount: number = 20, lastDoc?: any): Promise<{ data: TransaksiBST[], docs: any[] }> {
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
            console.error('Error fetching sales transactions with pagination:', error);
            throw error;
        }
    }

    /**
     * Search sales transactions by buyer name (prefix search)
     */
    static async searchSales(searchTerm: string): Promise<TransaksiBST[]> {
        try {
            const q = query(
                collection(db, this.COLLECTION_NAME),
                where('buyerName', '>=', searchTerm),
                where('buyerName', '<=', searchTerm + '\uf8ff'),
                limit(50)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => this.mapDoc(doc));
        } catch (error) {
            console.error('Error searching sales transactions:', error);
            throw error;
        }
    }

    /**
     * Create a new sale transaction with atomic stock reduction
     */
    static async createSale(data: Omit<TransaksiBST, 'id'>): Promise<string> {
        try {
            // Generate custom transaction ID: PBX + 4 digits seq + 5 digits random
            const customId = await CounterService.generateTransactionId(this.COLLECTION_NAME, 'PBX');

            return await runTransaction(db, async (transaction) => {
                // 1. Create Transaction Document with custom ID
                const saleRef = doc(db, this.COLLECTION_NAME, customId);
                transaction.set(saleRef, {
                    ...data,
                    createdAt: Timestamp.now()
                });

                // 2. Reduce Stock
                for (const item of data.items) {
                    const sampahRef = doc(db, 'jenis_sampah', item.jenisSampahId);
                    transaction.update(sampahRef, {
                        stok: increment(-item.berat)
                    });
                }

                // 3. Update Buyer stats
                if (data.buyerId && data.buyerType === 'registered') {
                    const pembeliRef = doc(db, 'pembeli', data.buyerId);
                    transaction.update(pembeliRef, {
                        totalTransaksi: increment(1),
                        lastTransactionDate: new Date().toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })
                    });
                }

                return customId;
            });
        } catch (error) {
            console.error('Error creating sale transaction:', error);
            throw error;
        }
    }

    /**
     * Delete a sale and rollback stock
     */
    static async deleteSale(id: string): Promise<void> {
        try {
            const saleRef = doc(db, this.COLLECTION_NAME, id);
            const saleSnap = await getDoc(saleRef);

            if (!saleSnap.exists()) throw new Error('Sale transaction not found');
            const data = saleSnap.data() as TransaksiBST;

            await runTransaction(db, async (transaction) => {
                // 1. Rollback Stock
                for (const item of data.items) {
                    const sampahRef = doc(db, 'jenis_sampah', item.jenisSampahId);
                    transaction.update(sampahRef, {
                        stok: increment(item.berat)
                    });
                }

                // 2. Rollback Buyer stats
                if (data.buyerId && data.buyerType === 'registered') {
                    const pembeliRef = doc(db, 'pembeli', data.buyerId);
                    transaction.update(pembeliRef, {
                        totalTransaksi: increment(-1)
                    });
                }

                // 3. Delete Document
                transaction.delete(saleRef);
            });
        } catch (error) {
            console.error('Error deleting sale transaction:', error);
            throw error;
        }
    }
}
