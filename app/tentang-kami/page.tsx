import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TeamGrid from '../../components/TeamGrid';

export default function About() {
    return (
        <main>
            <Header />
            <main>
                <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-black/50 z-10"></div>
                        <div className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBen9vAFHVGLuMIuHCDIWcLAduPe_6KLVcA5OWZKwbh3IUDQ9s8TiAj8NUJ6YH-R1kV92Wm-pJJZ6L8H_o-HL6zsaNYjZ3qh2EkuTTNALKLfRvIP9wr7Gn5T32ShJBdUIB6vPSO0mKvJPPlLQyiCWw0SUmvaAxDYhSH2dlSBcQqoO8FCxF_Z1baM4brv9j7BJbl5_FU-53rcT_xXGPo-i-CO6Ao1f7yaaSPz_h19bEerImjxJg0R0hyPQxVdh11ngMBYunmUQFFkzpt')" }}>
                        </div>
                    </div>
                    <div className="relative z-20 text-center px-4">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Tentang Kami</h1>
                        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">Membangun ekosistem berkelanjutan melalui
                            pengelolaan sampah yang cerdas dan bernilai ekonomi.</p>
                    </div>
                </section>
                <div className="max-w-[1280px] mx-auto px-4">
                    <section className="py-20" id="visi-misi">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black mb-4">Visi &amp; Misi Kami</h2>
                            <p className="opacity-70 max-w-2xl mx-auto">Fokus kami bukan hanya mengelola sampah, tapi membangun
                                kesadaran kolektif untuk masa depan bumi yang lebih sehat.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="bg-primary/5 p-10 rounded-2xl border border-primary/20">
                                <div className="size-14 bg-primary text-background-dark rounded-xl flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-3xl">visibility</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Visi Kami</h3>
                                <p className="text-lg leading-relaxed opacity-80">Menjadi pusat inovasi pengelolaan sampah terpadu
                                    yang mampu mengubah paradigma masyarakat terhadap sampah dari beban menjadi peluang ekonomi
                                    berkelanjutan.</p>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="flex gap-4 p-6 bg-white dark:bg-white/5 rounded-xl border border-[#dce5e0] dark:border-white/10">
                                    <span className="material-symbols-outlined text-primary text-3xl">eco</span>
                                    <div>
                                        <h4 className="font-bold text-lg">Pelestarian Alam</h4>
                                        <p className="opacity-70 text-sm">Mengurangi beban sampah di TPA dengan memaksimalkan proses
                                            daur ulang.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-6 bg-white dark:bg-white/5 rounded-xl border border-[#dce5e0] dark:border-white/10">
                                    <span className="material-symbols-outlined text-primary text-3xl">payments</span>
                                    <div>
                                        <h4 className="font-bold text-lg">Kesejahteraan Ekonomi</h4>
                                        <p className="opacity-70 text-sm">Menciptakan sistem tabungan sampah yang memberikan
                                            insentif nyata bagi warga.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-6 bg-white dark:bg-white/5 rounded-xl border border-[#dce5e0] dark:border-white/10">
                                    <span className="material-symbols-outlined text-primary text-3xl">school</span>
                                    <div>
                                        <h4 className="font-bold text-lg">Edukasi Berkelanjutan</h4>
                                        <p className="opacity-70 text-sm">Mengedukasi sekolah, komunitas, dan rumah tangga mengenai
                                            pemilihan sampah.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="py-24 border-t border-[#dce5e0] dark:border-white/10" id="sejarah">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black mb-4">Perjalanan Kami</h2>
                            <p className="opacity-70">Bagaimana sebuah inisiatif kecil berkembang menjadi gerakan komunitas.</p>
                        </div>
                        <div className="relative max-w-4xl mx-auto py-10">
                            <div className="timeline-line hidden md:block"></div>
                            <div className="flex flex-col md:flex-row items-center justify-between mb-16 w-full group">
                                <div className="md:w-5/12 text-right hidden md:block">
                                    <h4 className="text-xl font-black text-primary">Januari 2025</h4>
                                    <p className="opacity-70 mt-2">Awal mula pendirian Bank Sampah Teratai yang di inisiasi oleh Pengurus RT / RW dan beberapa warga
                                        peduli lingkungan di Babakan Perumnas RT 10 RW 06, Kelurahan Baranangsiang, Bogor Timur.</p>
                                </div>
                                <div className="size-6 bg-primary rounded-full z-10 border-4 border-white dark:border-background-dark mb-4 md:mb-0">
                                </div>
                                <div className="md:w-5/12">
                                    <div className="md:hidden text-center mb-2">
                                        <h4 className="text-xl font-black text-primary">Februari 2025</h4>
                                    </div>
                                    <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-[#dce5e0] dark:border-white/10 shadow-sm">
                                        <h5 className="font-bold mb-2">Sosialisasi Bank Sampah Teratai</h5>
                                        <p className="text-sm opacity-70">Dimulai dari sebuah Pos Yandu sederhana dengan 10 anggota pertama
                                            yang berkomitmen memilah sampah rumah tangga. Bank Sampah Teratai mengadakan kegiatan Bazar Sembako
                                            yang dapat ditukar dengan sampah warga. Kegiatan ini juga dimeriahkan oleh acara senam sehat bersama warga.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row-reverse items-center justify-between mb-16 w-full group">
                                <div className="md:w-5/12 text-left hidden md:block">
                                    <h4 className="text-xl font-black text-primary">Maret 2025</h4>
                                    <p className="opacity-70 mt-2">Bank Sampah Teratai mendapatkan izin resmi dari Pemerintah Kota Bogor
                                        melalui SK Lurah Baranangsiang Nomor 600/ 28 BRS.</p>
                                </div>
                                <div className="size-6 bg-primary rounded-full z-10 border-4 border-white dark:border-background-dark mb-4 md:mb-0">
                                </div>
                                <div className="md:w-5/12">
                                    <div className="md:hidden text-center mb-2">
                                        <h4 className="text-xl font-black text-primary">Juli 2025</h4>
                                    </div>
                                    <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-[#dce5e0] dark:border-white/10 shadow-sm">
                                        <h5 className="font-bold mb-2">Digitalisasi Sistem</h5>
                                        <p className="text-sm opacity-70">Peluncuran sistem pencatatan digital berbasis android untuk memudahkan admin dan nasabah
                                            memantau saldo tabungan sampah mereka. Bekerjasama dengan Bank Sampah Barokah untuk penjemputan sampah.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-between w-full group">
                                <div className="md:w-5/12 text-right hidden md:block">
                                    <h4 className="text-xl font-black text-primary">Oktober 2025</h4>
                                    <p className="opacity-70 mt-2">Kegiatan pengumpulan sampah yang dapat di daur ulang dari warga. Beberapa
                                        warga mulai antusias untuk ikut menjadi nasabah Bank Sampah Teratai.
                                    </p>
                                </div>
                                <div className="size-6 bg-primary rounded-full z-10 border-4 border-white dark:border-background-dark mb-4 md:mb-0">
                                </div>
                                <div className="md:w-5/12">
                                    <div className="md:hidden text-center mb-2">
                                        <h4 className="text-xl font-black text-primary">Februari 2026</h4>
                                    </div>
                                    <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-[#dce5e0] dark:border-white/10 shadow-sm">
                                        <h5 className="font-bold mb-2">Rencana Ekspansi</h5>
                                        <p className="text-sm opacity-70">Pembuatan Website Bank Sampah Teratai dan Aplikasi Bank Sampah dalam satu wadah
                                            untuk lebih memudahkan dan memperluas jangkauan sosialisasi dan rencana ekspansi di masa depan.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <TeamGrid />
                </div>
                <section className="bg-primary py-20 mt-10">
                    <div className="max-w-[1280px] mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-5xl font-black text-background-dark mb-6">Siap Menjadi Bagian dari
                            Perubahan?</h2>
                        <p className="text-background-dark/80 text-lg mb-10 max-w-2xl mx-auto">Mulai langkah kecilmu hari ini dengan
                            memilah sampah di rumah dan bergabung bersama kami.</p>
                        <button className="bg-background-dark text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-background-dark/90 transition-all shadow-xl">
                            Daftar Jadi Nasabah
                        </button>
                    </div>
                </section>
            </main>
            <Footer />
        </main>
    );
}
