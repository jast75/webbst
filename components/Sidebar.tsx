'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    FileText,
    Truck,
    ShieldCheck,
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Nasabah', href: '/dashboard/nasabah', icon: Users },
    { name: 'Stok Sampah', href: '/dashboard/stok', icon: Package },
    { name: 'Pembeli', href: '/dashboard/pembeli', icon: ShoppingCart },
    { name: 'Transaksi', href: '/dashboard/transaksi', icon: FileText },
    { name: 'Pihak Ketiga', href: '/dashboard/pihak-ketiga', icon: Truck },
    { name: 'Migrasi ID', href: '/dashboard/admin/migration', icon: ShieldCheck },
    { name: 'Pengaturan', href: '/dashboard/pengaturan', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    return (
        <div className="flex h-screen w-64 flex-col justify-between border-r bg-white dark:bg-gray-950 dark:border-gray-800">
            <div className="px-4 py-6">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                        <span className="text-white font-bold">BS</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Teratai
                    </span>
                </div>

                <nav className="flex flex-col space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                        : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t dark:border-gray-800">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-3 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:hover:bg-red-900/20"
                    onClick={signOut}
                >
                    <LogOut className="h-4 w-4" />
                    Keluar
                </Button>
            </div>
        </div>
    );
}
