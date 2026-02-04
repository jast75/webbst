'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatCurrency } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { JenisSampahService, JenisSampah } from '@/lib/JenisSampahService';

export default function UpdateHargaPage() {
    const [jenisSampah, setJenisSampah] = useState<JenisSampah[]>([]);
    const [filteredSampah, setFilteredSampah] = useState<JenisSampah[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const itemsPerPage = 5;

    const categories = ['Semua', 'Plastik', 'Kertas', 'Logam', 'Beling', 'Campuran', 'Rongsok', 'Lainnya'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await JenisSampahService.getAllJenisSampah();

                let latestDate: Date | null = null;
                data.forEach((item: JenisSampah) => {
                    const updatedAt = item.updatedAt?.toDate ? item.updatedAt.toDate() : item.updatedAt instanceof Date ? item.updatedAt : null;
                    if (updatedAt && (!latestDate || updatedAt > latestDate)) {
                        latestDate = updatedAt;
                    }
                });

                setLastUpdate(latestDate);
                setJenisSampah(data);
                setFilteredSampah(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let filtered = jenisSampah;

        if (activeCategory !== 'Semua') {
            filtered = filtered.filter((item) => (item.kategori || 'Lainnya').toLowerCase() === activeCategory.toLowerCase());
        }

        if (searchQuery) {
            filtered = filtered.filter((item) =>
                item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.kategori || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredSampah(filtered);
        setCurrentPage(1);
    }, [searchQuery, activeCategory, jenisSampah]);

    const totalPages = Math.ceil(filteredSampah.length / itemsPerPage);
    const paginatedSampah = filteredSampah.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getCategoryStyles = (category: string) => {
        switch (category.toLowerCase()) {
            case 'plastik': return 'bg-blue-100 text-blue-700';
            case 'kertas': return 'bg-orange-100 text-orange-700';
            case 'logam': return 'bg-zinc-100 text-zinc-700';
            case 'beling': return 'bg-teal-100 text-teal-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Add header
        doc.setFontSize(22);
        doc.setTextColor(16, 185, 129); // #10B981
        doc.text('Bank Sampah Teratai', 14, 20);

        doc.setFontSize(16);
        doc.setTextColor(31, 41, 55); // Gray 800
        doc.text('Daftar Harga Jenis Sampah', 14, 30);

        // Add date
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128); // Gray 500
        const dateStr = lastUpdate
            ? lastUpdate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        doc.text(`Update terakhir: ${dateStr}`, 14, 38);

        // Prepare table data grouped by category
        const tableData: any[] = [];

        // Get all unique categories from the actual data (excluding 'Semua')
        const dataCategories = Array.from(new Set(jenisSampah.map(item => item.kategori || 'Lainnya'))).sort();

        dataCategories.forEach(cat => {
            const items = jenisSampah.filter(item => (item.kategori || 'Lainnya') === cat);
            if (items.length > 0) {
                // Category Header
                tableData.push([
                    {
                        content: cat.toUpperCase(),
                        colSpan: 3,
                        styles: {
                            fillColor: [243, 244, 246], // Gray 100
                            textColor: [16, 185, 129], // Primary
                            fontStyle: 'bold',
                            halign: 'left'
                        }
                    }
                ]);

                items.forEach(item => {
                    tableData.push([
                        item.nama,
                        item.satuan || 'kg',
                        formatCurrency(item.hargaBeli, 'Rp ')
                    ]);
                });
            }
        });

        autoTable(doc, {
            startY: 45,
            head: [['Nama Sampah', 'Satuan', 'Harga Beli']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [16, 185, 129],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center'
            },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 30, halign: 'center' },
                2: { cellWidth: 50, halign: 'right' }
            },
            styles: {
                font: 'helvetica',
                fontSize: 10,
                cellPadding: 4
            },
            margin: { top: 45 }
        });

        // Add footer with page number
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(156, 163, 175);
            doc.text(
                `Halaman ${i} dari ${pageCount} - Bank Sampah Teratai`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        doc.save(`Daftar_Harga_Sampah_BST_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <>
            <Header />
            <main className="max-w-[1280px] mx-auto px-4 py-12">
                <section className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4 text-[#111814] dark:text-white">
                        Update Harga Sampah
                    </h1>
                    <p className="text-base md:text-lg opacity-70 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                        Update terakhir: {lastUpdate
                            ? lastUpdate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                            : 'Memuat...'}
                    </p>
                </section>

                <section className="mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden group flex flex-col justify-center">
                            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="material-symbols-outlined text-primary">monitoring</span>
                                    <h3 className="text-lg font-bold text-[#111814] dark:text-white">Status Pasar Hari Ini</h3>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                    <div className="size-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-primary flex items-center justify-center shrink-0 shadow-sm border border-emerald-100 dark:border-emerald-800">
                                        <span className="material-symbols-outlined text-5xl">trending_up</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-3xl font-black text-primary mb-2">Menguat</h4>
                                        <p className="text-sm opacity-70 leading-relaxed">
                                            Permintaan industri daur ulang meningkat tajam untuk jenis plastik PET dan Logam, mendorong harga naik stabil minggu ini seiring pulihnya ekspor.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-500">local_fire_department</span>
                                    <h3 className="text-lg font-bold text-[#111814] dark:text-white">Kenaikan Tertinggi</h3>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-background-light dark:bg-white/10 rounded text-gray-500 dark:text-gray-300">24 Jam</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
                                <div className="p-4 rounded-xl border border-[#dce5e0] dark:border-white/10 bg-background-light/30 dark:bg-white/5 hover:border-primary/50 transition-colors flex flex-col justify-between group">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 truncate" title="Aluminium Siku">Aluminium Siku</p>
                                        <p className="text-xl font-black text-[#111814] dark:text-white">Rp 15.000</p>
                                    </div>
                                    <div className="mt-3">
                                        <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                                            <span className="material-symbols-outlined text-sm">arrow_upward</span> 4.6%
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border border-[#dce5e0] dark:border-white/10 bg-background-light/30 dark:bg-white/5 hover:border-primary/50 transition-colors flex flex-col justify-between group">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 truncate" title="Koran A">Koran A</p>
                                        <p className="text-xl font-black text-[#111814] dark:text-white">Rp 5.000</p>
                                    </div>
                                    <div className="mt-3">
                                        <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                                            <span className="material-symbols-outlined text-sm">arrow_upward</span> 5.6%
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border border-[#dce5e0] dark:border-white/10 bg-background-light/30 dark:bg-white/5 hover:border-primary/50 transition-colors flex flex-col justify-between group">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 truncate" title="Pet Bening">Pet Bening</p>
                                        <p className="text-xl font-black text-[#111814] dark:text-white">Rp 2.800</p>
                                    </div>
                                    <div className="mt-3">
                                        <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                                            <span className="material-symbols-outlined text-sm">arrow_upward</span> 4.3%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full lg:w-96">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#dce5e0]">search</span>
                                <input
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#dce5e0] dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="Cari jenis sampah..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleDownloadPDF}
                                className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all rounded-xl font-bold text-sm"
                            >
                                <span className="material-symbols-outlined text-xl">description</span>
                                Download PDF
                            </button>
                        </div>
                        <div className="flex gap-2 overflow-x-auto w-full pb-2 scrollbar-hide">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'bg-white dark:bg-white/5 border border-[#dce5e0] dark:border-white/10 font-semibold hover:border-primary'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-[#dce5e0] dark:border-white/10 bg-white dark:bg-white/5 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#dce5e0] dark:border-white/10 bg-background-light/50 dark:bg-white/5">
                                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider opacity-60">Nama Sampah</th>
                                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider opacity-60">Kategori</th>
                                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider opacity-60">Satuan</th>
                                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider opacity-60">Harga (Rp)</th>
                                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider opacity-60 text-right">Perubahan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#dce5e0] dark:divide-white/10">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center opacity-50">Memuat data...</td>
                                    </tr>
                                ) : paginatedSampah.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center opacity-50">Tidak ada data sampah ditemukan.</td>
                                    </tr>
                                ) : (
                                    paginatedSampah.map((item) => (
                                        <tr key={item.id} className="hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-5 font-semibold">{item.nama}</td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getCategoryStyles(item.kategori || 'Lainnya')}`}>
                                                    {item.kategori || 'Lainnya'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 opacity-60 font-medium">{item.satuan}</td>
                                            <td className="px-6 py-5 font-bold">{formatCurrency(item.hargaBeli, '')}</td>
                                            <td className="px-6 py-5 text-right">
                                                {item.perubahan && item.perubahan > 0 ? (
                                                    <span className="text-primary font-bold flex items-center justify-end gap-1">
                                                        <span className="material-symbols-outlined text-sm">arrow_upward</span> {item.perubahan}
                                                    </span>
                                                ) : item.perubahan && item.perubahan < 0 ? (
                                                    <span className="text-red-500 font-bold flex items-center justify-end gap-1">
                                                        <span className="material-symbols-outlined text-sm">arrow_downward</span> {Math.abs(item.perubahan)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 font-bold flex items-center justify-end gap-1">
                                                        <span className="material-symbols-outlined text-sm">remove</span> 0
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t border-[#dce5e0] dark:border-white/10 bg-background-light/30 dark:bg-white/5 flex items-center justify-between">
                        <p className="text-xs opacity-50 font-medium italic">*Harga dapat berubah sewaktu-waktu mengikuti pasar industri daur ulang.</p>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium opacity-60">
                                Halaman {currentPage} dari {totalPages || 1}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded border border-[#dce5e0] dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="p-2 rounded border border-[#dce5e0] dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
