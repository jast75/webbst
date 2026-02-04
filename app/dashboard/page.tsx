"use client"

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, FileText, ShoppingCart, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, getCountFromServer } from "firebase/firestore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TransaksiBSTService, TransaksiBST } from "@/lib/TransaksiBSTService";
import { DailySummaryService } from "@/lib/DailySummaryService";
import { LoadingSpinner } from "@/components/ui/loading";
import { Banknote } from "lucide-react";

export default function DashboardPage() {
  const { nasabah, jenisSampah, loading: contextLoading } = useApp();
  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [totalPenjualan, setTotalPenjualan] = useState(0);
  const [recentSales, setRecentSales] = useState<TransaksiBST[]>([]);
  const [latestSummary, setLatestSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Stats from context (real-time)
  const totalNasabah = nasabah.length;
  const totalStok = useMemo(() =>
    jenisSampah.reduce((sum, item) => sum + (item.stok || 0), 0)
    , [jenisSampah]);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch total transaksi count efficiently
        const nTrxSnap = await getCountFromServer(collection(db, "transaksi_nasabah"));
        setTotalTransaksi(nTrxSnap.data().count);

        // Fetch total penjualan (amount)
        // Note: For now we fetch all to sum, but in production consider a summary document
        const bTrxSnap = await getDocs(collection(db, "transaksi_bst"));
        let sumPenjualan = 0;
        bTrxSnap.forEach(doc => {
          sumPenjualan += (doc.data().totalPenjualan || 0);
        });
        setTotalPenjualan(sumPenjualan);

        // Fetch recent sales using service
        const recent = await TransaksiBSTService.getAllSales(5);
        setRecentSales(recent.data);

        // Fetch latest daily summary
        const summary = await DailySummaryService.getLatestSummary();
        setLatestSummary(summary);

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const isDataLoading = contextLoading || loading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nasabah</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isDataLoading ? (
              <LoadingSpinner className="h-6 w-6" />
            ) : (
              <>
                <div className="text-xl md:text-2xl font-bold">{totalNasabah.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Nasabah terdaftar</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isDataLoading ? (
              <LoadingSpinner className="h-6 w-6" />
            ) : (
              <>
                <div className="text-xl md:text-2xl font-bold">{totalTransaksi.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Transaksi masuk</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Sampah</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isDataLoading ? (
              <LoadingSpinner className="h-6 w-6" />
            ) : (
              <>
                <div className="text-xl md:text-2xl font-bold">{totalStok.toFixed(2)} Kg</div>
                <p className="text-xs text-muted-foreground">Total di gudang</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isDataLoading ? (
              <LoadingSpinner className="h-6 w-6" />
            ) : (
              <>
                <div className="text-xl md:text-2xl font-bold">{formatCurrency(totalPenjualan)}</div>
                <p className="text-xs text-muted-foreground">Omzet penjualan</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-100 dark:border-green-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Ringkasan Nasabah (Terakhir)</CardTitle>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
              {latestSummary ? (DailySummaryService.isToday(latestSummary.date) ? 'Hari ini' : formatDate(latestSummary.date, false)) : 'Belum ada transaksi'}
            </p>
          </div>
          <Banknote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          {latestSummary ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  {formatCurrency(latestSummary.totalAmount)}
                </div>
                <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70">Total Pembelian</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  {latestSummary.transactionCount}
                </div>
                <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70">Jumlah Transaksi</p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-emerald-600/60 dark:text-emerald-400/60 italic">
              Lakukan transaksi nasabah pertama untuk melihat ringkasan di sini.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground italic px-4 text-center text-sm">
              Statistik riwayat penjualan akan segera hadir
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Penjualan Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isDataLoading ? (
                <div className="flex justify-center p-4">
                  <LoadingSpinner className="h-6 w-6" />
                </div>
              ) : recentSales.length === 0 ? (
                <div className="text-sm text-center text-muted-foreground">Belum ada transaksi</div>
              ) : (
                recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between border-b pb-2 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors p-1 rounded">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none truncate max-w-[150px] md:max-w-none">{sale.buyerName || "Umum"}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{formatDate(sale.tanggal, false)}</p>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      +{formatCurrency(sale.totalPenjualan)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

