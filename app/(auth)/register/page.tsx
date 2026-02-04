import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md shadow-lg text-center">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-amber-100 rounded-full dark:bg-amber-900/20">
                            <Construction className="w-10 h-10 text-amber-600 dark:text-amber-500" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Segera Hadir</CardTitle>
                    <CardDescription className="text-base">
                        Bank Sampah Teratai
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2 text-gray-600 dark:text-gray-400">
                        <p>
                            Halaman pendaftaran ini sedang dalam pengembangan dan
                            nantinya akan dikhususkan untuk <strong>nasabah</strong> Bank Sampah Teratai.
                        </p>
                        <p className="text-sm">
                            Untuk pendaftaran admin, silakan hubungi pengelola Bank Sampah Teratai.
                        </p>
                    </div>
                    <Link href="/login">
                        <Button
                            variant="outline"
                            className="w-full h-11 gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Halaman Login
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
