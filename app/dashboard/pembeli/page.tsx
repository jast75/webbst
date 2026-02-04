"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Building2 } from "lucide-react"
import Link from "next/link"

import { PembeliService, type Pembeli } from "@/lib/PembeliService"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { getInitials } from "@/lib/utils"

export default function PembeliPage() {
    const [pembeliList, setPembeliList] = useState<Pembeli[]>([])
    const [filteredPembeli, setFilteredPembeli] = useState<Pembeli[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchPembeli()
    }, [])

    useEffect(() => {
        if (!searchQuery) {
            setFilteredPembeli(pembeliList)
        } else {
            const lowerQuery = searchQuery.toLowerCase()
            const filtered = pembeliList.filter(
                (item) =>
                    item.nama.toLowerCase().includes(lowerQuery) ||
                    item.id.toLowerCase().includes(lowerQuery) ||
                    (item.alamat && item.alamat.toLowerCase().includes(lowerQuery)) ||
                    (item.perusahaan && item.perusahaan.toLowerCase().includes(lowerQuery)) ||
                    (item.email && item.email.toLowerCase().includes(lowerQuery))
            )
            setFilteredPembeli(filtered)
        }
    }, [searchQuery, pembeliList])

    const fetchPembeli = async () => {
        setLoading(true)
        try {
            const data = await PembeliService.getAllPembeli()
            setPembeliList(data)
            setFilteredPembeli(data)
        } catch (error) {
            console.error("Error fetching pembeli:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Pembeli</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/pembeli/create" className="w-full sm:w-auto">
                        <Button className="w-full">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Pembeli
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader className="space-y-4">
                    <CardTitle>Daftar Pembeli</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative w-full md:w-[400px]">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari pembeli (nama, perusahaan, alamat, ID)..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            Loading...
                        </div>
                    ) : filteredPembeli.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <Building2 className="mb-4 h-12 w-12 opacity-20" />
                            <p>Tidak ada data pembeli</p>
                            {searchQuery && <p className="text-sm">Coba kata kunci pencarian lain</p>}
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-x-auto">
                            <div className="min-w-[800px] md:min-w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">Foto</TableHead>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>ID Pembeli</TableHead>
                                            <TableHead className="hidden lg:table-cell">Perusahaan</TableHead>
                                            <TableHead className="hidden md:table-cell">Alamat</TableHead>
                                            <TableHead className="hidden md:table-cell">No. Telepon</TableHead>
                                            <TableHead className="text-right">Transaksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPembeli.map((pembeli) => (
                                            <TableRow key={pembeli.firestoreId}>
                                                <TableCell>
                                                    <Avatar>
                                                        <AvatarImage src={pembeli.foto || undefined} alt={pembeli.nama} />
                                                        <AvatarFallback className="bg-secondary text-white">
                                                            <Building2 className="h-4 w-4" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <Link
                                                        href={`/dashboard/pembeli/${pembeli.id}`}
                                                        className="hover:underline text-primary"
                                                    >
                                                        {pembeli.nama}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{pembeli.id}</TableCell>
                                                <TableCell className="hidden lg:table-cell max-w-[150px] truncate" title={pembeli.perusahaan}>
                                                    {pembeli.perusahaan || '-'}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell max-w-[200px] truncate" title={pembeli.alamat}>
                                                    {pembeli.alamat || '-'}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">{pembeli.noTelp || '-'}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex flex-col items-end text-sm">
                                                        <span className="font-medium">{pembeli.totalTransaksi || 0} trx</span>
                                                        {pembeli.lastTransactionDate && (
                                                            <span className="text-[10px] md:text-xs text-muted-foreground">
                                                                {pembeli.lastTransactionDate}
                                                            </span>
                                                        )}
                                                    </div>
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
