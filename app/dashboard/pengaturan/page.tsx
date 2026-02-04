"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, Briefcase, FileText, Image, Package, Settings, Trash2, Users } from "lucide-react"
import Link from "next/link"

const settingsMenus = [
    {
        title: "Update Harga",
        description: "Perbarui harga beli dan jual sampah untuk semua kategori",
        href: "/dashboard/pengaturan/harga",
        icon: Package,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
    },
    {
        title: "Hapus Transaksi",
        description: "Kelola dan hapus riwayat transaksi nasabah atau pihak ketiga",
        href: "/dashboard/pengaturan/hapus-transaksi",
        icon: Trash2,
        color: "text-red-600",
        bgColor: "bg-red-50"
    },
    {
        title: "Hapus Nasabah / Pembeli",
        description: "Kelola penghapusan data nasabah dan pembeli",
        href: "/dashboard/pengaturan/hapus-nasabah",
        icon: Users,
        color: "text-orange-600",
        bgColor: "bg-orange-50"
    }
]

export default function PengaturanPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Pengaturan</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {settingsMenus.map((menu) => (
                    <Link key={menu.href} href={menu.href}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className={`p-2 rounded-lg ${menu.bgColor}`}>
                                    <menu.icon className={`h-6 w-6 ${menu.color}`} />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-xl">{menu.title}</CardTitle>
                                    <CardDescription>{menu.description}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Informasi Aplikasi</h3>
                <Card>
                    <CardHeader>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Nama Aplikasi</p>
                                <p className="font-medium">Bank Sampah Teratai</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Versi</p>
                                <p className="font-medium">3.0.0 (Web Dashboard)</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Status</p>
                                <p className="font-medium text-green-600">Terhubung ke Firestore</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Developer</p>
                                <p className="font-medium">Jati Satrio / Antigravity Port</p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}
