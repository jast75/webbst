'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '../assets/images/logobsthalf.png';

export default function Footer() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <footer className="bg-white dark:bg-background-dark border-t border-[#dce5e0] dark:border-white/10 pt-16 pb-8">
            <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="size-10 flex items-center justify-center">
                            <Image src={logo} alt="Bank Sampah Teratai Logo" width={40} height={40} className="object-contain" />
                        </div>
                        <h2 className="text-xl font-bold">Bank Sampah Teratai</h2>
                    </div>
                    <p className="text-sm opacity-60 leading-relaxed">
                        Mewujudkan lingkungan bersih dan mandiri ekonomi melalui pengelolaan sampah anorganik yang
                        terintegrasi dan profesional.
                    </p>
                    <div className="flex gap-4">
                        <a className="size-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary transition-colors hover:text-white"
                            href="#">
                            <span className="material-symbols-outlined text-xl">share</span>
                        </a>
                        <a className="size-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary transition-colors hover:text-white"
                            href="#">
                            <span className="material-symbols-outlined text-xl">camera_alt</span>
                        </a>
                        <a className="size-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary transition-colors hover:text-white"
                            href="#">
                            <span className="material-symbols-outlined text-xl">public</span>
                        </a>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <h3 className="text-base font-bold">Navigasi Cepat</h3>
                    <ul className="flex flex-col gap-3 text-sm opacity-70">
                        <li><Link className={`hover:text-primary transition-colors ${isActive('/') ? 'text-primary font-bold' : ''}`} href="/">Beranda</Link></li>
                        <li><Link className={`hover:text-primary transition-colors ${isActive('/tentang-kami') ? 'text-primary font-bold' : ''}`} href="/tentang-kami">Tentang Kami</Link></li>
                        <li><Link className={`hover:text-primary transition-colors ${isActive('/update-harga') ? 'text-primary font-bold' : ''}`} href="/update-harga">Update Harga</Link></li>
                        <li><Link className={`hover:text-primary transition-colors ${isActive('/kegiatan') ? 'text-primary font-bold' : ''}`} href="/kegiatan">Galeri Kegiatan</Link></li>
                    </ul>
                </div>
                <div className="flex flex-col gap-6">
                    <h3 className="text-base font-bold">Bantuan</h3>
                    <ul className="flex flex-col gap-3 text-sm opacity-70">
                        <li><a className="hover:text-primary transition-colors" href="#">Cara Jadi Anggota</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Syarat &amp; Ketentuan</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Pusat Bantuan</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Kebijakan Privasi</a></li>
                    </ul>
                </div>
                <div className="flex flex-col gap-6">
                    <h3 className="text-base font-bold">Kontak Kami</h3>
                    <div className="flex flex-col gap-4 text-sm opacity-70">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-primary">location_on</span>
                            <span>Babakan Perumnas Bantar Kemang RT 10 RW 06, Baranangsiang, Bogor Timur, 16143</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">phone</span>
                            <span>+62 812 3456 7890</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">mail</span>
                            <span>halo@banksampahteratai.com</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-[1280px] mx-auto px-4 mt-16 pt-8 border-t border-[#dce5e0] dark:border-white/10 text-center">
                <p className="text-xs opacity-50">© 2025 Bank Sampah Teratai.</p>
            </div>
        </footer>
    );
}
