import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import DatePicker from "../components/DatePicker";
import { get } from "../services/api";

type AttendanceHistoryItem = {
  id: number;
  tanggal: string;
  jam_masuk?: string;
  jam_pulang?: string;
  status?: string;
  User?: { nama: string };
};

const columns = [
  { key: "tanggal", label: "Tanggal" },
  { key: "user", label: "Karyawan" },
  { key: "status", label: "Status" },
  { key: "jam_masuk", label: "Jam Masuk" },
  { key: "jam_pulang", label: "Jam Pulang" },
];

export default function History() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<AttendanceHistoryItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async (from?: string, to?: string) => {
    setLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const query = new URLSearchParams();
      if (from) query.append("tanggal_mulai", from);
      if (to) query.append("tanggal_selesai", to);
      const path = query.toString() ? `attendance/report?${query.toString()}` : "attendance/report";
      const response = await get<{ attendances: AttendanceHistoryItem[] }>(path);
      setData(response.data?.attendances || []);
      setStatusMessage(from || to ? "Filter berhasil diterapkan." : "Riwayat absensi dimuat.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat riwayat absensi.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFilter = async () => {
    setStatusMessage(null);
    setErrorMessage(null);

    if (!startDate && !endDate) {
      setErrorMessage("Pilih tanggal mulai atau tanggal selesai untuk filter.");
      return;
    }

    await fetchHistory(startDate, endDate);
  };

  const tableRows = data.map((item) => ({
    tanggal: item.tanggal,
    user: item.User?.nama || "-",
    status: item.status || "-",
    jam_masuk: item.jam_masuk ? new Date(item.jam_masuk).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-",
    jam_pulang: item.jam_pulang ? new Date(item.jam_pulang).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-",
  }));

  
  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Riwayat Absensi</h2>
            <p className="text-sm text-slate-500">Filter dan lihat riwayat absensi karyawan.</p>
          </div>
          {loading && <span className="text-sm text-slate-500">Memuat...</span>}
        </div>

        {statusMessage && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{statusMessage}</div>}
        {errorMessage && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div>}

        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className="block text-sm font-medium">Tanggal Mulai</label>
            <DatePicker value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Tanggal Selesai</label>
            <DatePicker value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleFilter}
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Hasil Riwayat Absensi</h3>
        <div className="mt-4 overflow-x-auto">
          {data.length === 0 && !loading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Tidak ada data absensi.
            </div>
          ) : (
            <DataTable columns={columns} data={data.map((item) => ({
              tanggal: item.tanggal,
              user: item.User?.nama || "-",
              status: item.status || "-",
              jam_masuk: item.jam_masuk ? new Date(item.jam_masuk).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-",
              jam_pulang: item.jam_pulang ? new Date(item.jam_pulang).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-",
            }))} />
          )}
        </div>
      </div>
    </div>
  );
}
