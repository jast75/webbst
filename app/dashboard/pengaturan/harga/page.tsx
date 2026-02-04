"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle2, RefreshCcw, Save, Search, TrendingDown, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { JenisSampahService, JenisSampah } from "@/lib/JenisSampahService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn, formatCurrency, safeParseFloat, validatePrice } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function PriceUpdatePage() {
    const router = useRouter()
    const { toast } = useToast()
    const [jenisSampah, setJenisSampah] = useState<JenisSampah[]>([])
    const [filteredSampah, setFilteredSampah] = useState<JenisSampah[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [updatedItems, setUpdatedItems] = useState<Record<string, { hargaBeli?: string, hargaJual?: string, satuan?: string }>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchJenisSampah()
    }, [])

    useEffect(() => {
        const lowerQuery = searchQuery.toLowerCase()
        const filtered = jenisSampah.filter(
            (item) =>
                item.nama.toLowerCase().includes(lowerQuery) ||
                (item.kategori || '').toLowerCase().includes(lowerQuery)
        )
        setFilteredSampah(filtered)
    }, [searchQuery, jenisSampah])

    const fetchJenisSampah = async () => {
        setLoading(true)
        try {
            const data = await JenisSampahService.getAllJenisSampah()
            setJenisSampah(data)
        } catch (error) {
            console.error("Error fetching jenis sampah:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Gagal memuat data jenis sampah",
            })
        } finally {
            setLoading(false)
        }
    }

    const updateItemValue = (sampahId: string, field: 'hargaBeli' | 'hargaJual' | 'satuan', value: string) => {
        setUpdatedItems(prev => ({
            ...prev,
            [sampahId]: {
                ...prev[sampahId],
                [field]: value
            }
        }))
    }

    const getDisplayValue = (sampah: JenisSampah, field: 'hargaBeli' | 'hargaJual' | 'satuan') => {
        return updatedItems[sampah.id]?.[field] ?? (sampah[field as keyof JenisSampah]?.toString() || '')
    }

    const applyBulkAction = (type: 'increase' | 'decrease') => {
        const percentageInput = prompt(`Masukkan persentase ${type === 'increase' ? 'kenaikan' : 'penurunan'} (contoh: 10 untuk 10%):`)
        if (!percentageInput) return

        const percent = safeParseFloat(percentageInput)
        if (percent <= 0 || percent > 100) {
            alert("Persentase harus antara 1-100")
            return
        }

        const multiplier = type === 'increase' ? (1 + percent / 100) : (1 - percent / 100)
        const newUpdates: Record<string, { hargaBeli: string, hargaJual: string }> = {}

        filteredSampah.forEach(sampah => {
            const currentHargaBeli = safeParseFloat(getDisplayValue(sampah, 'hargaBeli'))
            const currentHargaJual = safeParseFloat(getDisplayValue(sampah, 'hargaJual'))

            newUpdates[sampah.id] = {
                hargaBeli: Math.round(currentHargaBeli * multiplier).toString(),
                hargaJual: Math.round(currentHargaJual * multiplier).toString()
            }
        })

        setUpdatedItems(prev => ({ ...prev, ...newUpdates }))
        toast({
            title: "Berhasil",
            description: `Harga ${type === 'increase' ? 'dinaikkan' : 'diturunkan'} ${percent}% untuk ${filteredSampah.length} jenis sampah`,
        })
    }

    const resetPrices = () => {
        if (confirm("Apakah Anda yakin ingin membatalkan semua perubahan harga?")) {
            setUpdatedItems({})
        }
    }

    const validateAll = () => {
        const errors: string[] = []
        Object.keys(updatedItems).forEach(sampahId => {
            const sampah = jenisSampah.find(s => s.id === sampahId)
            if (!sampah) return

            const updates = updatedItems[sampahId]
            const hBeliStr = updates.hargaBeli ?? sampah.hargaBeli.toString()
            const hJualStr = updates.hargaJual ?? sampah.hargaJual.toString()

            if (updates.hargaBeli !== undefined && !validatePrice(hBeliStr)) errors.push(`${sampah.nama}: Harga beli tidak valid`)
            if (updates.hargaJual !== undefined && !validatePrice(hJualStr)) errors.push(`${sampah.nama}: Harga jual tidak valid`)

            const hBeli = safeParseFloat(hBeliStr)
            const hJual = safeParseFloat(hJualStr)

            if (hJual <= hBeli) {
                errors.push(`${sampah.nama}: Harga jual harus lebih besar dari harga beli`)
            }
        })
        return errors
    }

    const saveAll = async () => {
        const errors = validateAll()
        if (errors.length > 0) {
            alert("Validasi Error:\n" + errors.join("\n"))
            return
        }

        setSaving(true)
        try {
            const updates: Array<{
                firestoreId: string;
                hargaBeli?: number;
                hargaJual?: number;
                satuan?: string;
                perubahan?: number;
            }> = []

            Object.keys(updatedItems).forEach(sampahId => {
                const sampah = jenisSampah.find(s => s.id === sampahId)
                if (!sampah) return

                const changes = updatedItems[sampahId]
                const update: any = {
                    firestoreId: sampah.firestoreId
                }

                let hasChange = false

                if (changes.hargaBeli !== undefined && safeParseFloat(changes.hargaBeli) !== sampah.hargaBeli) {
                    const newHargaBeli = safeParseFloat(changes.hargaBeli)
                    update.hargaBeli = newHargaBeli
                    update.perubahan = newHargaBeli - sampah.hargaBeli
                    hasChange = true
                }

                if (changes.hargaJual !== undefined && safeParseFloat(changes.hargaJual) !== sampah.hargaJual) {
                    update.hargaJual = safeParseFloat(changes.hargaJual)
                    hasChange = true
                }

                if (changes.satuan !== undefined && changes.satuan !== sampah.satuan) {
                    update.satuan = changes.satuan
                    hasChange = true
                }

                if (hasChange) {
                    updates.push(update)
                }
            })

            if (updates.length > 0) {
                const updateCount = await JenisSampahService.updatePrices(updates)
                toast({
                    title: "Berhasil",
                    description: `${updateCount} jenis sampah berhasil diperbarui`,
                })
                setUpdatedItems({})
                fetchJenisSampah()
            } else {
                toast({
                    title: "Info",
                    description: "Tidak ada perubahan untuk disimpan",
                })
            }
        } catch (error) {
            console.error("Error saving prices:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Gagal menyimpan perubahan",
            })
        } finally {
            setSaving(false)
        }
    }

    const changedItemsCount = Object.keys(updatedItems).length

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/pengaturan">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Update Harga</h2>
                </div>
                {changedItemsCount > 0 && (
                    <Button onClick={saveAll} disabled={saving}>
                        {saving ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Simpan {changedItemsCount} Perubahan
                    </Button>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Aksi Massal</CardTitle>
                        <CardDescription>Terapkan penyesuaian harga ke semua item yang tampil</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => applyBulkAction('increase')}>
                            <TrendingUp className="mr-2 h-4 w-4 text-green-600" /> Naikkan
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => applyBulkAction('decrease')}>
                            <TrendingDown className="mr-2 h-4 w-4 text-red-600" /> Turunkan
                        </Button>
                        <Button variant="outline" size="sm" onClick={resetPrices}>
                            <RefreshCcw className="h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                <Card className="md:col-span-1 lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle>Filter & Cari</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama atau kategori sampah..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Jenis Sampah</TableHead>
                                    <TableHead className="hidden sm:table-cell">Kategori</TableHead>
                                    <TableHead className="w-[100px]">Satuan</TableHead>
                                    <TableHead className="text-right w-[150px] md:w-[180px]">Harga Beli (Rp)</TableHead>
                                    <TableHead className="text-right w-[150px] md:w-[180px]">Harga Jual (Rp)</TableHead>
                                    <TableHead className="text-right w-[100px] md:w-[120px]">Margin</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                                    </TableRow>
                                ) : filteredSampah.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Tidak ada data ditemukan</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredSampah.map((sampah) => {
                                        const hBeli = safeParseFloat(getDisplayValue(sampah, 'hargaBeli'))
                                        const hJual = safeParseFloat(getDisplayValue(sampah, 'hargaJual'))
                                        const margin = hJual - hBeli
                                        const hasChanges = !!updatedItems[sampah.id]

                                        return (
                                            <TableRow key={sampah.id} className={cn(hasChanges && "bg-green-50/50 dark:bg-green-900/10")}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {sampah.nama}
                                                        {hasChanges && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">{sampah.kategori || '-'}</TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="text"
                                                        className="h-8 w-full"
                                                        value={getDisplayValue(sampah, 'satuan')}
                                                        onChange={(e) => updateItemValue(sampah.id, 'satuan', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="text"
                                                        className="text-right h-8"
                                                        value={getDisplayValue(sampah, 'hargaBeli')}
                                                        onChange={(e) => updateItemValue(sampah.id, 'hargaBeli', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="text"
                                                        className="text-right h-8"
                                                        value={getDisplayValue(sampah, 'hargaJual')}
                                                        onChange={(e) => updateItemValue(sampah.id, 'hargaJual', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right font-medium text-blue-600">
                                                    {formatCurrency(margin)}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
