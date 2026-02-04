'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Password tidak cocok');
            setLoading(false);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            let errorMessage = 'Registrasi gagal.';
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'Email sudah terdaftar.';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'Password terlalu lemah (minimal 6 karakter).';
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/20">
                            <UserPlus className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Daftar Admin Baru</CardTitle>
                    <CardDescription className="text-center">
                        Bank Sampah Teratai
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Konfirmasi Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                            loading={loading}
                        >
                            {loading ? 'Mendaftar...' : 'Daftar'}
                        </Button>
                        <div className="text-center text-sm text-gray-500">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-blue-600 hover:underline font-medium">
                                Masuk disini
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
