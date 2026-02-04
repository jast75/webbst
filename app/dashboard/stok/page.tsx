"use client"

import { useState, useMemo } from "react"
import { Package, Search, ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react"
import Link from "next/link"

import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LoadingPage } from "@/components/ui/loading"


type SortBy = "nama" | "kategori" | "stok"

export default function StokPage() {
    const { jenisSampah, loading } = useApp()
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState<SortBy>("nama")
    const [sortAsc, setSortAsc] = useState(true)

    const stats = useMemo(() => {
        return {
            totalJenis: jenisSampah.length,
            totalStok: jenisSampah.reduce((sum, item) => sum + item.stok, 0),
            stokRendah: jenisSampah.filter(item => item.stok < 10).length
        }
    }, [jenisSampah])

    const filteredAndSortedSampah = useMemo(() => {
        return jenisSampah
            .filter(item =>
                item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.kategori && item.kategori.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .sort((a, b) => {
                let comparison = 0
                if (sortBy === "nama") {
                    comparison = a.nama.localeCompare(b.nama)
                } else if (sortBy === "kategori") {
                    comparison = (a.kategori || "").localeCompare(b.kategori || "")
                } else if (sortBy === "stok") {
                    comparison = a.stok - b.stok
                }
                return sortAsc ? comparison : -comparison
            })
    }, [jenisSampah, searchQuery, sortBy, sortAsc])

    const toggleSort = (field: SortBy) => {
        if (sortBy === field) {
            setSortAsc(!sortAsc)
        } else {
            setSortBy(field)
            setSortAsc(true)
        }
    }

    const getSortIcon = (field: SortBy) => {
        if (sortBy !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />
        return sortAsc ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Stok Sampah</h2>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Jenis</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl md:text-2xl font-bold">{stats.totalJenis}</div>
                        <p className="text-xs text-muted-foreground">Kategori terdaftar</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Stok</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl md:text-2xl font-bold">{stats.totalStok.toFixed(2)} kg</div>
                        <p className="text-xs text-muted-foreground">Berat di gudang</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Stok Rendah</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl md:text-2xl font-bold">{stats.stokRendah}</div>
                        <p className="text-xs text-muted-foreground">Di bawah 10kg</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="space-y-4">
                    <CardTitle>Inventaris Sampah</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative w-full md:w-[300px]">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari jenis sampah..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <LoadingPage />
                    ) : filteredAndSortedSampah.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <Package className="mb-4 h-12 w-12 opacity-20" />
                            <p>Tidak ada data stok sampah</p>
                            {searchQuery && <p className="text-sm">Coba kata kunci pencarian lain</p>}
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-x-auto">
                            <div className="min-w-[600px] md:min-w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead onClick={() => toggleSort("nama")} className="cursor-pointer hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center">
                                                    Nama {getSortIcon("nama")}
                                                </div>
                                            </TableHead>
                                            <TableHead onClick={() => toggleSort("kategori")} className="hidden sm:table-cell cursor-pointer hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center">
                                                    Kategori {getSortIcon("kategori")}
                                                </div>
                                            </TableHead>
                                            <TableHead onClick={() => toggleSort("stok")} className="cursor-pointer hover:bg-muted/50 transition-colors text-right">
                                                <div className="flex items-center justify-end">
                                                    Stok {getSortIcon("stok")}
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-right">Beli</TableHead>
                                            <TableHead className="text-right">Jual</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAndSortedSampah.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">
                                                    <Link
                                                        href={`/dashboard/stok/${item.id}`}
                                                        className="hover:underline text-primary"
                                                    >
                                                        {item.nama}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">{item.kategori || "-"}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={item.stok < 10 ? "destructive" : item.stok < 20 ? "warning" : "success"}>
                                                        {item.stok.toFixed(2)} kg
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right whitespace-nowrap">
                                                    Rp {item.hargaBeli.toLocaleString("id-ID")}
                                                </TableCell>
                                                <TableCell className="text-right whitespace-nowrap">
                                                    Rp {item.hargaJual.toLocaleString("id-ID")}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
