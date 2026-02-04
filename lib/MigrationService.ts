import { db } from './firebase';
import {
    collection,
    getDocs,
    writeBatch,
    doc,
    query,
    where,
    orderBy,
    setDoc
} from 'firebase/firestore';

export class MigrationService {
    /**
     * Migrate Nasabah IDs and update their transaction references
     */
    static async migrateNasabahIds() {
        const nasabahSnap = await getDocs(query(collection(db, "nasabah"), orderBy("createdAt", "asc")));
        const total = nasabahSnap.size;
        let count = 0;

        // We process in batches because Firestore has a 500 operations limit per batch
        const nasabahDocs = nasabahSnap.docs;

        for (let i = 0; i < nasabahDocs.length; i++) {
            const nasabahDoc = nasabahDocs[i];
            const oldData = nasabahDoc.data();
            const oldId = oldData.id;
            const newId = `NS${String(i + 1).padStart(4, '0')}`;


            const batch = writeBatch(db);

            // 1. Update Nasabah doc
            batch.update(nasabahDoc.ref, { id: newId });

            // 2. Find and update transactions
            const qTrx = query(collection(db, "transaksi_nasabah"), where("nasabahId", "==", oldId));
            const trxSnap = await getDocs(qTrx);

            trxSnap.forEach((tDoc) => {
                batch.update(tDoc.ref, { nasabahId: newId });
            });

            await batch.commit();
            count++;
        }

        // 3. Update counter for future IDs
        await setDoc(doc(db, "counters", "nasabah"), { count: total }, { merge: true });

        return { success: true, migratedCount: count };
    }

    /**
     * Migrate Pembeli IDs and update their transaction references
     */
    static async migratePembeliIds() {
        const pembeliSnap = await getDocs(query(collection(db, "pembeli"), orderBy("createdAt", "asc")));
        const total = pembeliSnap.size;
        let count = 0;

        const pembeliDocs = pembeliSnap.docs;

        for (let i = 0; i < pembeliDocs.length; i++) {
            const pembeliDoc = pembeliDocs[i];
            const oldData = pembeliDoc.data();
            const oldId = oldData.id;
            const newId = `PB${String(i + 1).padStart(4, '0')}`;
            const oldName = oldData.nama;


            const batch = writeBatch(db);

            // 1. Update Pembeli doc
            batch.update(pembeliDoc.ref, { id: newId });

            // 2. Find and update transactions in transaksi_bst
            // Note: Some transactions might use buyerId, some might use buyerName
            const qTrx = query(collection(db, "transaksi_bst"), where("buyerId", "==", oldId));
            const trxSnap = await getDocs(qTrx);

            trxSnap.forEach((tDoc) => {
                batch.update(tDoc.ref, { buyerId: newId });
            });

            await batch.commit();
            count++;
        }

        // 3. Update counter for future IDs
        await setDoc(doc(db, "counters", "pembeli"), { count: total }, { merge: true });

        return { success: true, migratedCount: count };
    }
}
