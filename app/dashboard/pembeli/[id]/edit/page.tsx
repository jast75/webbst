"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Camera, Building2 } from "lucide-react"
import Link from "next/link"
import { CldUploadWidget } from "next-cloudinary"

import { PembeliService, type Pembeli, type UpdatePembeliData } from "@/lib/PembeliService"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function EditPembeliPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const pembeliId = params.id as string

    const [pembeli, setPembeli] = useState<Pembeli | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<UpdatePembeliData>({
        nama: "",
        alamat: "",
        noTelp: "",
        perusahaan: "",
        email: "",
        foto: null
    })

    useEffect(() => {
        if (pembeliId) {
            fetchPembeli()
        }
    }, [pembeliId])

    const fetchPembeli = async () => {
        setLoading(true)
        try {
            const pembeliData = await PembeliService.getPembeliById(pembeliId)

            if (!pembeliData) {
                toast({
                    title: "Error",
                    description: "Data pembeli tidak ditemukan",
                    variant: "destructive"
                })
                router.push("/dashboard/pembeli")
                return
            }

            setPembeli(pembeliData)
            setFormData({
                nama: pembeliData.nama,
                alamat: pembeliData.alamat,
                noTelp: pembeliData.noTelp,
                perusahaan: pembeliData.perusahaan,
                email: pembeliData.email,
                foto: pembeliData.foto || null
            })
        } catch (error) {
            console.error("Error fetching pembeli:", error)
            toast({
                title: "Error",
                description: "Gagal memuat data pembeli",
                variant: "destructive"
            })
            router.push("/dashboard/pembeli")
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: keyof UpdatePembeliData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleImageUpload = (result: any) => {
        if (result.event === 'success') {
            const imageUrl = result.info.secure_url
            setFormData(prev => ({
                ...prev,
                foto: imageUrl
            }))
            toast({
                title: "Sukses",
                description: "Foto berhasil diupload"
            })
        }
    }

    const validateForm = (): boolean => {
        if (!formData.nama?.trim()) {
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

        if (!validateForm() || !pembeli) {
            return
        }

        setSaving(true)

        try {
            await PembeliService.updatePembeli(pembeli.firestoreId, formData)

            toast({
                title: "Sukses",
                description: "Data pembeli berhasil diperbarui"
            })

            // Navigate back to detail page
            router.push(`/dashboard/pembeli/${pembeli.id}`)
        } catch (error) {
            console.error("Error updating pembeli:", error)
            toast({
                title: "Error",
                description: "Gagal memperbarui data pembeli. Silakan coba lagi.",
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-center p-8">
                    Loading...
                </div>
            </div>
        )
    }

    if (!pembeli) {
        return null
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center space-x-2">
                <Link href={`/dashboard/pembeli/${pembeli.id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Edit Pembeli</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informasi Pembeli</CardTitle>
                    <CardDescription>
                        Perbarui data pembeli. Field bertanda * wajib diisi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Photo Section */}
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={formData.foto || undefined} alt={formData.nama} />
                                <AvatarFallback className="bg-secondary text-white text-2xl">
                                    <Building2 className="h-12 w-12" />
                                </AvatarFallback>
                            </Avatar>
                            <CldUploadWidget
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                onSuccess={handleImageUpload}
                            >
                                {({ open }) => (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => open()}
                                        disabled={saving}
                                    >
                                        <Camera className="mr-2 h-4 w-4" />
                                        {formData.foto ? "Ubah Foto" : "Upload Foto"}
                                    </Button>
                                )}
                            </CldUploadWidget>
                            {formData.foto && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFormData(prev => ({ ...prev, foto: null }))}
                                    disabled={saving}
                                    className="text-destructive"
                                >
                                    Hapus Foto
                                </Button>
                            )}
                        </div>

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
                                <Link href={`/dashboard/pembeli/${pembeli.id}`}>
                                    Batal
                                </Link>
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
