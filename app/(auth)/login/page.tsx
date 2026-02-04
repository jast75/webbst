'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            let errorMessage = 'Login gagal.';
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                errorMessage = 'Email atau password salah.';
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = 'Terlalu banyak percobaan login. Silakan coba lagi nanti.';
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
                    <div className="flex justify-center mb-2">
                        <Image
                            src="/images/logobsthalf.png"
                            alt="Logo Bank Sampah Teratai"
                            width={100}
                            height={100}
                            className="object-contain"
                            priority
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Masuk Admin</CardTitle>
                    <CardDescription className="text-center">
                        Bank Sampah Teratai
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
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
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white"
                            disabled={loading}
                            loading={loading}
                        >
                            {loading ? 'Masuk...' : 'Masuk'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
