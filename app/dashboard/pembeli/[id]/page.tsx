"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Pencil, Building2, Mail, Phone, MapPin, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { collection, query, where, getDocs } from "firebase/firestore"

import { db } from "@/lib/firebase"
import { PembeliService, type Pembeli } from "@/lib/PembeliService"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
    id: string
    tanggal: any
    buyerName: string
    totalPenjualan: number
    keuntungan: number
}

export default function PembeliDetailPage() {
    const params = useParams()
    const router = useRouter()
    const pembeliId = params.id as string
    const { toast } = useToast()

    const [pembeli, setPembeli] = useState<Pembeli | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    useEffect(() => {
        if (pembeliId) {
            fetchPembeliData()
        }
    }, [pembeliId])

    const fetchPembeliData = async () => {
        setLoading(true)
        try {
            const pembeliData = await PembeliService.getPembeliById(pembeliId)

            if (!pembeliData) {
                router.push("/dashboard/pembeli")
                return
            }

            setPembeli(pembeliData)

            // Fetch transactions for this pembeli
            // Fix: Use "transaksi_bst" instead of "transaksiBST"
            const transactionsQuery = query(
                collection(db, "transaksi_bst"),
                where("buyerId", "==", pembeliData.firestoreId)
            )
            const querySnapshot = await getDocs(transactionsQuery)
            const transactionsList: Transaction[] = []

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                transactionsList.push({
                    id: data.id || doc.id,
                    tanggal: data.tanggal,
                    buyerName: data.buyerName,
                    totalPenjualan: data.totalPenjualan || 0,
                    keuntungan: data.keuntungan || 0
                })
            })

            // Sort by date descending
            transactionsList.sort((a, b) => {
                const dateA = a.tanggal?.toDate?.() || new Date(a.tanggal)
                const dateB = b.tanggal?.toDate?.() || new Date(b.tanggal)
                return dateB.getTime() - dateA.getTime()
            })

            setTransactions(transactionsList)
        } catch (error) {
            console.error("Error fetching pembeli data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!pembeli) return

        setDeleteLoading(true)
        try {
            await PembeliService.deletePembeli(pembeli.firestoreId)
            toast({
                title: "Berhasil",
                description: "Data pembeli berhasil dihapus",
            })
            router.push('/dashboard/pembeli')
        } catch (error: any) {
            toast({
                title: "Gagal",
                description: error.message || "Gagal menghapus pembeli",
                variant: "destructive"
            })
            setIsDeleteOpen(false)
        } finally {
            setDeleteLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        )
    }

    if (!pembeli) {
        return null
    }

    const totalTransaksi = transactions.length
    const totalPembelian = transactions.reduce((sum, t) => sum + (t.totalPenjualan || 0), 0)
    const totalKeuntungan = transactions.reduce((sum, t) => sum + (t.keuntungan || 0), 0)

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/pembeli">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">Detail Pembeli</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline">
                        <Link href={`/dashboard/pembeli/${pembeli.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Link>
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setIsDeleteOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                    </Button>
                </div>
            </div>

            {/* Profile Section */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={pembeli.foto || undefined} alt={pembeli.nama} />
                            <AvatarFallback className="bg-secondary text-white text-2xl">
                                <Building2 className="h-12 w-12" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-bold">{pembeli.nama}</h3>
                            <p className="text-muted-foreground">ID: {pembeli.id}</p>
                            {pembeli.perusahaan && (
                                <p className="text-lg font-medium text-secondary mt-1">{pembeli.perusahaan}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Kontak</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Alamat</p>
                                <p className="text-sm text-muted-foreground">{pembeli.alamat || '-'}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">No. Telepon</p>
                                <p className="text-sm text-muted-foreground">{pembeli.noTelp || '-'}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-sm text-muted-foreground">{pembeli.email || '-'}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Perusahaan</p>
                                <p className="text-sm text-muted-foreground">{pembeli.perusahaan || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Statistik Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <p className="text-sm font-medium text-muted-foreground">Total Transaksi</p>
                                <p className="text-2xl font-bold text-secondary">{totalTransaksi}</p>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <p className="text-sm font-medium text-muted-foreground">Total Pembelian</p>
                                <p className="text-2xl font-bold text-secondary">{formatCurrency(totalPembelian)}</p>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <p className="text-sm font-medium text-muted-foreground">Total Keuntungan</p>
                                <p className="text-2xl font-bold text-secondary">{formatCurrency(totalKeuntungan)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction History */}
            <Card>
                <CardHeader>
                    <CardTitle>Riwayat Transaksi ({transactions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <p>Belum ada transaksi</p>
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID Transaksi</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead className="text-right">Total Penjualan</TableHead>
                                        <TableHead className="text-right">Keuntungan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={`/dashboard/transaksi/${transaction.id}`}
                                                    className="hover:underline text-primary"
                                                >
                                                    {transaction.id}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{formatDate(transaction.tanggal, false)}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(transaction.totalPenjualan)}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-green-600">
                                                {formatCurrency(transaction.keuntungan)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Data Pembeli</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus data pembeli <strong>{pembeli.nama}</strong>?
                            Tindakan ini tidak dapat dibatalkan. Pembeli hanya dapat dihapus jika tidak memiliki riwayat transaksi apa pun.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                            disabled={deleteLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                "Hapus Pembeli"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}