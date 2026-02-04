'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '../assets/images/logobsthalf.png';

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { name: 'Beranda', href: '/' },
        { name: 'Tentang Kami', href: '/tentang-kami' },
        { name: 'Update Harga', href: '/update-harga' },
        { name: 'Kegiatan', href: '/kegiatan' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#dce5e0] dark:border-white/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 md:px-20 lg:px-40 py-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-14 flex items-center justify-center">
                        <Image src={logo} alt="Bank Sampah Teratai Logo" width={56} height={56} className="object-contain" />
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-tight">Bank Sampah Teratai</h2>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-zinc-600 dark:text-zinc-400"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    <span className="material-symbols-outlined text-3xl">
                        {isMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex flex-1 justify-end items-center gap-8">
                    <nav className="flex items-center gap-8">
                        <Link
                            className={`text-sm font-semibold transition-colors ${isActive('/') ? 'text-primary' : 'hover:text-primary'}`}
                            href="/">
                            Beranda
                        </Link>
                        <Link
                            className={`text-sm font-semibold transition-colors ${isActive('/tentang-kami') ? 'text-primary' : 'hover:text-primary'}`}
                            href="/tentang-kami">
                            Tentang Kami
                        </Link>
                        <div className="relative group">
                            <button className={`flex items-center gap-1 text-sm font-semibold transition-colors ${(isActive('/kegiatan') || isActive('/update-harga')) ? 'text-primary' : 'hover:text-primary'}`}>
                                Informasi <span className="material-symbols-outlined text-sm">expand_more</span>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-[#dce5e0] dark:border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <Link className={`block px-4 py-2 text-sm transition-colors ${isActive('/update-harga') ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-primary/10'}`} href="/update-harga">
                                    Update Harga
                                </Link>
                                <Link className={`block px-4 py-2 text-sm transition-colors ${isActive('/kegiatan') ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-primary/10'}`} href="/kegiatan">
                                    Kegiatan
                                </Link>
                            </div>
                        </div>
                    </nav>
                    <Link
                        href="/dashboard"
                        target="_blank"
                        className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold transition-transform active:scale-95">
                        <span className="truncate">Masuk ke Apps</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[400px] opacity-100 py-4' : 'max-h-0 opacity-0'}`}>
                <nav className="flex flex-col gap-4 border-t border-[#dce5e0] dark:border-white/10 pt-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-base font-semibold transition-all ${isActive(link.href) ? 'text-primary pl-2 border-l-2 border-primary' : 'hover:text-primary'}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/dashboard"
                        target="_blank"
                        className="flex w-full cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-primary text-background-dark text-base font-bold transition-transform active:scale-95 mt-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Masuk ke Apps
                    </Link>
                </nav>
            </div>
        </header>
    );
}
