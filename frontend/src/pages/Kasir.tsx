import { useEffect, useState } from "react";
import { get } from "../services/api";

export default function Kasir() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const defaultTransactions = [
    { id: 0, tanggal: "-", total: 0, status: "-" },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await get<any[]>("transactions");
        setTransactions(response.data || defaultTransactions);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Gagal memuat transaksi.");
        setTransactions(defaultTransactions);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="p-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Halaman Kasir</h2>
            <p className="text-sm text-slate-500">Lihat transaksi terakhir dan kelola kasir.</p>
          </div>
          {loading && <span className="text-sm text-slate-500">Memuat...</span>}
        </div>

        {errorMessage && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div>}

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
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                    Tidak ada transaksi.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction, index) => (
                  <tr key={transaction.id || index} className="border-t border-slate-200">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{new Date(transaction.tanggal || transaction.createdAt || Date.now()).toLocaleDateString("id-ID")}</td>
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
