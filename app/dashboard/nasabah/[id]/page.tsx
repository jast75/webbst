"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Banknote, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"

import { Nasabah, NasabahService } from "@/lib/NasabahService"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getInitials, formatCurrency, formatDate } from "@/lib/utils"


export default function NasabahDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [nasabah, setNasabah] = useState<Nasabah | null>(null)
    const [loading, setLoading] = useState(true)
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [withdrawAmount, setWithdrawAmount] = useState("")
    const [withdrawLoading, setWithdrawLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const { toast } = useToast()

    const handleWithdraw = async () => {
        const amount = parseInt(withdrawAmount)
        if (isNaN(amount) || amount <= 0) {
            toast({
                title: "Kesalahan",
                description: "Masukkan jumlah penarikan yang valid",
                variant: "destructive"
            })
            return
        }
        if (nasabah && amount > nasabah.saldo) {
            toast({
                title: "Saldo Kurang",
                description: "Jumlah penarikan melebihi saldo nasabah",
                variant: "destructive"
            })
            return
        }

        setWithdrawLoading(true)
        try {
            if (!nasabah) return;
            await NasabahService.withdrawSaldo(nasabah.firestoreId, amount)
            toast({
                title: "Berhasil",
                description: `Berhasil menarik saldo sebesar ${formatCurrency(amount)}`,
            })
            setIsWithdrawOpen(false)
            setWithdrawAmount("")
            fetchNasabah() // Refresh saldo
        } catch (error: any) {
            toast({
                title: "Gagal",
                description: error.message || "Gagal melakukan penarikan",
                variant: "destructive"
            })
        } finally {
            setWithdrawLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!nasabah) return

        setDeleteLoading(true)
        try {
            await NasabahService.deleteNasabah(nasabah.firestoreId)
            toast({
                title: "Berhasil",
                description: "Nasabah berhasil dihapus",
            })
            router.push('/dashboard/nasabah')
        } catch (error: any) {
            toast({
                title: "Gagal",
                description: error.message || "Gagal menghapus nasabah",
                variant: "destructive"
            })
            setIsDeleteOpen(false)
        } finally {
            setDeleteLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchNasabah()
        }
    }, [id])

    const fetchNasabah = async () => {
        setLoading(true)
        try {
            const data = await NasabahService.getNasabahById(id);
            if (!data) {
                // Handle not found
            }
            setNasabah(data);
        } catch (error) {
            console.error("Error fetching nasabah:", error)
            toast({
                title: "Error",
                description: "Gagal memuat data nasabah",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center p-8 min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
    )

    if (!nasabah) {
        return (
            <div className="p-8 flex flex-col items-center">
                <h2 className="text-xl font-bold">Nasabah Tidak Ditemukan</h2>
                <Link href="/dashboard/nasabah">
                    <Button variant="link">Kembali ke Daftar</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/nasabah">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight">Detail Nasabah</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => setIsWithdrawOpen(true)}
                    >
                        <Banknote className="mr-2 h-4 w-4" /> Ambil Saldo
                    </Button>
                    <Link href={`/dashboard/nasabah/${id}/edit`}>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                        </Button>
                    </Link>
                    <Button
                        variant="destructive"
                        onClick={() => setIsDeleteOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Profil Nasabah</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={nasabah.foto || undefined} />
                                <AvatarFallback className="text-2xl">{getInitials(nasabah.nama)}</AvatarFallback>
                            </Avatar>
                            <h3 className="mt-4 text-xl font-bold">{nasabah.nama}</h3>
                            <p className="text-sm text-muted-foreground">{nasabah.id}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium">Saldo</span>
                                <span className="font-bold text-primary text-lg">{formatCurrency(nasabah.saldo)}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium">No. Telepon</span>
                                <span className="text-right">{nasabah.noTelp || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium">Alamat</span>
                                <span className="max-w-[200px] text-right">{nasabah.alamat}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium">Terdaftar Sejak</span>
                                <span>{formatDate(nasabah.createdAt, false)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Riwayat Transaksi</CardTitle>
                        <CardDescription>
                            Daftar transaksi yang dilakukan oleh nasabah ini.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-muted-foreground">
                            Belum ada riwayat transaksi.
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Withdraw Dialog */}
            <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Ambil Saldo</DialogTitle>
                        <DialogDescription>
                            Masukkan jumlah saldo yang ingin diambil.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Saldo Tersedia</Label>
                            <div className="text-2xl font-bold text-green-600 bg-green-50 p-3 rounded-lg border border-green-100 dark:bg-green-950/20 dark:border-green-900/30">
                                {formatCurrency(nasabah.saldo)}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Jumlah Penarikan (Rp)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="Contoh: 50000"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setIsWithdrawOpen(false)}
                            disabled={withdrawLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleWithdraw}
                            disabled={withdrawLoading || !withdrawAmount}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {withdrawLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Memproses...
                                </>
                            ) : "Konfirmasi Penarikan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Nasabah</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus nasabah <strong>{nasabah.nama}</strong>?
                            Tindakan ini tidak dapat dibatalkan. Nasabah hanya dapat dihapus jika saldo Rp 0.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                            disabled={deleteLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                "Hapus Nasabah"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
