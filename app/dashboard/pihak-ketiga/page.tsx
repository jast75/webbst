"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Receipt } from "lucide-react"
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
import { formatDate, formatCurrency } from "@/lib/utils"
import { TransaksiBST, TransaksiBSTService } from "@/lib/TransaksiBSTService"
import { LoadingPage } from "@/components/ui/loading"
import { PaginationControls } from "@/components/ui/pagination"
import { useDebounce } from "@/hooks/use-debounce"


export default function PihakKetigaPage() {
    const [transactions, setTransactions] = useState<TransaksiBST[]>([])
    const [filteredTransactions, setFilteredTransactions] = useState<TransaksiBST[]>([])
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
            fetchTransactions(pageIndex, cursors)
        }
    }, [pageIndex, debouncedSearch])

    const fetchTransactions = async (index: number, currentCursors: any[]) => {
        setLoading(true)
        try {
            const result = await TransaksiBSTService.getAllSales(pageSize + 1, currentCursors[index]);
            const hasMore = result.data.length > pageSize
            const items = hasMore ? result.data.slice(0, pageSize) : result.data

            setFilteredTransactions(items)
            setHasNext(hasMore)

            if (hasMore && !currentCursors[index + 1]) {
                const newCursors = [...currentCursors]
                // Use the last item in the CURRENT page as the cursor for the NEXT page
                newCursors[index + 1] = result.docs[pageSize - 1]
                setCursors(newCursors)
            }
        } catch (error) {
            console.error("Error fetching transactions:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (term: string) => {
        const trimmedTerm = term.trim();
        if (!trimmedTerm) return;
        setLoading(true)
        try {
            const results = await TransaksiBSTService.searchSales(trimmedTerm);
            setFilteredTransactions(results)
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
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Penjualan Pihak Ketiga</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/pihak-ketiga/create" className="w-full sm:w-auto">
                        <Button className="w-full">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Penjualan
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader className="space-y-4">
                    <CardTitle>Daftar Penjualan</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative w-full md:w-[300px]">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari pembeli..."
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
                    ) : filteredTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <Receipt className="mb-4 h-12 w-12 opacity-20" />
                            <p>Tidak ada data penjualan</p>
                            {searchQuery && <p className="text-sm">Coba kata kunci pencarian lain</p>}
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-x-auto">
                            <div className="min-w-[600px] md:min-w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Pembeli</TableHead>
                                            <TableHead className="hidden sm:table-cell text-center">Item</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead className="text-right">Profit</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTransactions.map((transaction) => {
                                            return (
                                                <TableRow key={transaction.id}>
                                                    <TableCell className="whitespace-nowrap text-xs md:text-sm">
                                                        {formatDate(transaction.tanggal)}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        <Link
                                                            href={`/dashboard/pihak-ketiga/${transaction.id}`}
                                                            className="hover:underline text-primary"
                                                        >
                                                            {transaction.buyerName}
                                                        </Link>
                                                        <div className="text-[10px] md:text-sm text-muted-foreground">
                                                            {transaction.buyerType === 'registered' ? 'Terdaftar' : 'Manual'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell text-center text-sm">
                                                        {transaction.items.length} item
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium whitespace-nowrap text-sm">
                                                        {formatCurrency(Math.round(transaction.totalPenjualan))}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium text-green-600 whitespace-nowrap text-sm">
                                                        {formatCurrency(Math.round(transaction.keuntungan))}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
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
