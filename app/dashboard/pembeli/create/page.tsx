"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { PembeliService, type CreatePembeliData } from "@/lib/PembeliService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function CreatePembeliPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<CreatePembeliData>({
        nama: "",
        alamat: "",
        noTelp: "",
        perusahaan: "",
        email: "",
        foto: null
    })

    const handleInputChange = (field: keyof CreatePembeliData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const validateForm = (): boolean => {
        if (!formData.nama.trim()) {
            toast({
                title: "Error",
                description: "Nama pembeli harus diisi!",
                variant: "destructive"
            })
            return false
        }

        if (formData.nama.trim().length < 3) {
            toast({
                title: "Error",
                description: "Nama pembeli harus minimal 3 karakter!",
                variant: "destructive"
            })
            return false
        }

        if (formData.email && !formData.email.includes('@')) {
            toast({
                title: "Error",
                description: "Format email tidak valid!",
                variant: "destructive"
            })
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setSaving(true)

        try {
            const result = await PembeliService.createPembeli(formData)

            toast({
                title: "Sukses",
                description: `Pembeli "${formData.nama}" berhasil ditambahkan! ID: ${result.id}`
            })

            // Navigate to detail page
            router.push(`/dashboard/pembeli/${result.id}`)
        } catch (error) {
            console.error("Error creating pembeli:", error)
            toast({
                title: "Error",
                description: "Gagal menambahkan pembeli. Silakan coba lagi.",
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center space-x-2">
                <Link href="/dashboard/pembeli">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Tambah Pembeli Baru</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informasi Pembeli</CardTitle>
                    <CardDescription>
                        Masukkan data pembeli baru. Field bertanda * wajib diisi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Pembeli *</Label>
                                <Input
                                    id="nama"
                                    placeholder="Masukkan nama pembeli (min. 3 karakter)"
                                    value={formData.nama}
                                    onChange={(e) => handleInputChange("nama", e.target.value)}
                                    disabled={saving}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="perusahaan">Perusahaan</Label>
                                <Input
                                    id="perusahaan"
                                    placeholder="Masukkan nama perusahaan"
                                    value={formData.perusahaan}
                                    onChange={(e) => handleInputChange("perusahaan", e.target.value)}
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="alamat">Alamat</Label>
                            <Textarea
                                id="alamat"
                                placeholder="Masukkan alamat lengkap"
                                value={formData.alamat}
                                onChange={(e) => handleInputChange("alamat", e.target.value)}
                                disabled={saving}
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="noTelp">No. Telepon</Label>
                                <Input
                                    id="noTelp"
                                    type="tel"
                                    placeholder="Masukkan nomor telepon"
                                    value={formData.noTelp}
                                    onChange={(e) => handleInputChange("noTelp", e.target.value)}
                                    disabled={saving}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Masukkan email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline" disabled={saving} asChild>
                                <Link href="/dashboard/pembeli">
                                    Batal
                                </Link>
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
