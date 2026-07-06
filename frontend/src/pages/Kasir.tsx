import { useEffect, useState } from "react";
import { get, post } from "../services/api";

type Transaction = {
  id: number;
  nomor_plat?: string;
  nama_pelanggan?: string;
  no_hp?: string;
  total?: number;
  status?: string;
  created_at?: string;
  tanggal?: string;
};

type VehicleType = {
  id: number;
  nama: string;
};

const defaultTransactions: Transaction[] = [
  { id: 0, tanggal: "-", total: 0, status: "-" },
];

const initialForm = {
  nomor_plat: "",
  nama_pelanggan: "",
  no_hp: "",
  jenis_kendaraan_id: "",
  metode_bayar: "Cash",
  total: "",
  diskon: "0",
  catatan: "",
};

export default function Kasir() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const response = await get<Transaction[]>("transactions");
      setTransactions(response.data || defaultTransactions);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat transaksi.");
      setTransactions(defaultTransactions);
    }
  };

  const fetchVehicleTypes = async () => {
    try {
      const response = await get<VehicleType[]>("vehicle-types");
      setVehicleTypes(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        await Promise.all([fetchTransactions(), fetchVehicleTypes()]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!form.nomor_plat.trim() || !form.jenis_kendaraan_id.trim() || !form.total.trim()) {
      setErrorMessage("Nomor plat, jenis kendaraan, dan total wajib diisi.");
      return;
    }

    setSubmitting(true);

    try {
      await post("transactions", {
        nomor_plat: form.nomor_plat,
        nama_pelanggan: form.nama_pelanggan,
        no_hp: form.no_hp,
        jenis_kendaraan_id: Number(form.jenis_kendaraan_id),
        total: Number(form.total) || 0,
        diskon: Number(form.diskon) || 0,
        metode_bayar: form.metode_bayar,
        catatan: form.catatan,
      });

      setSuccessMessage("Transaksi berhasil disimpan.");
      setForm(initialForm);
      await fetchTransactions();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan transaksi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Halaman Kasir</h2>
            <p className="text-sm text-slate-500">Buat transaksi baru dan lihat transaksi terakhir.</p>
          </div>
          {loading && <span className="text-sm text-slate-500">Memuat...</span>}
        </div>

        {successMessage && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{successMessage}</div>}
        {errorMessage && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 xl:grid-cols-[1fr_1fr]">
          <div>
            <label className="block text-sm font-medium">Nomor Plat</label>
            <input
              value={form.nomor_plat}
              onChange={(e) => handleChange("nomor_plat", e.target.value)}
              className="mt-2 block w-full rounded-md border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Jenis Kendaraan</label>
            <select
              value={form.jenis_kendaraan_id}
              onChange={(e) => handleChange("jenis_kendaraan_id", e.target.value)}
              className="mt-2 block w-full rounded-md border px-3 py-2"
              required
            >
              <option value="">Pilih jenis kendaraan</option>
              {vehicleTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Nama Pelanggan</label>
            <input
              value={form.nama_pelanggan}
              onChange={(e) => handleChange("nama_pelanggan", e.target.value)}
              className="mt-2 block w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">No HP</label>
            <input
              value={form.no_hp}
              onChange={(e) => handleChange("no_hp", e.target.value)}
              className="mt-2 block w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Total</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.total}
              onChange={(e) => handleChange("total", e.target.value)}
              className="mt-2 block w-full rounded-md border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Diskon</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.diskon}
              onChange={(e) => handleChange("diskon", e.target.value)}
              className="mt-2 block w-full rounded-md border px-3 py-2"
            />
          </div>
          <div className="xl:col-span-2">
            <label className="block text-sm font-medium">Metode Bayar</label>
            <select
              value={form.metode_bayar}
              onChange={(e) => handleChange("metode_bayar", e.target.value)}
              className="mt-2 block w-full rounded-md border px-3 py-2"
            >
              <option value="Cash">Cash</option>
              <option value="Transfer">Transfer</option>
              <option value="E-Wallet">E-Wallet</option>
            </select>
          </div>
          <div className="xl:col-span-2">
            <label className="block text-sm font-medium">Catatan</label>
            <textarea
              value={form.catatan}
              onChange={(e) => handleChange("catatan", e.target.value)}
              className="mt-2 block w-full rounded-md border px-3 py-2"
              rows={3}
            />
          </div>
          <div className="xl:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {submitting ? "Menyimpan..." : "Simpan Transaksi"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold">Transaksi Terakhir</h3>
            <p className="text-sm text-slate-500">Melihat transaksi terbaru dari sistem.</p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">No</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Tanggal</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Total</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {!transactions.length ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                    Tidak ada transaksi.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction, index) => (
                  <tr key={transaction.id || index} className="border-t border-slate-200">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      {new Date(transaction.tanggal || transaction.created_at || Date.now()).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-3">Rp {Number(transaction.total || 0).toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3">{transaction.status || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
