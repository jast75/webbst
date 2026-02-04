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
    jenisSampah: string
    berat: number
    hargaBeli: number
    subtotal: number
}

interface Transaction {
    id: string
    nasabahId: string
    tanggal: any
    total: number
    items: TransactionItem[]
}

export default function TransaksiDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { getNasabahById, getJenisSampahById, settings } = useApp()
    const { toast } = useToast()

    const [transaction, setTransaction] = useState<Transaction | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTransaction()
    }, [params.id])

    const fetchTransaction = async () => {
        try {
            const docRef = doc(db, 'transaksi_nasabah', params.id as string)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const data = docSnap.data()

                // Round subtotals and total
                const itemsWithRoundedSubtotal = data.items.map((item: TransactionItem) => ({
                    ...item,
                    subtotal: Math.round(item.subtotal || 0)
                }))

                setTransaction({
                    id: docSnap.id,
                    nasabahId: data.nasabahId || '',
                    tanggal: data.tanggal,
                    total: Math.round(data.total || 0),
                    items: itemsWithRoundedSubtotal
                })
            } else {
                toast({
                    title: "Transaksi tidak ditemukan",
                    description: "Data transaksi yang Anda cari tidak tersedia.",
                    variant: "destructive",
                })
                router.push('/dashboard/transaksi')
            }
        } catch (error) {
            console.error('Error fetching transaction:', error)
            toast({
                title: "Gagal memuat transaksi",
                description: "Terjadi kesalahan saat mengambil data transaksi.",
                variant: "destructive",
            })
            router.push('/dashboard/transaksi')
        } finally {
            setLoading(false)
        }
    }

    const shareTransaction = async () => {
        if (!transaction) return

        const nasabah = getNasabahById(transaction.nasabahId)

        let content = `Detail Transaksi Nasabah\n`
        content += `Tanggal: ${formatDate(transaction.tanggal)}\n\n`

        if (nasabah) {
            content += `Nasabah: ${nasabah.nama}\n`
            content += `ID: ${nasabah.id}\n\n`
        }

        content += "Item Transaksi:\n"
        transaction.items?.forEach((item, index) => {
            const sampah = getJenisSampahById(item.jenisSampah)
            const unit = sampah?.satuan || 'kg'
            content += `${index + 1}. ${sampah?.nama || 'Unknown'} (${item.berat}${unit})\n`
            content += `   Harga: ${formatCurrency(item.hargaBeli, settings.currency)}/${unit}\n`
            content += `   Subtotal: ${formatCurrency(Math.round(item.subtotal), settings.currency)}\n\n`
        })

        content += `Total: ${formatCurrency(Math.round(transaction.total), settings.currency)}\n`

        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Detail Transaksi ${transaction.id}`,
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

    const nasabah = getNasabahById(transaction.nasabahId)

    return (
        <div className="flex-1 space-y-4 p-8 pt-6 print:p-0">
            <div className="flex items-center justify-between no-print">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/transaksi">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight">Detail Transaksi Nasabah</h2>
                </div>
                <Button variant="outline" onClick={shareTransaction}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Bagikan
                </Button>
            </div>

            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-2">
                            <span className="text-muted-foreground">ID Transaksi:</span>
                            <span className="font-medium break-all">{transaction.id}</span>

                            <span className="text-muted-foreground">Tanggal:</span>
                            <span className="font-medium">{formatDate(transaction.tanggal)}</span>

                            {nasabah && (
                                <>
                                    <span className="text-muted-foreground">Nasabah:</span>
                                    <span className="font-medium">{nasabah.nama}</span>

                                    <span className="text-muted-foreground">ID Nasabah:</span>
                                    <span className="font-medium">{nasabah.id}</span>

                                    <span className="text-muted-foreground">Saldo Sebelum:</span>
                                    <span className="font-medium text-right text-xs md:text-sm">
                                        {formatCurrency(Math.round((nasabah.saldo || 0) - (transaction.total || 0)), settings.currency)}
                                    </span>

                                    <span className="text-muted-foreground">Saldo Setelah:</span>
                                    <span className="font-medium text-right text-xs md:text-sm">
                                        {formatCurrency(Math.round(nasabah.saldo || 0), settings.currency)}
                                    </span>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Item Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {transaction.items?.map((item, index) => {
                            const sampah = getJenisSampahById(item.jenisSampah)

                            return (
                                <Card key={index}>
                                    <CardHeader>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                                #{index + 1}
                                            </div>
                                            <CardTitle className="text-base">
                                                {sampah?.nama || 'Unknown Item'}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Kategori:</span>
                                            <span>{sampah?.kategori || '-'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Berat:</span>
                                            <span>{item.berat} {sampah?.satuan || 'kg'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Harga Beli:</span>
                                            <span>{formatCurrency(item.hargaBeli, settings.currency)}/{sampah?.satuan || 'kg'}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t">
                                            <span className="font-medium">Subtotal:</span>
                                            <span className="font-bold text-primary">
                                                {formatCurrency(Math.round(item.subtotal), settings.currency)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">Total Transaksi:</span>
                            <span className="text-2xl font-bold text-primary">
                                {formatCurrency(Math.round(transaction.total), settings.currency)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center space-x-4 pt-4">
                    <Button variant="outline" onClick={shareTransaction} className="no-print">
                        <Share2 className="mr-2 h-4 w-4" />
                        Bagikan
                    </Button>
                    <Button variant="outline" onClick={handlePrint} className="no-print">
                        <Printer className="mr-2 h-4 w-4" />
                        Cetak
                    </Button>
                </div>
            </div>
        </div>
    )
}
