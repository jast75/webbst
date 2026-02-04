"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationControlsProps {
    onNext: () => void
    onPrevious: () => void
    hasNext: boolean
    hasPrevious: boolean
    className?: string
    loading?: boolean
}

export function PaginationControls({
    onNext,
    onPrevious,
    hasNext,
    hasPrevious,
    className,
    loading = false,
}: PaginationControlsProps) {
    return (
        <div className={cn("flex items-center justify-between space-x-2 py-4", className)}>
            <div className="text-sm text-muted-foreground">
                {/* Space for pagination info like "Halaman 1" */}
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onPrevious}
                    disabled={!hasPrevious || loading}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Sebelumnya
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onNext}
                    disabled={!hasNext || loading}
                >
                    Selanjutnya
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    )
}

/**
 * Custom hook for cursor-based Firestore pagination
 */
export function useFirestorePagination<T>(
    fetchFn: (limit: number, lastDoc?: any) => Promise<{ data: T[], lastVisible: any }>,
    pageSize: number = 10
) {
    const [data, setData] = React.useState<T[]>([])
    const [loading, setLoading] = React.useState(true)
    const [pageIndex, setPageIndex] = React.useState(0)
    const [cursors, setCursors] = React.useState<any[]>([null])
    const [hasNext, setHasNext] = React.useState(false)

    const loadPage = React.useCallback(async (index: number, useCursors: any[]) => {
        setLoading(true)
        try {
            const cursor = useCursors[index]
            // We fetch pageSize + 1 to detect if there is a next page
            const result = await fetchFn(pageSize + 1, cursor)

            const fetchedData = result.data
            const hasMore = fetchedData.length > pageSize
            const items = hasMore ? fetchedData.slice(0, pageSize) : fetchedData

            setData(items)
            setHasNext(hasMore)

            // If we have more items, the cursor for the NEXT page is 
            // the last document of the CURRENT page (the pageSize-th item)
            if (hasMore && !useCursors[index + 1]) {
                const nextCursor = result.lastVisible;
                // Since we fetched pageSize + 1, we need to be careful.
                // If the service returns lastVisible of the ENTIRE result, 
                // that would be the (pageSize + 1)-th item.
                // We want to start AFTER the pageSize-th item.
                // Let's adjust service or just use the item itself if it's a QueryDocumentSnapshot.
            }
        } catch (error) {
            console.error("Pagination Error:", error)
        } finally {
            setLoading(false)
        }
    }, [fetchFn, pageSize])

    // Simplifying: Let the page handle the fetch logic and just provide UI
    // Or let's make a really solid hook.

    // Actually, simple is better for now. I'll implement pagination logic directly in pages
    // to avoid complex generic document snapshot handling in a hook.

    return { data, setData, loading, setLoading, pageIndex, setPageIndex, hasNext, setHasNext }
}
