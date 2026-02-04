"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, writeBatch, doc, deleteDoc, getDoc, increment, orderBy, query, where } from "firebase/firestore"
import { ArrowLeft, ArrowDownCircle, ArrowUpCircle, Search, Trash2, Info, Users, Building2, RefreshCcw } from "lucide-react"
import Link from "next/link"

import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { cn, formatDate, formatCurrency } from "@/lib/utils"
import { DailySummaryService } from "@/lib/DailySummaryService"
import { useToast } from "@/hooks/use-toast"
import { Nasabah, NasabahService } from "@/lib/NasabahService"
import { JenisSampah, JenisSampahService } from "@/lib/JenisSampahService"

interface Transaction {
    id: string
    firestoreId: string
    tanggal: any
    total?: number
    totalPenjualan?: number
    nasabahId?: string
    buyerName?: string
    buyerId?: string
    items: any[]
}

// Reusing interfaces from services

export default function DeleteTransactionPage() {
    const { toast } = useToast()
    const [nasabahTrx, setNasabahTrx] = useState<Transaction[]>([])
    const [bstTrx, setBstTrx] = useState<Transaction[]>([])
    const [nasabahMap, setNasabahMap] = useState<Record<string, string>>({})
    const [jenisSampah, setJenisSampah] = useState<JenisSampah[]>([])
    const [pembeli, setPembeli] = useState<any[]>([])

    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("nasabah")

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [nTrxSnap, bTrxSnap, nasabahSnap, sampahSnap, pembeliSnap] = await Promise.all([
                getDocs(query(collection(db, "transaksi_nasabah"), orderBy("tanggal", "desc"))),
                getDocs(query(collection(db, "transaksi_bst"), orderBy("tanggal", "desc"))),
                getDocs(collection(db, "nasabah")),
                getDocs(collection(db, "jenis_sampah")),
                getDocs(collection(db, "pembeli"))
            ])

            const nTrx: Transaction[] = []
            nTrxSnap.forEach(doc => nTrx.push({ firestoreId: doc.id, ...doc.data() } as any))
            setNasabahTrx(nTrx)

            const bTrx: Transaction[] = []
            bTrxSnap.forEach(doc => bTrx.push({ firestoreId: doc.id, ...doc.data() } as any))
            setBstTrx(bTrx)

            const nMap: Record<string, string> = {}
            nasabahSnap.forEach(doc => {
                const data = doc.data()
                nMap[data.id] = data.nama
            })
            setNasabahMap(nMap)

            const sampah: JenisSampah[] = sampahSnap.docs.map(doc => JenisSampahService.mapDoc(doc))
            setJenisSampah(sampah)

            const p: any[] = []
            pembeliSnap.forEach(doc => {
                const data = doc.data()
                p.push({ id: data.id, firestoreId: doc.id, nama: data.nama })
            })
            setPembeli(p)

        } catch (error) {
            console.error("Error fetching data:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Gagal memuat data transaksi",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteNasabahTrx = async (transaction: Transaction) => {
        if (!confirm(`Hapus transaksi ${transaction.id}?\nSaldo nasabah dan stok sampah akan dikembalikan.`)) return

        setDeleting(transaction.firestoreId)
        try {
            const batch = writeBatch(db)

            // 1. Revert Nasabah Balance
            const nasabahSnap = await getDocs(query(collection(db, "nasabah"), where("id", "==", transaction.nasabahId)))
            if (nasabahSnap.empty) throw new Error("Nasabah tidak ditemukan")
            const nasabahDoc = nasabahSnap.docs[0]
            batch.update(nasabahDoc.ref, {
                saldo: increment(-Math.round(transaction.total || 0))
            })

            // 2. Revert Stock
            for (const item of transaction.items) {
                const sampahData = jenisSampah.find(s => s.id === item.jenisSampah)
                if (sampahData) {
                    batch.update(doc(db, "jenis_sampah", sampahData.firestoreId), {
                        stok: increment(-parseFloat(item.berat))
                    })
                }
            }

            await batch.commit()

            // 3. Delete Trx
            await deleteDoc(doc(db, "transaksi_nasabah", transaction.firestoreId))

            // 4. Update Daily Summary
            if (DailySummaryService.isToday(transaction.tanggal)) {
                await DailySummaryService.decrementDailySummary(Math.round(transaction.total || 0), transaction.tanggal)
            }

            toast({
                title: "Berhasil",
                description: "Transaksi berhasil dihapus",
            })
            fetchData()
        } catch (error: any) {
            console.error("Error deleting nasabah trx:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Gagal menghapus transaksi: " + error.message,
            })
        } finally {
            setDeleting(null)
        }
    }

    const handleDeleteBSTTrx = async (transaction: Transaction) => {
        if (!confirm(`Hapus transaksi ${transaction.id}?\nStok sampah akan dikembalikan.`)) return

        setDeleting(transaction.firestoreId)
        try {
            const batch = writeBatch(db)

            // 1. Revert Stock
            for (const item of transaction.items) {
                const sampahData = jenisSampah.find(s => s.id === item.jenisSampah)
                if (sampahData) {
                    batch.update(doc(db, "jenis_sampah", sampahData.firestoreId), {
                        stok: increment(parseFloat(item.berat))
                    })
                }
            }

            // 2. Update Pembeli stats
            if (transaction.buyerId) {
                const pembeliData = pembeli.find(p => p.id === transaction.buyerId)
                if (pembeliData) {
                    batch.update(doc(db, "pembeli", pembeliData.firestoreId), {
                        totalTransaksi: increment(-1)
                    })
                }
            }

            await batch.commit()

            // 3. Delete Trx
            await deleteDoc(doc(db, "transaksi_bst", transaction.firestoreId))

            toast({
                title: "Berhasil",
                description: "Transaksi berhasil dihapus",
            })
            fetchData()
        } catch (error: any) {
            console.error("Error deleting BST trx:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Gagal menghapus transaksi: " + error.message,
            })
        } finally {
            setDeleting(null)
        }
    }

    const filterTransactions = (list: Transaction[]) => {
        if (!searchQuery) return list
        const q = searchQuery.toLowerCase()
        return list.filter(t =>
            (t.id?.toLowerCase() || "").includes(q) ||
            (t.firestoreId?.toLowerCase() || "").includes(q) ||
            (t.nasabahId && (nasabahMap[t.nasabahId]?.toLowerCase() || "").includes(q)) ||
            (t.buyerName?.toLowerCase() || "").includes(q)
        )
    }

    const displayList = activeTab === "nasabah" ? filterTransactions(nasabahTrx) : filterTransactions(bstTrx)

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/pengaturan">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">Hapus Transaksi</h2>
            </div>

            <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30">
                <CardContent className="p-4 flex gap-3 items-start">
                    <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        Menghapus transaksi akan mengembalikan saldo nasabah dan stok sampah ke kondisi sebelum transaksi dilakukan. Tindakan ini tidak dapat dibatalkan.
                    </p>
                </CardContent>
            </Card>

            <Tabs defaultValue="nasabah" className="space-y-4" onValueChange={setActiveTab}>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="nasabah" className="flex gap-2">
                            <Users className="h-4 w-4" /> Transaksi Nasabah
                        </TabsTrigger>
                        <TabsTrigger value="bst" className="flex gap-2">
                            <Building2 className="h-4 w-4" /> Transaksi Pihak Ketiga
                        </TabsTrigger>
                    </TabsList>

                    <div className="relative w-full md:w-[300px]">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari transaksi..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <TabsContent value="nasabah" className="space-y-4">
                    <TransactionList
                        transactions={displayList}
                        loading={loading}
                        nasabahMap={nasabahMap}
                        onDelete={handleDeleteNasabahTrx}
                        deleting={deleting}
                        type="nasabah"
                    />
                </TabsContent>

                <TabsContent value="bst" className="space-y-4">
                    <TransactionList
                        transactions={displayList}
                        loading={loading}
                        onDelete={handleDeleteBSTTrx}
                        deleting={deleting}
                        type="bst"
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

function TransactionList({ transactions, loading, nasabahMap, onDelete, deleting, type }: any) {
    if (loading) return <div className="text-center py-12 text-muted-foreground">Memuat data...</div>
    if (transactions.length === 0) return <div className="text-center py-12 text-muted-foreground">Tidak ada transaksi ditemukan</div>

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {transactions.map((t: any) => (
                <Card key={t.firestoreId} className="overflow-hidden group">
                    <div className={cn(
                        "h-1 w-full",
                        type === 'nasabah' ? "bg-green-500" : "bg-blue-500"
                    )} />
                    <CardHeader className="p-4 bg-muted/30">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="text-sm font-mono tracking-tight">{t.id}</CardTitle>
                                <CardDescription>{formatDate(t.tanggal)}</CardDescription>
                            </div>
                            {type === 'nasabah' ? (
                                <ArrowDownCircle className="h-5 w-5 text-green-600" />
                            ) : (
                                <ArrowUpCircle className="h-5 w-5 text-blue-600" />
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                {type === 'nasabah' ? "Nasabah" : "Pembeli"}
                            </p>
                            <p className="font-medium">
                                {type === 'nasabah' ? (nasabahMap[t.nasabahId] || "Nasabah Tidak Dikenal") : (t.buyerName || "Pembeli Manual")}
                            </p>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Nilai</p>
                                <p className={cn(
                                    "text-xl font-bold",
                                    type === 'nasabah' ? "text-green-600" : "text-blue-600"
                                )}>
                                    {formatCurrency(type === 'nasabah' ? (t.total || 0) : (t.totalPenjualan || 0))}
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(t)}
                                disabled={deleting === t.firestoreId}
                            >
                                {deleting === t.firestoreId ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                                Hapus
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
