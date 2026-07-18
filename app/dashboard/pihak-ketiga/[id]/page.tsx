"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { ArrowLeft, Share2, Printer } from "lucide-react"
import Link from "next/link"

import { db } from "@/lib/firebase"
import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatCurrency } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface TransactionItem {
    jenisSampahId: string
    nama: string
    berat: number
    hargaJual: number
    subtotal: number
}

interface Transaction {
    id: string
    buyerName: string
    buyerId?: string
    buyerType?: string
    tanggal: any
    totalPenjualan: number
    totalPembelian: number
    keuntungan: number
    items: TransactionItem[]
}

export default function PihakKetigaDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { getJenisSampahById, settings } = useApp()
    const { toast } = useToast()

    const [transaction, setTransaction] = useState<Transaction | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            fetchTransaction()
        }
    }, [params.id])

    const fetchTransaction = async () => {
        try {
            const docRef = doc(db, 'transaksi_bst', params.id as string)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const data = docSnap.data()

                setTransaction({
                    id: docSnap.id,
                    buyerName: data.buyerName || 'Umum',
                    buyerId: data.buyerId,
                    buyerType: data.buyerType,
                    tanggal: data.tanggal,
                    totalPenjualan: data.totalPenjualan || 0,
                    totalPembelian: data.totalPembelian || 0,
                    keuntungan: data.keuntungan || 0,
                    items: data.items || []
                })
            } else {
                toast({
                    title: "Transaksi tidak ditemukan",
                    description: "Data transaksi yang Anda cari tidak tersedia.",
                    variant: "destructive",
                })
                router.push('/dashboard/pihak-ketiga')
            }
        } catch (error) {
            console.error('Error fetching transaction:', error)
            toast({
                title: "Gagal memuat transaksi",
                description: "Terjadi kesalahan saat mengambil data transaksi.",
                variant: "destructive",
            })
            router.push('/dashboard/pihak-ketiga')
        } finally {
            setLoading(false)
        }
    }

    const shareTransaction = async () => {
        if (!transaction) return

        let content = `Penjualan Pihak Ketiga\n`
        content += `Tanggal: ${formatDate(transaction.tanggal)}\n`
        content += `Pembeli: ${transaction.buyerName} (${transaction.buyerType === 'registered' ? 'Terdaftar' : 'Manual'})\n\n`

        content += "Item Terjual:\n"
        transaction.items?.forEach((item, index) => {
            const sampah = getJenisSampahById(item.jenisSampahId)
            const unit = sampah?.satuan || 'kg'
            content += `${index + 1}. ${sampah?.nama || item.nama || 'Unknown'} (${item.berat}${unit})\n`
            content += `   Harga: ${formatCurrency(item.hargaJual, settings.currency)}/${unit}\n`
            content += `   Subtotal: ${formatCurrency(Math.round(item.subtotal), settings.currency)}\n\n`
        })

        content += `Total Penjualan: ${formatCurrency(Math.round(transaction.totalPenjualan), settings.currency)}\n`
        content += `Keuntungan: ${formatCurrency(Math.round(transaction.keuntungan), settings.currency)}\n`

        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Detail Penjualan ${transaction.id}`,
                    text: content
                })
            } else {
                await navigator.clipboard.writeText(content)
                toast({
                    title: "Berhasil",
                    description: "Detail transaksi disalin ke clipboard",
                })
            }
        } catch (error) {
            console.error('Error sharing transaction:', error)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    if (loading || !transaction) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6 print:p-0">
            <div className="flex items-center justify-between no-print">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/pihak-ketiga">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight">Detail Penjualan</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={shareTransaction}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Bagikan
                    </Button>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Cetak
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Informasi Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2">
                            <span className="text-muted-foreground">ID Transaksi:</span>
                            <span className="font-medium text-xs md:text-sm break-all">{transaction.id}</span>

                            <span className="text-muted-foreground">Tanggal:</span>
                            <span className="font-medium">{formatDate(transaction.tanggal)}</span>

                            <span className="text-muted-foreground">Pembeli:</span>
                            <span className="font-medium">{transaction.buyerName}</span>

                            <span className="text-muted-foreground">Tipe:</span>
                            <span className="font-medium">
                                {transaction.buyerType === 'registered' ? 'Terdaftar' : 'Manual'}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Ringkasan Keuangan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-2">
                            <span className="text-muted-foreground">Total Penjualan:</span>
                            <span className="font-medium text-right">
                                {formatCurrency(transaction.totalPenjualan, settings.currency)}
                            </span>

                            <span className="text-muted-foreground">Total Modal:</span>
                            <span className="font-medium text-right">
                                {formatCurrency(transaction.totalPembelian, settings.currency)}
                            </span>

                            <div className="col-span-2 border-t pt-2 mt-2 flex justify-between">
                                <span className="font-bold">Keuntungan:</span>
                                <span className="font-bold text-green-600">
                                    {formatCurrency(transaction.keuntungan, settings.currency)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Item Terjual</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {transaction.items?.map((item, index) => {
                            const sampah = getJenisSampahById(item.jenisSampahId)

                            return (
                                <Card key={index} className="bg-slate-50">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                                    #{index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{sampah?.nama || item.nama || 'Unknown Item'}</h3>
                                                    <p className="text-sm text-muted-foreground">{item.berat} {sampah?.satuan || 'kg'}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end">
                                                <div className="text-sm text-muted-foreground">
                                                    Harga: {formatCurrency(item.hargaJual, settings.currency)}/{sampah?.satuan || 'kg'}
                                                </div>
                                                <div className="font-bold text-primary">
                                                    {formatCurrency(Math.round(item.subtotal), settings.currency)}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center space-x-4 pt-4 no-print">
                <Button variant="outline" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Cetak Invoice
                </Button>
            </div>
        </div>
    )
}
