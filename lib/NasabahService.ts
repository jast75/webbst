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
    Transaction,
    DocumentSnapshot
} from 'firebase/firestore';
import { CounterService } from './CounterService';

export interface Nasabah {
    id: string;
    firestoreId: string;
    nama: string;
    alamat: string;
    noTelp: string;
    saldo: number;
    foto?: string | null;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface CreateNasabahData {
    nama: string;
    alamat: string;
    noTelp: string;
    foto?: string | null;
}

export interface UpdateNasabahData {
    nama?: string;
    alamat?: string;
    noTelp?: string;
    foto?: string | null;
    saldo?: number;
}

export class NasabahService {
    private static COLLECTION_NAME = 'nasabah';

    /**
     * Map Firestore data to Nasabah object
     */
    static mapDoc(docSnap: DocumentSnapshot): Nasabah {
        const data = docSnap.data();
        if (!data) throw new Error('Document data is undefined');
        return {
            id: data.id || docSnap.id,
            firestoreId: docSnap.id,
            nama: data.nama || '',
            alamat: data.alamat || '',
            noTelp: data.noTelp || '',
            saldo: data.saldo || 0,
            foto: data.foto,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        };
    }

    /**
     * Fetch nasabah from Firestore with pagination support
     */
    static async getAllNasabah(limitCount: number = 50, lastDoc?: any): Promise<{ data: Nasabah[], docs: any[] }> {
        try {
            let q = query(
                collection(db, this.COLLECTION_NAME),
                orderBy('nama', 'asc'),
                limit(limitCount)
            );

            if (lastDoc) {
                q = query(q, startAfter(lastDoc));
            }

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => this.mapDoc(doc));

            return { data, docs: querySnapshot.docs };
        } catch (error) {
            console.error('Error fetching nasabah with pagination:', error);
            throw error;
        }
    }

    /**
     * Search nasabah by name (prefix search)
     */
    static async searchNasabah(searchTerm: string): Promise<Nasabah[]> {
        try {
            // Firestore prefix search is case-sensitive
            const q = query(
                collection(db, this.COLLECTION_NAME),
                where('nama', '>=', searchTerm),
                where('nama', '<=', searchTerm + '\uf8ff'),
                limit(50)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => this.mapDoc(doc));
        } catch (error) {
            console.error('Error searching nasabah:', error);
            throw error;
        }
    }

    /**
     * Fetch a single nasabah by custom ID or Firestore ID
     */
    static async getNasabahById(id: string): Promise<Nasabah | null> {
        try {
            // Try searching by custom ID field first
            const q = query(
                collection(db, this.COLLECTION_NAME),
                where('id', '==', id)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                return this.mapDoc(querySnapshot.docs[0]);
            }

            // Try as Firestore document ID
            const docRef = doc(db, this.COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return this.mapDoc(docSnap);
            }

            return null;
        } catch (error) {
            console.error('Error fetching nasabah by ID:', error);
            throw error;
        }
    }

    /**
     * Create a new nasabah with sequential ID
     */
    static async createNasabah(data: CreateNasabahData): Promise<{ id: string; firestoreId: string }> {
        try {
            const uniqueId = await CounterService.getNextId('nasabah', 'NS', 4);

            const newNasabahData = {
                id: uniqueId,
                nama: data.nama.trim(),
                alamat: data.alamat.trim(),
                noTelp: data.noTelp.trim(),
                saldo: 0,
                foto: data.foto || null,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            };

            const docRef = await addDoc(collection(db, this.COLLECTION_NAME), newNasabahData);

            return {
                id: uniqueId,
                firestoreId: docRef.id
            };
        } catch (error) {
            console.error('Error creating nasabah:', error);
            throw error;
        }
    }

    /**
     * Update an existing nasabah
     */
    static async updateNasabah(firestoreId: string, data: UpdateNasabahData): Promise<void> {
        try {
            const docRef = doc(db, this.COLLECTION_NAME, firestoreId);
            const updateData: any = {
                ...data,
                updatedAt: Timestamp.now()
            };

            await updateDoc(docRef, updateData);
        } catch (error) {
            console.error('Error updating nasabah:', error);
            throw error;
        }
    }

    /**
     * Withdraw balance from a nasabah
     */
    static async withdrawSaldo(firestoreId: string, amount: number): Promise<void> {
        try {
            const nasabahRef = doc(db, this.COLLECTION_NAME, firestoreId);

            await runTransaction(db, async (transaction: Transaction) => {
                const nasabahSnap = await transaction.get(nasabahRef);
                if (!nasabahSnap.exists()) {
                    throw new Error('Nasabah tidak ditemukan');
                }

                const currentSaldo = nasabahSnap.data().saldo || 0;
                if (currentSaldo < amount) {
                    throw new Error('Saldo tidak mencukupi');
                }

                // 1. Update Saldo
                transaction.update(nasabahRef, {
                    saldo: increment(-amount),
                    updatedAt: Timestamp.now()
                });

                // 2. Record Penarikan
                const penarikanRef = doc(collection(db, 'penarikan_saldo'));
                transaction.set(penarikanRef, {
                    nasabahId: firestoreId,
                    nasabahCustomId: nasabahSnap.data().id,
                    nasabahNama: nasabahSnap.data().nama,
                    jumlah: amount,
                    tanggal: Timestamp.now(),
                    createdAt: Timestamp.now()
                });
            });
        } catch (error) {
            console.error('Error withdrawing saldo:', error);
            throw error;
        }
    }
    /**
     * Delete a nasabah
     * Only allowed if saldo is 0 and no transaction history exists
     */
    static async deleteNasabah(firestoreId: string): Promise<void> {
        try {
            const docRef = doc(db, this.COLLECTION_NAME, firestoreId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error('Nasabah tidak ditemukan');
            }

            const data = docSnap.data();

            // 1. Check Saldo
            if (data.saldo > 0) {
                throw new Error('Tidak dapat menghapus nasabah yang masih memiliki saldo. Silahkan tarik saldo terlebih dahulu.');
            }

            // 2. Check Transaction History
            // We search by the custom ID (data.id) which is used in transaksi_nasabah
            const q = query(
                collection(db, 'transaksi_nasabah'),
                where('nasabahId', '==', data.id),
                limit(1)
            );
            const trxSnap = await getDocs(q);

            if (!trxSnap.empty) {
                throw new Error('Nasabah tidak dapat dihapus karena memiliki riwayat transaksi. Untuk menjaga integritas data, nasabah dengan riwayat transaksi tidak boleh dihapus.');
            }

            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting nasabah:', error);
            throw error;
        }
    }
}
