'use client';

import { useAuth } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { LoadingScreen } from '@/components/ui/loading';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Close mobile menu when route changes
    const pathname = usePathname();
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    if (loading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    return (
        <AppProvider>
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Desktop Sidebar */}
                <div className="hidden md:flex no-print">
                    <Sidebar />
                </div>

                {/* Mobile Sidebar Overlay */}
                <div
                    className={cn(
                        "fixed inset-0 z-50 flex md:hidden transition-opacity duration-300",
                        isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}
                >
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div
                        className={cn(
                            "relative flex flex-col w-72 bg-white dark:bg-gray-950 h-full transition-transform duration-300 ease-in-out transform",
                            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                        )}
                    >
                        <div className="absolute right-4 top-4 z-10">
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <Sidebar />
                    </div>
                </div>

                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    {/* Mobile Header */}
                    <header className="flex md:hidden items-center justify-between px-4 py-3 bg-white dark:bg-gray-950 border-b dark:border-gray-800 sticky top-0 z-40 no-print">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">BS</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                Teratai
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="text-gray-500"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </header>

                    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AppProvider>
    );
}
