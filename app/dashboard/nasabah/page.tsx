"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Nasabah, NasabahService } from "@/lib/NasabahService"
import { LoadingPage } from "@/components/ui/loading"
import { PaginationControls } from "@/components/ui/pagination"
import { useDebounce } from "@/hooks/use-debounce"


export default function NasabahPage() {
    const [nasabahList, setNasabahList] = useState<Nasabah[]>([])
    const [filteredNasabah, setFilteredNasabah] = useState<Nasabah[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    // Pagination state
    const [pageSize] = useState(10)
    const [cursors, setCursors] = useState<any[]>([null])
    const [pageIndex, setPageIndex] = useState(0)
    const [hasNext, setHasNext] = useState(false)

    const debouncedSearch = useDebounce(searchQuery, 500)

    useEffect(() => {
        if (debouncedSearch) {
            handleSearch(debouncedSearch)
        } else {
            fetchNasabah(pageIndex, cursors)
        }
    }, [pageIndex, debouncedSearch])

    const fetchNasabah = async (index: number, currentCursors: any[]) => {
        setLoading(true)
        try {
            const result = await NasabahService.getAllNasabah(pageSize + 1, currentCursors[index]);
            const hasMore = result.data.length > pageSize
            const items = hasMore ? result.data.slice(0, pageSize) : result.data

            setFilteredNasabah(items)
            setHasNext(hasMore)

            if (hasMore && !currentCursors[index + 1]) {
                const newCursors = [...currentCursors]
                // Use the last item in the CURRENT page as the cursor for the NEXT page
                newCursors[index + 1] = result.docs[pageSize - 1]
                setCursors(newCursors)
            }
        } catch (error) {
            console.error("Error fetching nasabah:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (term: string) => {
        const trimmedTerm = term.trim();
        if (!trimmedTerm) return;
        setLoading(true)
        try {
            const results = await NasabahService.searchNasabah(trimmedTerm);
            setFilteredNasabah(results)
            setHasNext(false)
        } catch (error) {
            console.error("Search error:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleNextPage = () => {
        if (hasNext) {
            setPageIndex(prev => prev + 1)
        }
    }

    const handlePreviousPage = () => {
        if (pageIndex > 0) {
            setPageIndex(prev => prev - 1)
        }
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Nasabah</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/nasabah/create" className="w-full sm:w-auto">
                        <Button className="w-full">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Nasabah
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader className="space-y-4">
                    <CardTitle>Daftar Nasabah</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative w-full md:w-[300px]">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nasabah..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <LoadingPage />
                    ) : filteredNasabah.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <User className="mb-4 h-12 w-12 opacity-20" />
                            <p>Tidak ada data nasabah</p>
                            {searchQuery && <p className="text-sm">Coba kata kunci pencarian lain</p>}
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-x-auto">
                            <div className="min-w-[600px] md:min-w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">Foto</TableHead>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>ID Nasabah</TableHead>
                                            <TableHead className="hidden md:table-cell">Alamat</TableHead>
                                            <TableHead className="text-right">Saldo</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredNasabah.map((nasabah) => (
                                            <TableRow key={nasabah.firestoreId}>
                                                <TableCell>
                                                    <Avatar>
                                                        <AvatarImage src={nasabah.foto || undefined} alt={nasabah.nama} />
                                                        <AvatarFallback>{getInitials(nasabah.nama)}</AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <Link
                                                        href={`/dashboard/nasabah/${nasabah.id}`}
                                                        className="hover:underline text-primary"
                                                    >
                                                        {nasabah.nama}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{nasabah.id}</TableCell>
                                                <TableCell className="hidden md:table-cell max-w-[200px] truncate" title={nasabah.alamat}>
                                                    {nasabah.alamat}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    Rp {nasabah.saldo.toLocaleString("id-ID")}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </CardContent>
                {!searchQuery && (
                    <CardFooter className="border-t">
                        <PaginationControls
                            onNext={handleNextPage}
                            onPrevious={handlePreviousPage}
                            hasNext={hasNext}
                            hasPrevious={pageIndex > 0}
                            loading={loading}
                        />
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}
