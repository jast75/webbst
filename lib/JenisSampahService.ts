import { db } from './firebase';
import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    Timestamp,
    increment,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    DocumentSnapshot
} from 'firebase/firestore';

export interface JenisSampah {
    id: string;
    firestoreId: string;
    nama: string;
    kategori?: string;
    hargaBeli: number;
    hargaJual: number;
    stok: number;
    satuan?: string;
    perubahan?: number;
    updatedAt?: Timestamp;
}

export interface StockAdjustLog {
    jenisSampahId: string;
    namaSampah: string;
    previousStock: number;
    newStock: number;
    adjustment: number;
    type: 'tambah' | 'kurang' | 'set';
    keterangan: string;
    tanggal: Timestamp;
}

export class JenisSampahService {
    private static COLLECTION_NAME = 'jenis_sampah';

    static mapDoc(docSnap: DocumentSnapshot): JenisSampah {
        const data = docSnap.data();
        if (!data) throw new Error('Document data is undefined');
        return {
            id: data.id || docSnap.id,
            firestoreId: docSnap.id,
            nama: data.nama || '',
            kategori: data.kategori,
            hargaBeli: data.hargaBeli || 0,
            hargaJual: data.hargaJual || 0,
            stok: data.stok || 0,
            satuan: data.satuan || 'kg',
            perubahan: data.perubahan || 0,
            updatedAt: data.updatedAt
        };
    }

    static async updateStock(
        firestoreId: string,
        amount: number,
        type: 'tambah' | 'kurang' | 'set',
        keterangan: string = 'Update manual'
    ): Promise<void> {
        try {
            const docRef = doc(db, this.COLLECTION_NAME, firestoreId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error('Jenis sampah tidak ditemukan');
            }

            const currentData = docSnap.data();
            const previousStock = currentData.stok || 0;
            let newStock = previousStock;
            let adjustment = 0;

            if (type === 'tambah') {
                newStock = previousStock + amount;
                adjustment = amount;
            } else if (type === 'kurang') {
                newStock = previousStock - amount;
                adjustment = -amount;
            } else if (type === 'set') {
                newStock = amount;
                adjustment = amount - previousStock;
            }

            // Update the main document
            await updateDoc(docRef, {
                stok: newStock,
                updatedAt: Timestamp.now()
            });

            // Log the adjustment
            const logRef = collection(db, 'stok_log');
            await addDoc(logRef, {
                jenisSampahId: firestoreId,
                namaSampah: currentData.nama,
                previousStock,
                newStock,
                adjustment,
                type,
                keterangan,
                tanggal: Timestamp.now()
            });

        } catch (error) {
            console.error('Error updating stock:', error);
            throw error;
        }
    }

    static async getLogsByJenisSampah(firestoreId: string, limitCount: number = 10): Promise<StockAdjustLog[]> {
        try {
            const q = query(
                collection(db, 'stok_log'),
                where('jenisSampahId', '==', firestoreId),
                orderBy('tanggal', 'desc'),
                limit(limitCount)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id
                } as any;
            });
        } catch (error) {
            console.error('Error fetching stock logs:', error);
            throw error;
        }
    }

    /**
     * Fetch all jenis sampah, sorted by name
     */
    static async getAllJenisSampah(): Promise<JenisSampah[]> {
        try {
            const q = query(
                collection(db, this.COLLECTION_NAME),
                orderBy('nama', 'asc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => this.mapDoc(doc));
        } catch (error) {
            console.error('Error fetching all jenis sampah:', error);
            throw error;
        }
    }

    /**
     * Batch update prices for multiple jenis sampah
     */
    static async updatePrices(
        updates: Array<{
            firestoreId: string;
            hargaBeli?: number;
            hargaJual?: number;
            satuan?: string;
            perubahan?: number
        }>
    ): Promise<number> {
        try {
            const { writeBatch } = await import('firebase/firestore');
            const batch = writeBatch(db);
            let updateCount = 0;

            for (const update of updates) {
                const docRef = doc(db, this.COLLECTION_NAME, update.firestoreId);
                const updateData: any = {
                    updatedAt: Timestamp.now()
                };

                if (update.hargaBeli !== undefined) {
                    updateData.hargaBeli = update.hargaBeli;
                }
                if (update.hargaJual !== undefined) {
                    updateData.hargaJual = update.hargaJual;
                }
                if (update.satuan !== undefined) {
                    updateData.satuan = update.satuan;
                }
                if (update.perubahan !== undefined) {
                    updateData.perubahan = update.perubahan;
                }

                batch.update(docRef, updateData);
                updateCount++;
            }

            if (updateCount > 0) {
                await batch.commit();
            }

            return updateCount;
        } catch (error) {
            console.error('Error updating prices:', error);
            throw error;
        }
    }
}
