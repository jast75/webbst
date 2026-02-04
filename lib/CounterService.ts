import { db } from './firebase'
import { doc, runTransaction } from 'firebase/firestore'

export class CounterService {
    /**
     * Get the next sequential ID with a prefix and format
     * e.g., getNextId('nasabah', 'NS', 4) -> 'NS0001'
     */
    static async getNextId(collectionName: string, prefix: string, padding: number = 4): Promise<string> {
        const counterRef = doc(db, 'counters', collectionName)

        try {
            const nextId = await runTransaction(db, async (transaction) => {
                const counterDoc = await transaction.get(counterRef)

                let currentCount = 0
                if (counterDoc.exists()) {
                    currentCount = counterDoc.data().count || 0
                }

                const nextCount = currentCount + 1
                transaction.set(counterRef, { count: nextCount }, { merge: true })

                return nextCount
            })

            return `${prefix}${String(nextId).padStart(padding, '0')}`
        } catch (error) {
            console.error(`Error generating next ID for ${collectionName}:`, error)
            // Fallback to timestamp-based if transaction fails (less ideal but keeps app working)
            const timestamp = Date.now().toString().slice(-6)
            return `${prefix}${timestamp}`
        }
    }

    /**
     * Generate a transaction ID with format: PREFIX + 4 digits seq + 5 digits random
     * e.g., generateTransactionId('transaksi_nasabah', 'NSX') -> 'NSX000185293'
     */
    static async generateTransactionId(collectionName: string, prefix: string): Promise<string> {
        const counterRef = doc(db, 'counters', collectionName)

        try {
            const nextSeq = await runTransaction(db, async (transaction) => {
                const counterDoc = await transaction.get(counterRef)

                let currentCount = 0
                if (counterDoc.exists()) {
                    currentCount = counterDoc.data().count || 0
                }

                const nextCount = currentCount + 1
                transaction.set(counterRef, { count: nextCount }, { merge: true })

                return nextCount
            })

            const seqPart = String(nextSeq).padStart(4, '0')
            const randomPart = Math.floor(10000 + Math.random() * 90000).toString()

            return `${prefix}${seqPart}${randomPart}`
        } catch (error) {
            console.error(`Error generating transaction ID for ${collectionName}:`, error)
            const fallback = Date.now().toString().slice(-9)
            return `${prefix}${fallback}`
        }
    }
}
