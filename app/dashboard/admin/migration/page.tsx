"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { MigrationService } from "@/lib/MigrationService";
import { useToast } from "@/hooks/use-toast";

const ENABLE_MIGRATION = false; // Set to true only when migration is needed

export default function MigrationPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState<string | null>(null);
    const [results, setResults] = useState<Record<string, any>>({});

    const handleMigrateNasabah = async () => {
        if (!ENABLE_MIGRATION) return;
        if (!confirm("PERINGATAN: Tindakan ini akan merubah SEMUA ID Nasabah dan mengupdate transaksi terkait. Lanjutkan?")) return;

        setLoading("nasabah");
        try {
            const result = await MigrationService.migrateNasabahIds();
            setResults(prev => ({ ...prev, nasabah: result }));
            toast({
                title: "Migrasi Berhasil",
                description: `${result.migratedCount} data Nasabah telah diperbarui.`,
            });
        } catch (error: any) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Migrasi Gagal",
                description: error.message || "Terjadi kesalahan saat migrasi Nasabah.",
            });
        } finally {
            setLoading(null);
        }
    };

    const handleMigratePembeli = async () => {
        if (!ENABLE_MIGRATION) return;
        if (!confirm("PERINGATAN: Tindakan ini akan merubah SEMUA ID Pembeli dan mengupdate transaksi terkait. Lanjutkan?")) return;

        setLoading("pembeli");
        try {
            const result = await MigrationService.migratePembeliIds();
            setResults(prev => ({ ...prev, pembeli: result }));
            toast({
                title: "Migrasi Berhasil",
                description: `${result.migratedCount} data Pembeli telah diperbarui.`,
            });
        } catch (error: any) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Migrasi Gagal",
                description: error.message || "Terjadi kesalahan saat migrasi Pembeli.",
            });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Admin Data Migration</h1>
                <p className="text-muted-foreground">
                    Alat ini digunakan untuk merapikan ID acak menjadi ID sequential (berurut).
                </p>
                {!ENABLE_MIGRATION && (
                    <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md border border-yellow-200 text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Fitur migrasi sedang dinonaktifkan demi keamanan. Edit kode (ENABLE_MIGRATION = true) untuk mengaktifkan.
                    </div>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-orange-200 bg-orange-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Migrasi Nasabah
                        </CardTitle>
                        <CardDescription>
                            Akan merubah ID Nasabah menjadi format NSXXXX dan mengupdate transaksi terkait.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={handleMigrateNasabah}
                            disabled={!ENABLE_MIGRATION || loading !== null}
                            className="w-full bg-orange-600 hover:bg-orange-700"
                        >
                            {loading === "nasabah" ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
                            ) : (
                                "Jalankan Migrasi Nasabah"
                            )}
                        </Button>
                        {results.nasabah && (
                            <div className="bg-white p-3 rounded border border-green-200 flex items-center gap-2 text-green-700 text-sm">
                                <CheckCircle2 className="h-4 w-4" />
                                Selesai: {results.nasabah.migratedCount} data berhasil dipindahkan.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-blue-500" />
                            Migrasi Pembeli
                        </CardTitle>
                        <CardDescription>
                            Akan merubah ID Pembeli menjadi format PBXXXX dan mengupdate transaksi terkait.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={handleMigratePembeli}
                            disabled={!ENABLE_MIGRATION || loading !== null}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {loading === "pembeli" ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
                            ) : (
                                "Jalankan Migrasi Pembeli"
                            )}
                        </Button>
                        {results.pembeli && (
                            <div className="bg-white p-3 rounded border border-green-200 flex items-center gap-2 text-green-700 text-sm">
                                <CheckCircle2 className="h-4 w-4" />
                                Selesai: {results.pembeli.migratedCount} data berhasil dipindahkan.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Panduan Penggunaan</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-muted-foreground">
                    <p>1. Pastikan tidak ada transaksi yang sedang berlangsung selama proses migrasi.</p>
                    <p>2. Proses ini akan mengupdate field ID di dokumen Nasabah/Pembeli DAN update referensi ID di riwayat transaksi.</p>
                    <p>3. Urutan ditentukan berdasarkan tanggal pembuatan data (terlama jadi nomor 0001).</p>
                    <p>4. Setelah migrasi, pendaftaran baru akan otomatis melanjutkan urutan terakhir secara sinkron di Web dan Mobile.</p>
                </CardContent>
            </Card>
        </div>
    );
}
