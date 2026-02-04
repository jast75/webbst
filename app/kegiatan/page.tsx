'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Kegiatan() {
    return (
        <main>
            <Header />
            <main className="max-w-[1280px] mx-auto px-4 py-12">
                <section className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Galeri Kegiatan</h1>
                    <p className="text-lg opacity-70 max-w-2xl mx-auto">
                        Lihat jejak langkah kami dalam menciptakan lingkungan yang lebih bersih dan memberdayakan ekonomi
                        masyarakat melalui pengelolaan sampah yang berkelanjutan.
                    </p>
                </section>

                <section className="mb-10 flex flex-wrap justify-center gap-3">
                    <button
                        className="px-6 py-2 rounded-full bg-primary text-background-dark font-bold text-sm shadow-md transition-all">
                        Semua
                    </button>
                    <button
                        className="px-6 py-2 rounded-full bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 hover:border-primary text-sm font-semibold transition-all">
                        Sosialisasi
                    </button>
                    <button
                        className="px-6 py-2 rounded-full bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 hover:border-primary text-sm font-semibold transition-all">
                        Penjemputan Sampah
                    </button>
                    <button
                        className="px-6 py-2 rounded-full bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 hover:border-primary text-sm font-semibold transition-all">
                        Workshop
                    </button>
                    <button
                        className="px-6 py-2 rounded-full bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 hover:border-primary text-sm font-semibold transition-all">
                        Penimbangan
                    </button>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        className="group relative overflow-hidden rounded-xl bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="aspect-[4/3] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQf5WxaCLBymKzLkvu1X7MV3eKMuXM3SveNdMOtefaPxMaaXyeXiYAaslP-b2QbV8JnXDFjqXPBXb603sSrh0_NvP-w5hECQdX-qmDmCUhYDY0sG558XpGOKY6nipaLyw1xuIyJILyRtXE3D1jIBqbzOEdeHosI3IEfL4amaYqJIySLrInQcKQnqKqNqta9Q_EIGwEDmg4-6oitwpCYA-vjNx3adDIPdH0bk1qWMraOy8l2OEADXK3m2M9Tmy_MUUyesmWjKdgFDDv')" }}>
                        </div>
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Sosialisasi</span>
                            <h3 className="text-white font-bold text-lg leading-snug mb-1">Edukasi Pemilahan Rumah Tangga</h3>
                            <p className="text-white/70 text-sm mb-3">Kegiatan rutin edukasi warga di RW 04 Kebayoran Lama.</p>
                            <div className="flex items-center text-white/50 text-xs">
                                <span className="material-symbols-outlined text-sm mr-1">calendar_today</span>
                                20 Mei 2024
                            </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-white/5 group-hover:invisible transition-all">
                            <h3 className="font-bold text-sm truncate">Edukasi Pemilahan Rumah Tangga</h3>
                            <p className="text-xs opacity-50 mt-1">20 Mei 2024</p>
                        </div>
                    </div>

                    <div
                        className="group relative overflow-hidden rounded-xl bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="aspect-[4/3] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBen9vAFHVGLuMIuHCDIWcLAduPe_6KLVcA5OWZKwbh3IUDQ9s8TiAj8NUJ6YH-R1kV92Wm-pJJZ6L8H_o-HL6zsaNYjZ3qh2EkuTTNALKLfRvIP9wr7Gn5T32ShJBdUIB6vPSO0mKvJPPlLQyiCWw0SUmvaAxDYhSH2dlSBcQqoO8FCxF_Z1baM4brv9j7BJbl5_FU-53rcT_xXGPo-i-CO6Ao1f7yaaSPz_h19bEerImjxJg0R0hyPQxVdh11ngMBYunmUQFFkzpt')" }}>
                        </div>
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Workshop</span>
                            <h3 className="text-white font-bold text-lg leading-snug mb-1">Pelatihan Eco-Enzyme</h3>
                            <p className="text-white/70 text-sm mb-3">Mengolah sampah organik dapur menjadi cairan multiguna.</p>
                            <div className="flex items-center text-white/50 text-xs">
                                <span className="material-symbols-outlined text-sm mr-1">calendar_today</span>
                                15 Mei 2024
                            </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-white/5 group-hover:invisible transition-all">
                            <h3 className="font-bold text-sm truncate">Pelatihan Eco-Enzyme</h3>
                            <p className="text-xs opacity-50 mt-1">15 Mei 2024</p>
                        </div>
                    </div>

                    <div
                        className="group relative overflow-hidden rounded-xl bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="aspect-[4/3] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA8vqQ102-r9unvLkOW9NQzijhmSkrlyvajE3S6Yve2_F2AJDNFmi3vzh9cDjnrZFWBdihwk5SM47fbq17C6ZX2seWXG_W7Jmf1NsUbAJACRYgrUFIPGCaNYQL60Jy54hgIrRpTpLx7TzOSj2PM-ufkDc8DmkcCK5PlOTeIcOp221j2kdlV4-EhX9uR5rijHzQs17b4JjvBmE1HK0TsGt7JOHWxUeVpGdbhymZAAhUsjYgiQMrF-sTKgTf_MMxuKVjS2reRSiqGYde_')" }}>
                        </div>
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Penjemputan</span>
                            <h3 className="text-white font-bold text-lg leading-snug mb-1">Layanan Jemput Bola</h3>
                            <p className="text-white/70 text-sm mb-3">Armada operasional melakukan pengambilan sampah anorganik terjadwal.</p>
                            <div className="flex items-center text-white/50 text-xs">
                                <span className="material-symbols-outlined text-sm mr-1">calendar_today</span>
                                12 Mei 2024
                            </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-white/5 group-hover:invisible transition-all">
                            <h3 className="font-bold text-sm truncate">Layanan Jemput Bola</h3>
                            <p className="text-xs opacity-50 mt-1">12 Mei 2024</p>
                        </div>
                    </div>

                    <div
                        className="group relative overflow-hidden rounded-xl bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="aspect-[4/3] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCzjsDOVpAwvkVURgg1WC87hqTIyCtf5Jr_JEtOrrIqSKdEEWSx-NWvczzArjTN0EQekC_gggBO3RNPH7Ff6XyMjosWa5wTr1as72r3R-lkLE1-KmJB73r8hOHcYZPxil4H7kojLZsZqfIq85cGNFBh8EZxL7aRqt--bk1-cLwGK1M_MMbiWsupAwyYkO0p5j1PH6jiFk_MDo7XTW_2WXkxa532Rj64qKdrDXC2ZQMkLyCbwonIkEzEjsqoENyX-cCOKtMgMp0TFq18')" }}>
                        </div>
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Penimbangan</span>
                            <h3 className="text-white font-bold text-lg leading-snug mb-1">Hari Tabungan Rutin</h3>
                            <p className="text-white/70 text-sm mb-3">Warga antusias menyetorkan sampah yang telah dipilah dari rumah.</p>
                            <div className="flex items-center text-white/50 text-xs">
                                <span className="material-symbols-outlined text-sm mr-1">calendar_today</span>
                                05 Mei 2024
                            </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-white/5 group-hover:invisible transition-all">
                            <h3 className="font-bold text-sm truncate">Hari Tabungan Rutin</h3>
                            <p className="text-xs opacity-50 mt-1">05 Mei 2024</p>
                        </div>
                    </div>

                    <div
                        className="group relative overflow-hidden rounded-xl bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="aspect-[4/3] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCHQPfkYUsSaYj75S640BHI9qA5LdFzHEBTjRcC6jzZXHgww2GixOiqWP-Qq0AGVJJIo82qQbZOBJFhoSMX6EMp0kLNWAT-AxOvPLfg-0C0-TC662PYxWxlB2AgsCYCEC7nZS0x41i6GO_SQGbXG8yJsDyJPEXcjR6FfEhpYJTEFuJnYqWeRLMmF5L1tLXaAhdQsvm7bI3BCw7dg5sWP8ry4mnllrIbFYCMX7gtMCgIZ3z1Y7r4JWSN6ybh9Qtw0_krF-YomJ-E7ttE')" }}>
                        </div>
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Workshop</span>
                            <h3 className="text-white font-bold text-lg leading-snug mb-1">Kerajinan Daur Ulang</h3>
                            <p className="text-white/70 text-sm mb-3">Pelatihan membuat tas belanja dari kemasan plastik bekas.</p>
                            <div className="flex items-center text-white/50 text-xs">
                                <span className="material-symbols-outlined text-sm mr-1">calendar_today</span>
                                28 April 2024
                            </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-white/5 group-hover:invisible transition-all">
                            <h3 className="font-bold text-sm truncate">Kerajinan Daur Ulang</h3>
                            <p className="text-xs opacity-50 mt-1">28 April 2024</p>
                        </div>
                    </div>

                    <div
                        className="group relative overflow-hidden rounded-xl bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="aspect-[4/3] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQf5WxaCLBymKzLkvu1X7MV3eKMuXM3SveNdMOtefaPxMaaXyeXiYAaslP-b2QbV8JnXDFjqXPBXb603sSrh0_NvP-w5hECQdX-qmDmCUhYDY0sG558XpGOKY6nipaLyw1xuIyJILyRtXE3D1jIBqbzOEdeHosI3IEfL4amaYqJIySLrInQcKQnqKqNqta9Q_EIGwEDmg4-6oitwpCYA-vjNx3adDIPdH0bk1qWMraOy8l2OEADXK3m2M9Tmy_MUUyesmWjKdgFDDv')" }}>
                        </div>
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Sosialisasi</span>
                            <h3 className="text-white font-bold text-lg leading-snug mb-1">Kunjungan Sekolah Hijau</h3>
                            <p className="text-white/70 text-sm mb-3">Mengenalkan proses bank sampah kepada siswa Sekolah Dasar.</p>
                            <div className="flex items-center text-white/50 text-xs">
                                <span className="material-symbols-outlined text-sm mr-1">calendar_today</span>
                                22 April 2024
                            </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-white/5 group-hover:invisible transition-all">
                            <h3 className="font-bold text-sm truncate">Kunjungan Sekolah Hijau</h3>
                            <p className="text-xs opacity-50 mt-1">22 April 2024</p>
                        </div>
                    </div>
                </section>

                <div className="mt-16 flex justify-center">
                    <button
                        className="flex items-center gap-2 min-w-[220px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 border-2 border-primary text-primary hover:bg-primary hover:text-background-dark text-base font-bold transition-all shadow-lg shadow-primary/10">
                        <span className="material-symbols-outlined">refresh</span>
                        <span>Muat Lebih Banyak</span>
                    </button>
                </div>
            </main>
            <Footer />
        </main>
    );
}
