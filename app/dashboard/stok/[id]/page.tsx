"use client"

import { useMemo, useState, useEffect } from "react"
import { use } from "react"
import { ArrowLeft, Package, DollarSign, Tag, Info, AlertTriangle, Edit3 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { JenisSampahService } from "@/lib/JenisSampahService"
import { useToast } from "@/hooks/use-toast"

export default function StokDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { getJenisSampahById, loading } = useApp()
    const router = useRouter()
    const { toast } = useToast()

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [amount, setAmount] = useState<string>("")
    const [adjustmentType, setAdjustmentType] = useState<string>("tambah")
    const [keterangan, setKeterangan] = useState("")
    const [refreshKey, setRefreshKey] = useState(0)

    const item = useMemo(() => getJenisSampahById(id), [getJenisSampahById, id])

    const handleUpdateStock = async () => {
        if (!item || !amount || isNaN(parseFloat(amount))) {
            toast({
                title: "Error",
                description: "Jumlah harus berupa angka valid",
                variant: "destructive"
            })
            return
        }

        setIsSubmitting(true)
        try {
            await JenisSampahService.updateStock(
                item.firestoreId,
                parseFloat(amount),
                adjustmentType as 'tambah' | 'kurang' | 'set',
                keterangan || `Update manual via dashboard`
            )

            toast({
                title: "Berhasil",
                description: `Stok ${item.nama} berhasil diperbarui`,
            })
            setIsUpdateModalOpen(false)
            setAmount("")
            setKeterangan("")
            setRefreshKey(prev => prev + 1)
        } catch (error) {
            toast({
                title: "Error",
                description: "Gagal memperbarui stok",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
            </div>
        )
    }

    if (!item) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center h-[50vh]">
                <Package className="mb-4 h-12 w-12 opacity-20" />
                <h3 className="text-xl font-bold">Jenis Sampah Tidak Ditemukan</h3>
                <p className="text-muted-foreground mt-2">Data sampah dengan ID tersebut tidak ada.</p>
                <Button className="mt-4" onClick={() => router.push("/dashboard/stok")}>
                    Kembali ke Daftar Stok
                </Button>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/dashboard/stok">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Detail Sampah</h2>
                </div>

                <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                            <Edit3 className="mr-2 h-4 w-4" />
                            Update Stok
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Stok: {item.nama}</DialogTitle>
                            <DialogDescription>
                                Perbarui jumlah stok secara manual di gudang.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="type">Jenis Penyesuaian</Label>
                                <Select
                                    id="type"
                                    value={adjustmentType}
                                    onChange={(e) => setAdjustmentType(e.target.value)}
                                >
                                    <option value="tambah">Tambah (+) ke stok saat ini</option>
                                    <option value="kurang">Kurang (-) dari stok saat ini</option>
                                    <option value="set">Atur ulang (Set) stok total</option>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Jumlah ({item.satuan || 'kg'})</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder={`Contoh: ${item.satuan === 'buah' ? '10' : '10.5'}`}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="desc">Keterangan (Opsional)</Label>
                                <Input
                                    id="desc"
                                    placeholder="Contoh: Koreksi stok bulanan"
                                    value={keterangan}
                                    onChange={(e) => setKeterangan(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>Batal</Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={handleUpdateStock}
                                disabled={isSubmitting || !amount}
                            >
                                {isSubmitting ? "Memproses..." : "Simpan Perubahan"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1 md:col-span-2 lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">{item.nama}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">ID: {item.id}</p>
                            </div>
                            <Badge variant={item.stok < 10 ? "destructive" : item.stok < 20 ? "warning" : "success"} className="text-sm px-4 py-1">
                                Stok: {item.stok.toFixed(item.satuan === 'buah' ? 0 : 2)} {item.satuan || 'kg'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-start space-x-3">
                                <Tag className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Kategori</p>
                                    <p className="text-lg">{item.kategori || "Tidak ada kategori"}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Package className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Stok Saat Ini</p>
                                    <p className="text-lg font-bold">{item.stok.toFixed(item.satuan === 'buah' ? 0 : 2)} {item.satuan || 'kg'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                            <div className="flex items-start space-x-3">
                                <DollarSign className="h-5 w-5 text-red-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Harga Beli (Nasabah)</p>
                                    <p className="text-lg font-bold text-red-600">
                                        Rp {item.hargaBeli.toLocaleString("id-ID")}/{item.satuan || 'kg'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <DollarSign className="h-5 w-5 text-green-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Harga Jual (Pihak Ketiga)</p>
                                    <p className="text-lg font-bold text-green-600">
                                        Rp {item.hargaJual.toLocaleString("id-ID")}/{item.satuan || 'kg'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {item.kategori && (
                            <div className="pt-4 border-t">
                                <div className="flex items-start space-x-3">
                                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Deskripsi</p>
                                        <p className="text-base text-gray-700 dark:text-gray-300 mt-1">
                                            Jenis sampah ini termasuk dalam kategori {item.kategori.toLowerCase()}.
                                            Harga beli dari nasabah adalah Rp {item.hargaBeli.toLocaleString("id-ID")} dan
                                            dijual kembali seharga Rp {item.hargaJual.toLocaleString("id-ID")}.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1 lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Analisis Profit</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm text-muted-foreground">Profit per {item.satuan || 'kg'}</span>
                            <span className="font-bold text-green-600">
                                Rp {(item.hargaJual - item.hargaBeli).toLocaleString("id-ID")}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm text-muted-foreground">Estimasi Profit Total</span>
                            <span className="font-bold text-green-600">
                                Rp {((item.hargaJual - item.hargaBeli) * item.stok).toLocaleString("id-ID")}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm text-muted-foreground">Nilai Aset (Beli)</span>
                            <span className="font-bold">
                                Rp {(item.hargaBeli * item.stok).toLocaleString("id-ID")}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Nilai Jual Total</span>
                            <span className="font-bold">
                                Rp {(item.hargaJual * item.stok).toLocaleString("id-ID")}
                            </span>
                        </div>

                        <div className="mt-6 pt-4 bg-muted/50 p-4 rounded-lg">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                <AlertTriangle className="h-3 w-3 inline mr-1 text-orange-500" />
                                <strong>Catatan:</strong> Profit dihitung berdasarkan selisih harga jual dan harga beli dikalikan dengan stok saat ini.
                                Belum termasuk biaya operasional atau penyusutan.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                        <Package className="mr-2 h-5 w-5" />
                        Riwayat Perubahan Stok
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <StockLogsList firestoreId={item.firestoreId} refreshKey={refreshKey} unit={item.satuan || 'kg'} />
                </CardContent>
            </Card>
        </div>
    )
}

function StockLogsList({ firestoreId, refreshKey, unit }: { firestoreId: string, refreshKey: number, unit: string }) {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchLogs = async () => {
        try {
            const data = await JenisSampahService.getLogsByJenisSampah(firestoreId)
            setLogs(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [firestoreId, refreshKey])

    if (loading) return <div className="py-4 text-center text-muted-foreground">Memuat riwayat...</div>
    if (logs.length === 0) return <div className="py-4 text-center text-muted-foreground">Belum ada riwayat perubahan manual</div>

    return (
        <div className="space-y-4">
            {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                        <Badge variant={log.type === 'tambah' ? 'success' : log.type === 'kurang' ? 'destructive' : 'default'} className="w-20 justify-center">
                            {log.type === 'tambah' ? '+ ' : log.type === 'kurang' ? '- ' : ''}
                            {Math.abs(log.adjustment).toFixed(unit === 'buah' ? 0 : 2)}
                        </Badge>
                        <div>
                            <p className="text-sm font-medium">{log.keterangan}</p>
                            <p className="text-xs text-muted-foreground">
                                {log.tanggal?.toDate().toLocaleString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Stok Akhir</p>
                        <p className="text-sm font-bold">{log.newStock.toFixed(unit === 'buah' ? 0 : 2)} {unit}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
