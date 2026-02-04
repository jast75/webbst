import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
    title: 'Bank Sampah Teratai',
    description: 'Aplikasi Bank Sampah Teratai',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="id">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </head>
            <body className="bg-background-light dark:bg-background-dark font-display text-[#111814] dark:text-white transition-colors duration-300">
                <AuthProvider>
                    {children}
                    <Toaster />
                </AuthProvider>
            </body>
        </html>
    )
}
