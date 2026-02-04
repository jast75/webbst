"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Timestamp } from "firebase/firestore"
import Link from "next/link"
import { ArrowLeft, Trash2, Plus } from "lucide-react"
import { TransaksiBSTService } from "@/lib/TransaksiBSTService"
import { Pembeli, PembeliService } from "@/lib/PembeliService"
import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"

interface TransactionItem {
    jenisSampah: string | null
    berat: string
    hargaJual: number
    subtotal: number
}


export default function CreatePihakKetigaPage() {
    const router = useRouter()
    const { jenisSampah, settings, getJenisSampahById } = useApp()

    const [buyerType, setBuyerType] = useState<'registered' | 'manual'>('manual')
    const [pembeliList, setPembeliList] = useState<Pembeli[]>([])
    const [selectedPembeliId, setSelectedPembeliId] = useState<string>("")
    const [manualBuyerName, setManualBuyerName] = useState<string>("")

    const [items, setItems] = useState<TransactionItem[]>([
        { jenisSampah: null, berat: "", hargaJual: 0, subtotal: 0 }
    ])


    // Financials
    const [totalPenjualan, setTotalPenjualan] = useState(0)
    const [totalPembelian, setTotalPembelian] = useState(0)
    const [keuntungan, setKeuntungan] = useState(0)

    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchPembeli()
    }, [])

    const fetchPembeli = async () => {
        try {
            const data = await PembeliService.getAllPembeli();
            setPembeliList(data)
        } catch (error) {
            console.error("Error fetching pembeli:", error)
        } finally {
            setPageLoading(false)
        }
    }

    const updateItem = (index: number, field: keyof TransactionItem, value: any) => {
        const newItems = [...items]

        if (field === 'jenisSampah') {
            const selectedSampah = getJenisSampahById(value)
            newItems[index].jenisSampah = value
            newItems[index].hargaJual = selectedSampah?.hargaJual || 0

            // Recalculate subtotal if berat is already set
            if (newItems[index].berat) {
                const rawSubtotal = (selectedSampah?.hargaJual || 0) * parseFloat(newItems[index].berat)
                newItems[index].subtotal = Math.round(rawSubtotal)
            }
        } else if (field === 'berat') {
            newItems[index].berat = value
            if (newItems[index].jenisSampah) {
                newItems[index].subtotal = Math.round(newItems[index].hargaJual * parseFloat(value || '0'))
            }
        }

        setItems(newItems)
        calculateTotals(newItems)
    }

    const addItem = () => {
        setItems([...items, { jenisSampah: null, berat: "", hargaJual: 0, subtotal: 0 }])
    }

    const removeItem = (index: number) => {
        if (items.length === 1) return

        const newItems = [...items]
        newItems.splice(index, 1)
        setItems(newItems)
        calculateTotals(newItems)
    }

    const calculateTotals = (items: TransactionItem[]) => {
        const penjualan = items.reduce((sum, item) => sum + (item.subtotal || 0), 0)

        const pembelian = items.reduce((sum, item) => {
            if (!item.jenisSampah) return sum
            const sampah = getJenisSampahById(item.jenisSampah)
            return sum + ((sampah?.hargaBeli || 0) * parseFloat(item.berat || '0'))
        }, 0)

        setTotalPenjualan(Math.round(penjualan))
        setTotalPembelian(Math.round(pembelian))
        setKeuntungan(Math.round(penjualan - pembelian))
    }

    const validateTransaction = (): string | null => {
        if (buyerType === 'registered' && !selectedPembeliId) {
            return 'Pilih pembeli terlebih dahulu'
        }
        if (buyerType === 'manual' && !manualBuyerName.trim()) {
            return 'Masukkan nama pembeli'
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            if (!item.jenisSampah) {
                return `Pilih jenis sampah untuk item ${i + 1}`
            }

            if (!item.berat || parseFloat(item.berat) <= 0) {
                return `Masukkan berat yang valid untuk item ${i + 1}`
            }
        }

        return null
    }

    const saveTransaction = async () => {
        const validationError = validateTransaction()
        if (validationError) {
            setError(validationError)
            return
        }

        setLoading(true)
        setError(null)

        try {
            let buyerName = manualBuyerName
            let buyerId = undefined

            if (buyerType === 'registered') {
                const selectedPembeli = pembeliList.find(p => p.firestoreId === selectedPembeliId || p.id === selectedPembeliId)
                if (selectedPembeli) {
                    buyerName = selectedPembeli.nama
                    buyerId = selectedPembeli.firestoreId || selectedPembeli.id
                }
            }

            const transactionData = {
                buyerName,
                buyerId,
                buyerType,
                tanggal: Timestamp.fromDate(new Date()),
                totalPenjualan,
                totalPembelian,
                keuntungan,
                items: items.map(item => {
                    const sampah = getJenisSampahById(item.jenisSampah!)
                    return {
                        jenisSampahId: sampah?.firestoreId || items[0].jenisSampah!,
                        nama: sampah?.nama || '',
                        berat: parseFloat(item.berat),
                        hargaJual: item.hargaJual,
                        subtotal: item.subtotal
                    }
                })
            }

            const transId = await TransaksiBSTService.createSale(transactionData);

            // Navigate to detail
            router.push(`/dashboard/pihak-ketiga/${transId}`)

        } catch (error: any) {
            console.error('Error saving transaction:', error)
            setError(error.message || 'Gagal menyimpan transaksi')
        } finally {
            setLoading(false)
        }
    }

    if (pageLoading) {
        return <div className="p-8">Loading...</div>
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/pihak-ketiga">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight">Penjualan Baru</h2>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Data Pembeli</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex space-x-4">
                            <Button
                                variant={buyerType === 'registered' ? 'default' : 'outline'}
                                onClick={() => setBuyerType('registered')}
                                className="flex-1"
                            >
                                Pembeli Terdaftar
                            </Button>
                            <Button
                                variant={buyerType === 'manual' ? 'default' : 'outline'}
                                onClick={() => setBuyerType('manual')}
                                className="flex-1"
                            >
                                Input Manual
                            </Button>
                        </div>

                        {buyerType === 'registered' ? (
                            <div className="space-y-2">
                                <Label htmlFor="pembeli">Pilih Pembeli</Label>
                                <Select
                                    id="pembeli"
                                    value={selectedPembeliId}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPembeliId(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="">Pilih Pembeli...</option>
                                    {pembeliList.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nama} {p.perusahaan ? `(${p.perusahaan})` : ''}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="manualName">Nama Pembeli</Label>
                                <Input
                                    id="manualName"
                                    placeholder="Masukkan nama pembeli"
                                    value={manualBuyerName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualBuyerName(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Item Sampah</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {items.map((item, index) => {
                            const selectedSampah = getJenisSampahById(item.jenisSampah || '')

                            return (
                                <Card key={index}>
                                    <CardHeader className="py-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base">Item #{index + 1}</CardTitle>
                                            {items.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(index)}
                                                    disabled={loading}
                                                    className="h-8 w-8 text-red-500"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="py-4 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`sampah-${index}`}>Jenis Sampah</Label>
                                            <Select
                                                id={`sampah-${index}`}
                                                value={item.jenisSampah || ''}
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateItem(index, 'jenisSampah', e.target.value)}
                                                disabled={loading}
                                            >
                                                <option value="">Pilih Jenis Sampah...</option>
                                                {jenisSampah.map((s) => (
                                                    <option key={s.id} value={s.id}>
                                                        {s.nama} (Stok: {s.stok}{s.satuan || 'kg'})
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`berat-${index}`}>Jumlah ({selectedSampah?.satuan || 'kg'})</Label>
                                            <Input
                                                id={`berat-${index}`}
                                                type="number"
                                                step="0.01"
                                                placeholder={`Masukkan ${selectedSampah?.satuan === 'buah' ? 'jumlah' : 'berat'}`}
                                                value={item.berat}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateItem(index, 'berat', e.target.value)}
                                                disabled={loading}
                                            />
                                        </div>

                                        {item.jenisSampah && selectedSampah && (
                                            <div className="space-y-2 pt-2 border-t bg-slate-50 p-2 rounded">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Harga Jual:</span>
                                                    <span className="font-medium">
                                                        {formatCurrency(item.hargaJual, settings.currency)}/{selectedSampah.satuan || 'kg'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Subtotal:</span>
                                                    <span className="font-bold text-primary">
                                                        {formatCurrency(item.subtotal, settings.currency)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}

                        <Button
                            variant="outline"
                            onClick={addItem}
                            disabled={loading}
                            className="w-full"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Item Lain
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Total Penjualan:</span>
                                <span className="font-medium text-lg">
                                    {formatCurrency(totalPenjualan, settings.currency)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Total Modal (Beli):</span>
                                <span className="font-medium text-lg">
                                    {formatCurrency(totalPembelian, settings.currency)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-t pt-2 mt-2">
                                <span className="text-lg font-bold">Keuntungan:</span>
                                <span className="text-2xl font-bold text-green-600">
                                    {formatCurrency(keuntungan, settings.currency)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end space-x-2 pb-8">
                    <Link href="/dashboard/pihak-ketiga">
                        <Button variant="outline" disabled={loading}>
                            Batal
                        </Button>
                    </Link>
                    <Button
                        onClick={saveTransaction}
                        disabled={totalPenjualan === 0 || loading}
                    >
                        {loading ? "Menyimpan..." : "Simpan Transaksi"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
