"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Camera, User } from "lucide-react"
import Link from "next/link"
import { CldUploadWidget } from "next-cloudinary"

import { NasabahService, type UpdateNasabahData, type Nasabah } from "@/lib/NasabahService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

export default function EditNasabahPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const id = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [nasabah, setNasabah] = useState<Nasabah | null>(null)
    const [formData, setFormData] = useState<UpdateNasabahData>({
        nama: "",
        alamat: "",
        noTelp: "",
        foto: null as string | null
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (id) {
            fetchNasabah()
        }
    }, [id])

    const fetchNasabah = async () => {
        setLoading(true)
        try {
            const data = await NasabahService.getNasabahById(id)

            if (data) {
                setNasabah(data)
                setFormData({
                    nama: data.nama || "",
                    alamat: data.alamat || "",
                    noTelp: data.noTelp || "",
                    foto: data.foto || null
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Nasabah tidak ditemukan"
                })
                router.push("/dashboard/nasabah")
            }
        } catch (error) {
            console.error("Error fetching nasabah:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error mengambil data nasabah"
            })
        } finally {
            setLoading(false)
        }
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

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.nama?.trim()) {
            newErrors.nama = "Nama harus diisi"
        } else if (formData.nama.length < 3) {
            newErrors.nama = "Nama minimal 3 karakter"
        }

        if (!formData.alamat?.trim()) {
            newErrors.alamat = "Alamat harus diisi"
        } else if (formData.alamat.length < 5) {
            newErrors.alamat = "Alamat minimal 5 karakter"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm() || !nasabah) return

        setSaving(true)
        try {
            await NasabahService.updateNasabah(nasabah.firestoreId, formData)

            toast({
                title: "Berhasil",
                description: "Profil nasabah berhasil diperbarui"
            })

            router.push(`/dashboard/nasabah/${id}`)
            router.refresh()
        } catch (error) {
            console.error("Error updating nasabah:", error)
            toast({
                variant: "destructive",
                title: "Gagal",
                description: "Gagal mengupdate nasabah. Silakan coba lagi."
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        )
    }

    if (!nasabah) return null

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center space-x-2 mb-4">
                <Link href={`/dashboard/nasabah/${id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Edit Nasabah</h2>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Edit Profil</CardTitle>
                    <CardDescription>
                        Ubah informasi nasabah.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Photo Section */}
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={formData.foto || undefined} alt={formData.nama} />
                                <AvatarFallback className="bg-secondary text-white text-2xl">
                                    <User className="h-12 w-12" />
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

                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Lengkap</Label>
                            <Input
                                id="nama"
                                placeholder="Contoh: Budi Santoso"
                                value={formData.nama}
                                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                disabled={saving}
                            />
                            {errors.nama && <p className="text-sm text-red-500">{errors.nama}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="alamat">Alamat Lengkap</Label>
                            <Textarea
                                id="alamat"
                                placeholder="Contoh: Jl. Mawar No. 12"
                                value={formData.alamat}
                                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                                disabled={saving}
                                rows={3}
                            />
                            {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="noTelp">Nomor Telepon (Opsional)</Label>
                            <Input
                                id="noTelp"
                                placeholder="Contoh: 08123456789"
                                value={formData.noTelp}
                                onChange={(e) => setFormData({ ...formData, noTelp: e.target.value })}
                                disabled={saving}
                                type="tel"
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Link href={`/dashboard/nasabah/${id}`}>
                                <Button variant="outline" type="button" disabled={saving}>
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
