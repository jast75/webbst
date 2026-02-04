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
    DocumentSnapshot,
    limit
} from 'firebase/firestore';
import { CounterService } from './CounterService';

export interface Pembeli {
    id: string;
    firestoreId: string;
    nama: string;
    alamat: string;
    noTelp: string;
    perusahaan: string;
    email: string;
    foto?: string | null;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    totalTransaksi?: number;
    lastTransactionDate?: string;
}

export interface CreatePembeliData {
    nama: string;
    alamat: string;
    noTelp: string;
    perusahaan: string;
    email: string;
    foto?: string | null;
}

export interface UpdatePembeliData {
    nama?: string;
    alamat?: string;
    noTelp?: string;
    perusahaan?: string;
    email?: string;
    foto?: string | null;
}

export class PembeliService {
    private static COLLECTION_NAME = 'pembeli';

    /**
     * Map Firestore data to Pembeli object
     */
    static mapDoc(docSnap: DocumentSnapshot): Pembeli {
        const data = docSnap.data();
        if (!data) throw new Error('Document data is undefined');
        return {
            id: data.id || docSnap.id,
            firestoreId: docSnap.id,
            nama: data.nama || '',
            alamat: data.alamat || '',
            noTelp: data.noTelp || '',
            perusahaan: data.perusahaan || '',
            email: data.email || '',
            foto: data.foto,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            totalTransaksi: data.totalTransaksi || 0,
            lastTransactionDate: data.lastTransactionDate
        };
    }

    /**
     * Fetch all pembeli from Firestore
     */
    static async getAllPembeli(): Promise<Pembeli[]> {
        try {
            const querySnapshot = await getDocs(collection(db, this.COLLECTION_NAME));
            const pembeliList: Pembeli[] = [];

            querySnapshot.forEach((doc) => {
                pembeliList.push(PembeliService.mapDoc(doc));
            });

            // Sort by name
            pembeliList.sort((a, b) => a.nama.localeCompare(b.nama));

            return pembeliList;
        } catch (error) {
            console.error('Error fetching pembeli:', error);
            throw error;
        }
    }

    /**
     * Fetch a single pembeli by ID (custom ID or Firestore ID)
     */
    static async getPembeliById(id: string): Promise<Pembeli | null> {
        try {
            // Try to find by custom ID first
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
            console.error('Error fetching pembeli by ID:', error);
            throw error;
        }
    }

    /**
     * Create a new pembeli
     */
    static async createPembeli(data: CreatePembeliData): Promise<{ id: string; firestoreId: string }> {
        try {
            // Get unique sequential ID from Firestore counter (safe from race conditions)
            const uniqueId = await CounterService.getNextId('pembeli', 'PB', 4);

            const newPembeliData = {
                id: uniqueId,
                nama: data.nama.trim(),
                alamat: data.alamat.trim(),
                noTelp: data.noTelp.trim(),
                perusahaan: data.perusahaan.trim(),
                email: data.email.trim(),
                foto: data.foto || null,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            };

            const docRef = await addDoc(collection(db, this.COLLECTION_NAME), newPembeliData);

            return {
                id: uniqueId,
                firestoreId: docRef.id
            };
        } catch (error) {
            console.error('Error creating pembeli:', error);
            throw error;
        }
    }

    /**
     * Update an existing pembeli
     */
    static async updatePembeli(firestoreId: string, data: UpdatePembeliData): Promise<void> {
        try {
            const docRef = doc(db, this.COLLECTION_NAME, firestoreId);

            const updateData: any = {
                updatedAt: Timestamp.now()
            };

            if (data.nama !== undefined) updateData.nama = data.nama.trim();
            if (data.alamat !== undefined) updateData.alamat = data.alamat.trim();
            if (data.noTelp !== undefined) updateData.noTelp = data.noTelp.trim();
            if (data.perusahaan !== undefined) updateData.perusahaan = data.perusahaan.trim();
            if (data.email !== undefined) updateData.email = data.email.trim();
            if (data.foto !== undefined) updateData.foto = data.foto;

            await updateDoc(docRef, updateData);
        } catch (error) {
            console.error('Error updating pembeli:', error);
            throw error;
        }
    }

    /**
     * Delete a pembeli
     * Only allowed if no transaction history exists to maintain data integrity
     */
    static async deletePembeli(firestoreId: string): Promise<void> {
        try {
            const docRef = doc(db, this.COLLECTION_NAME, firestoreId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error('Pembeli tidak ditemukan');
            }

            // Check Transaction History (transaksi_bst)
            // We search by the custom ID (docSnap.id) which might be stored in transaksi_bst as buyerId
            const q = query(
                collection(db, 'transaksi_bst'),
                where('buyerId', '==', docSnap.id), // Registered buyers use firestoreId as buyerId
                limit(1)
            );
            const trxSnap = await getDocs(q);

            if (!trxSnap.empty) {
                throw new Error('Pembeli tidak dapat dihapus karena memiliki riwayat transaksi. Untuk menjaga integritas data, pembeli dengan riwayat transaksi tidak boleh dihapus.');
            }

            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting pembeli:', error);
            throw error;
        }
    }
}
