
'use client';

import React from 'react';
import { CldImage } from 'next-cloudinary';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Typewriter from '../components/Typewriter';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {/* Hero Section - Full Width with Centered Box */}
                <section className="relative w-full h-[600px] md:h-[750px] flex items-center justify-center overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <CldImage
                            src="bank-sampah-teratai-bogor_lbg8kj"
                            alt="Bank Sampah Teratai Bogor"
                            fill
                            priority
                            className="object-cover object-center"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-black/40 backdrop-brightness-75" />
                    </div>

                    {/* Content Box - Glassmorphism */}
                    <div className="relative z-10 max-w-[900px] mx-4 p-6 md:p-16 rounded-[2.5rem] backdrop-blur-xl bg-white/5 border border-white/20 shadow-2xl flex flex-col items-center text-center gap-8 animate-fade-in-up">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white min-h-[110px] md:min-h-[130px] lg:min-h-[160px]">
                                <Typewriter
                                    parts={[
                                        { text: "Ubah Sampah Jadi " },
                                        { text: "Rupiah", className: "text-primary" },
                                        { text: ",\n" },
                                        { text: "Jaga Bumi Tetap Indah" }
                                    ]}
                                    speed={100}
                                    pauseDuration={4000}
                                    loop={true}
                                />
                            </h1>
                            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-[650px] mx-auto">
                                Bergabunglah dengan gerakan pengelolaan sampah mandiri dan mulai tabung sampah anorganikmu
                                menjadi penghasilan tambahan sekaligus menyelamatkan lingkungan.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-primary text-background-dark text-base font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300">
                                <span className="truncate">Pelajari Lebih Lanjut</span>
                            </button>
                            <button className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-white/10 border border-white/30 text-white text-base font-bold backdrop-blur-md hover:bg-white/20 transition-all duration-300">
                                <span className="truncate">Cek Lokasi Kami</span>
                            </button>
                        </div>
                    </div>
                </section>
                <section className="max-w-[1280px] mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2 rounded-xl p-8 bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 shadow-sm transition-transform hover:-translate-y-1">
                            <span className="material-symbols-outlined text-primary text-3xl mb-2">delete_sweep</span>
                            <p className="text-sm font-medium uppercase tracking-wider opacity-60">Total Sampah Terkelola</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-black">1+ Ton</p>
                                <p className="text-primary text-sm font-bold flex items-center"><span className="material-symbols-outlined text-xs">trending_up</span> +15%</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl p-8 bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 shadow-sm transition-transform hover:-translate-y-1">
                            <span className="material-symbols-outlined text-primary text-3xl mb-2">groups</span>
                            <p className="text-sm font-medium uppercase tracking-wider opacity-60">Anggota Aktif</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-black">20+</p>
                                <p className="text-primary text-sm font-bold flex items-center"><span className="material-symbols-outlined text-xs">trending_up</span> +5%</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl p-8 bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 shadow-sm transition-transform hover:-translate-y-1">
                            <span className="material-symbols-outlined text-primary text-3xl mb-2">payments</span>
                            <p className="text-sm font-medium uppercase tracking-wider opacity-60">Total Transaksi</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-black">Rp 1.2jt+</p>
                                <p className="text-primary text-sm font-bold flex items-center"><span className="material-symbols-outlined text-xs">trending_up</span> +12%</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="max-w-[1280px] mx-auto px-4 py-16" id="tentang">
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-3xl md:text-4xl font-black leading-tight max-w-[720px]">
                                Visi &amp; Misi Kami
                            </h2>
                            <p className="text-base opacity-70 leading-relaxed max-w-[720px]">
                                Kami percaya bahwa setiap sampah memiliki nilai. Bank Sampah Teratai hadir untuk memberdayakan
                                masyarakat melalui sistem pengelolaan sampah berkelanjutan demi masa depan yang lebih hijau dan
                                ekonomi yang lebih kuat.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-4 rounded-xl border border-[#dce5e0] dark:border-white/10 bg-white dark:bg-white/5 p-8">
                                <div className="text-primary bg-primary/10 size-12 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl">psychology</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-lg font-bold leading-tight">Edukasi Lingkungan</h3>
                                    <p className="opacity-70 text-sm leading-normal">Memberikan pemahaman mendalam tentang pemilahan
                                        sampah dari sumbernya kepada masyarakat luas.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 rounded-xl border border-[#dce5e0] dark:border-white/10 bg-white dark:bg-white/5 p-8">
                                <div className="text-primary bg-primary/10 size-12 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl">currency_exchange</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-lg font-bold leading-tight">Ekonomi Sirkular</h3>
                                    <p className="opacity-70 text-sm leading-normal">Mengubah beban sampah menjadi sumber pendapatan
                                        baru melalui sistem tabungan sampah digital.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 rounded-xl border border-[#dce5e0] dark:border-white/10 bg-white dark:bg-white/5 p-8">
                                <div className="text-primary bg-primary/10 size-12 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl">diversity_3</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-lg font-bold leading-tight">Pemberdayaan Warga</h3>
                                    <p className="opacity-70 text-sm leading-normal">Melibatkan seluruh lapisan masyarakat dalam
                                        aksi nyata pelestarian lingkungan yang inklusif.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-dark-green text-white py-20" id="dampak">
                    <div className="max-w-[1280px] mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex flex-col gap-10 lg:w-1/2">
                            <div className="flex flex-col gap-4">
                                <h2 className="text-4xl font-black leading-tight tracking-tight">Dampak Nyata Untuk Lingkungan</h2>
                                <p className="text-lg opacity-80 leading-relaxed">Kontribusi kolektif seluruh anggota Bank Sampah
                                    Teratai telah membuahkan hasil nyata bagi kelestarian bumi kita.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="flex flex-col gap-1">
                                    <p className="text-primary text-4xl font-black">1,250+</p>
                                    <p className="text-sm font-semibold uppercase tracking-wider opacity-60">Trees Saved</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-primary text-4xl font-black">450kg</p>
                                    <p className="text-sm font-semibold uppercase tracking-wider opacity-60">Carbon Reduced</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-primary text-4xl font-black">8.5 Ton</p>
                                    <p className="text-sm font-semibold uppercase tracking-wider opacity-60">Plastic Recycled</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-primary text-4xl font-black">15+ Ha</p>
                                    <p className="text-sm font-semibold uppercase tracking-wider opacity-60">Clean Land</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="w-full aspect-square relative rounded-2xl shadow-2xl overflow-hidden">
                                <CldImage
                                    src="selamatkan-hutan_rv4s8j"
                                    alt="Menyelamatkan hutan dan lingkungan"
                                    fill
                                    className="object-cover object-center"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="max-w-[1280px] mx-auto px-4 py-16" id="galeri">
                    <div className="flex flex-col gap-8">
                        <div className="text-center flex flex-col gap-2">
                            <h2 className="text-3xl font-black">Aktivitas Kami</h2>
                            <p className="opacity-60 max-w-xl mx-auto">Dokumentasi kegiatan rutin penjemputan, pemilahan, dan
                                edukasi warga di lapangan.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="aspect-square rounded-xl overflow-hidden group relative shadow-md">
                                <CldImage
                                    src="bazar-bst_fkhlfv"
                                    alt="Kegiatan Pemilahan"
                                    fill
                                    className="object-cover object-center transition-transform group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 z-10">
                                    <p className="text-white text-xs font-bold">Kegiatan Pemilahan</p>
                                </div>
                            </div>
                            <div className="aspect-square rounded-xl overflow-hidden group relative shadow-md">
                                <CldImage
                                    src="personil-bst_uahmiw"
                                    alt="Workshop Warga"
                                    fill
                                    className="object-cover object-center transition-transform group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 z-10">
                                    <p className="text-white text-xs font-bold">Workshop Warga</p>
                                </div>
                            </div>
                            <div className="aspect-square rounded-xl overflow-hidden group relative shadow-md">
                                <CldImage
                                    src="penjemputan_xa3rlz"
                                    alt="Pengangkutan Sampah"
                                    fill
                                    className="object-cover object-center transition-transform group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 z-10">
                                    <p className="text-white text-xs font-bold">Pengangkutan Sampah</p>
                                </div>
                            </div>
                            <div className="aspect-square rounded-xl overflow-hidden group relative shadow-md">
                                <CldImage
                                    src="Timbangan_sbh5t8"
                                    alt="Penimbangan Rutin"
                                    fill
                                    className="object-cover object-center transition-transform group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 z-10">
                                    <p className="text-white text-xs font-bold">Penimbangan Rutin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
