"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Timestamp } from "firebase/firestore"
import Link from "next/link"
import { ArrowLeft, Trash2, Plus } from "lucide-react"
import { TransaksiNasabahService, TransaksiItem as ServiceItem } from "@/lib/TransaksiNasabahService"
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
    hargaBeli: number
    subtotal: number
}

export default function CreateTransaksiPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { nasabah, jenisSampah, settings, getNasabahById, getJenisSampahById } = useApp()

    const [selectedNasabahId, setSelectedNasabahId] = useState<string>("")
    const [items, setItems] = useState<TransactionItem[]>([
        { jenisSampah: null, berat: "", hargaBeli: 0, subtotal: 0 }
    ])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Pre-select nasabah if nasabahId is provided in query params
    useEffect(() => {
        const nasabahId = searchParams.get('nasabahId')
        if (nasabahId && nasabah.length > 0) {
            const preSelectedNasabah = getNasabahById(nasabahId)
            if (preSelectedNasabah) {
                setSelectedNasabahId(preSelectedNasabah.id)
            }
        }
    }, [searchParams, nasabah, getNasabahById])

    const updateItem = (index: number, field: keyof TransactionItem, value: any) => {
        const newItems = [...items]

        if (field === 'jenisSampah') {
            const selectedSampah = getJenisSampahById(value)
            newItems[index].jenisSampah = value
            newItems[index].hargaBeli = selectedSampah?.hargaBeli || 0

            // Recalculate subtotal if berat is already set
            if (newItems[index].berat) {
                const rawSubtotal = (selectedSampah?.hargaBeli || 0) * parseFloat(newItems[index].berat)
                newItems[index].subtotal = Math.round(rawSubtotal)
            }
        } else if (field === 'berat') {
            newItems[index].berat = value
            if (newItems[index].jenisSampah) {
                const rawSubtotal = newItems[index].hargaBeli * parseFloat(value || '0')
                newItems[index].subtotal = Math.round(rawSubtotal)
            }
        }

        setItems(newItems)
        calculateTotal(newItems)
    }

    const addItem = () => {
        setItems([...items, { jenisSampah: null, berat: "", hargaBeli: 0, subtotal: 0 }])
    }

    const removeItem = (index: number) => {
        if (items.length === 1) return

        const newItems = [...items]
        newItems.splice(index, 1)
        setItems(newItems)
        calculateTotal(newItems)
    }

    const calculateTotal = (items: TransactionItem[]) => {
        const rawTotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0)
        setTotal(Math.round(rawTotal))
    }

    const validateTransaction = (): string | null => {
        if (!selectedNasabahId) {
            return 'Pilih nasabah terlebih dahulu'
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
            const selectedNasabah = getNasabahById(selectedNasabahId)
            if (!selectedNasabah) {
                throw new Error('Nasabah tidak ditemukan')
            }

            const transactionData = {
                nasabahId: selectedNasabah.firestoreId || selectedNasabah.id,
                nasabahName: selectedNasabah.nama,
                tanggal: Timestamp.fromDate(new Date()),
                total: total,
                items: items.map(item => {
                    const sampah = getJenisSampahById(item.jenisSampah!)
                    return {
                        jenisSampahId: sampah?.firestoreId || items[0].jenisSampah!,
                        namaSampah: sampah?.nama || '',
                        berat: parseFloat(item.berat),
                        hargaBeli: item.hargaBeli,
                        subtotal: item.subtotal
                    }
                })
            }

            const transactionId = await TransaksiNasabahService.createTransaction(transactionData);

            // Navigate to transaction detail page
            router.push(`/dashboard/transaksi/${transactionId}`)

        } catch (error: any) {
            console.error('Error saving transaction:', error)
            setError(error.message || 'Gagal menyimpan transaksi')
            setLoading(false)
        }
    }

    const selectedNasabah = getNasabahById(selectedNasabahId)

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/transaksi">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight">Transaksi Nasabah Baru</h2>
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
                        <CardTitle>Data Nasabah</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="nasabah">Pilih Nasabah</Label>
                            <Select
                                id="nasabah"
                                value={selectedNasabahId}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedNasabahId(e.target.value)}
                                disabled={loading}
                            >
                                <option value="">Pilih Nasabah...</option>
                                {nasabah.map((n) => (
                                    <option key={n.id} value={n.id}>
                                        {n.nama} ({n.id})
                                    </option>
                                ))}
                            </Select>
                            {selectedNasabah && (
                                <div className="mt-2 text-sm text-muted-foreground">
                                    Saldo saat ini: {formatCurrency(Math.round(selectedNasabah.saldo), settings.currency)}
                                </div>
                            )}
                        </div>
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
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base">Item #{index + 1}</CardTitle>
                                            {items.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(index)}
                                                    disabled={loading}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
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
                                                        {s.nama} ({s.kategori || 'Umum'})
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
                                            <div className="space-y-2 pt-2 border-t">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Harga Beli:</span>
                                                    <span className="font-medium">
                                                        {formatCurrency(item.hargaBeli, settings.currency)}/{selectedSampah.satuan || 'kg'}
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
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">Total Transaksi:</span>
                            <span className="text-2xl font-bold text-primary">
                                {formatCurrency(total, settings.currency)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end space-x-2">
                    <Link href="/dashboard/transaksi">
                        <Button variant="outline" disabled={loading}>
                            Batal
                        </Button>
                    </Link>
                    <Button
                        onClick={saveTransaction}
                        disabled={total === 0 || loading}
                    >
                        {loading ? "Menyimpan..." : "Simpan Transaksi"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
