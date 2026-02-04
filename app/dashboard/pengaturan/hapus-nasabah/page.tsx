"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, doc, deleteDoc, query, where } from "firebase/firestore"
import { ArrowLeft, Search, Trash2, Users, Building2, CheckCircle2, AlertTriangle, RefreshCcw } from "lucide-react"
import Link from "next/link"

import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Nasabah, NasabahService } from "@/lib/NasabahService"
import { TransaksiNasabahService } from "@/lib/TransaksiNasabahService"
import { Pembeli, PembeliService } from "@/lib/PembeliService"

// Reusing Nasabah interface from service
interface NasabahExtended extends Nasabah {
    hasTransactions: boolean
}

interface PembeliExtended extends Pembeli {
    hasTransactions: boolean
}

export default function DeleteManagerPage() {
    const { toast } = useToast()
    const [nasabah, setNasabah] = useState<NasabahExtended[]>([])
    const [pembeli, setPembeli] = useState<PembeliExtended[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("nasabah")
    const [selectedItems, setSelectedItems] = useState<string[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [nasabahSnap, pembeliSnap, nTrxSnap, bTrxSnap] = await Promise.all([
                getDocs(collection(db, "nasabah")),
                getDocs(collection(db, "pembeli")),
                getDocs(collection(db, "transaksi_nasabah")),
                getDocs(collection(db, "transaksi_bst"))
            ])

            const nTrxSet = new Set(nTrxSnap.docs.map(doc => doc.data().nasabahId))
            const bTrxSet = new Set(bTrxSnap.docs.map(doc => doc.data().buyerId))

            const nasabahData: NasabahExtended[] = nasabahSnap.docs.map(doc => {
                const baseNasabah = NasabahService.mapDoc(doc)
                return {
                    ...baseNasabah,
                    hasTransactions: nTrxSet.has(doc.id)
                }
            })
            setNasabah(nasabahData)

            const pembeliData: PembeliExtended[] = pembeliSnap.docs.map(doc => {
                const basePembeli = PembeliService.mapDoc(doc)
                return {
                    ...basePembeli,
                    hasTransactions: bTrxSet.has(doc.id)
                }
            })
            setPembeli(pembeliData)

        } catch (error) {
            console.error("Error fetching data:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Gagal memuat data",
            })
        } finally {
            setLoading(false)
        }
    }

    const getFilteredData = () => {
        const data = activeTab === "nasabah" ? nasabah : pembeli
        if (!searchQuery) return data
        const q = searchQuery.toLowerCase()
        return data.filter(item =>
            item.nama.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q) ||
            item.alamat.toLowerCase().includes(q)
        )
    }

    const filteredData = getFilteredData()

    const toggleSelect = (id: string, disabled: boolean) => {
        if (disabled) return
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const selectAll = () => {
        const deletableIds = filteredData.filter(i => !i.hasTransactions).map(i => i.firestoreId)
        setSelectedItems(deletableIds)
    }

    const handleDelete = async () => {
        if (selectedItems.length === 0) return
        if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedItems.length} data terpilih?\nTindakan ini tidak dapat dibatalkan.`)) return

        setDeleting(true)
        try {
            if (activeTab === "nasabah") {
                for (const id of selectedItems) {
                    await NasabahService.deleteNasabah(id)
                }
            } else {
                for (const id of selectedItems) {
                    await PembeliService.deletePembeli(id)
                }
            }

            toast({
                title: "Berhasil",
                description: `${selectedItems.length} data berhasil dihapus`,
            })
            setSelectedItems([])
            fetchData()
        } catch (error: any) {
            console.error("Error deleting data:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Gagal menghapus data",
            })
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/pengaturan">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">Hapus Nasabah / Pembeli</h2>
                </div>
                {selectedItems.length > 0 && (
                    <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                        {deleting ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        Hapus {selectedItems.length} Terpilih
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <Tabs defaultValue="nasabah" onValueChange={(val) => { setActiveTab(val); setSelectedItems([]); }}>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <TabsList>
                                <TabsTrigger value="nasabah" className="flex gap-2">
                                    <Users className="h-4 w-4" /> Nasabah
                                </TabsTrigger>
                                <TabsTrigger value="pembeli" className="flex gap-2">
                                    <Building2 className="h-4 w-4" /> Pembeli
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex items-center gap-2 flex-1 md:max-w-sm">
                                <div className="relative w-full">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder={`Cari ${activeTab}...`}
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" onClick={selectAll}>Pilih Semua</Button>
                            </div>
                        </div>
                    </Tabs>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Alamat</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Memuat data...</TableCell>
                                </TableRow>
                            ) : filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Tidak ada data ditemukan</TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((item) => (
                                    <TableRow
                                        key={item.firestoreId}
                                        className={cn(
                                            item.hasTransactions && "opacity-50 grayscale",
                                            selectedItems.includes(item.firestoreId) && "bg-muted"
                                        )}
                                    >
                                        <TableCell>
                                            <Checkbox
                                                disabled={item.hasTransactions}
                                                checked={selectedItems.includes(item.firestoreId)}
                                                onCheckedChange={() => toggleSelect(item.firestoreId, item.hasTransactions)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{item.id}</TableCell>
                                        <TableCell className="font-medium">{item.nama}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{item.alamat}</TableCell>
                                        <TableCell>
                                            {item.hasTransactions ? (
                                                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                                                    <AlertTriangle className="h-3 w-3 mr-1" /> Ada Transaksi
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" /> Siap Hapus
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
