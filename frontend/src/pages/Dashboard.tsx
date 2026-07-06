import { useEffect, useState } from "react";
import { get } from "../services/api";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<{
    totalTransactions: number;
    totalRevenue: number;
    userActive: number;
    userAbsen: number;
    vehicleCounts: { vehicleType: string; count: number }[];
    statusCounts: { status: string; count: number }[];
  }>({
    totalTransactions: 0,
    totalRevenue: 0,
    userActive: 0,
    userAbsen: 0,
    vehicleCounts: [],
    statusCounts: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get<typeof dashboard>("dashboard");
        setDashboard(response.data);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Gagal memuat dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-sm text-slate-500">Ringkasan aktivitas dan transaksi.</p>
          </div>
          {loading && <span className="text-sm text-slate-500">Memuat data...</span>}
        </div>

        {errorMessage && <div className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{errorMessage}</div>}

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Transaksi Total</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{dashboard.totalTransactions ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Pendapatan</p>
            <p className="mt-3 text-3xl font-bold text-green-600">Rp {(dashboard.totalRevenue ?? 0).toLocaleString('id-ID')}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Pengguna Aktif</p>
            <p className="mt-3 text-3xl font-bold text-blue-600">{dashboard.userActive ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Absen Hari Ini</p>
            <p className="mt-3 text-3xl font-bold text-emerald-600">{dashboard.userAbsen ?? 0}</p>
          </div>
        </div>
      </div>

      {dashboard && (
        <div className="grid gap-5 xl:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Jumlah per Status Transaksi</h3>
            <div className="space-y-3">
              {dashboard.statusCounts.map((item) => (
                <div key={item.status} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <span className="text-sm text-slate-600">{item.status}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Jenis Kendaraan Populer</h3>
            <div className="space-y-3">
              {dashboard.vehicleCounts.map((item) => (
                <div key={item.vehicleType} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <span className="text-sm text-slate-600">{item.vehicleType}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 