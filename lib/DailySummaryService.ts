import { db } from './firebase'
import { doc, getDoc, setDoc, updateDoc, increment, collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore'

export class DailySummaryService {
    /**
     * Update daily summary with transaction amount
     * Creates or updates a document in daily_summary collection
     */
    static async updateDailySummary(amount: number): Promise<void> {
        try {
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            // Create document ID from date (YYYY-MM-DD)
            const dateStr = today.toISOString().split('T')[0]
            const summaryRef = doc(db, 'daily_summary', dateStr)

            // Check if document exists
            const summaryDoc = await getDoc(summaryRef)

            if (summaryDoc.exists()) {
                // Update existing document
                await updateDoc(summaryRef, {
                    totalAmount: increment(amount),
                    transactionCount: increment(1),
                    lastUpdated: new Date()
                })
            } else {
                // Create new document
                await setDoc(summaryRef, {
                    date: today,
                    totalAmount: amount,
                    transactionCount: 1,
                    createdAt: new Date(),
                    lastUpdated: new Date()
                })
            }

        } catch (error) {
            console.error('Error updating daily summary:', error)
            throw error
        }
    }

    /**
     * Decrement daily summary with transaction amount
     * Used when deleting a transaction
     */
    static async decrementDailySummary(amount: number, date?: Timestamp | Date | any): Promise<void> {
        try {
            const targetDate = date ? (date?.toDate ? date.toDate() : new Date(date?.seconds * 1000 || date)) : new Date()
            targetDate.setHours(0, 0, 0, 0)

            const dateStr = targetDate.toISOString().split('T')[0]
            const summaryRef = doc(db, 'daily_summary', dateStr)

            const summaryDoc = await getDoc(summaryRef)

            if (summaryDoc.exists()) {
                await updateDoc(summaryRef, {
                    totalAmount: increment(-amount),
                    transactionCount: increment(-1),
                    lastUpdated: new Date()
                })
            }
        } catch (error) {
            console.error('Error decrementing daily summary:', error)
        }
    }

    /**
     * Check if a date is today
     */
    static isToday(date: Timestamp | Date | any): boolean {
        if (!date) return false
        const targetDate = date?.toDate ? date.toDate() : new Date(date?.seconds * 1000 || date)
        const today = new Date()
        return (
            targetDate.getDate() === today.getDate() &&
            targetDate.getMonth() === today.getMonth() &&
            targetDate.getFullYear() === today.getFullYear()
        )
    }

    /**
     * Get the most recent daily summary
     */
    static async getLatestSummary(): Promise<any | null> {
        try {
            const q = query(
                collection(db, 'daily_summary'),
                orderBy('date', 'desc'),
                limit(1)
            )
            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0]
                return {
                    id: doc.id,
                    ...doc.data()
                }
            }
            return null
        } catch (error) {
            console.error('Error fetching latest summary:', error)
            return null
        }
    }
}
