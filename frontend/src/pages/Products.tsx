import { useEffect, useState } from "react";
import { get, post, put, del } from "../services/api";

type Product = {
  id: number;
  nama_produk: string;
  harga: number;
  komisi?: number;
  estimasi_waktu?: number;
  aktif: boolean;
};

const initialForm = {
  nama_produk: "",
  harga: "",
  komisi: "0",
  estimasi_waktu: "0",
  aktif: true,
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(initialForm);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await get<Product[]>("products");
      setProducts(response.data || []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!form.nama_produk.trim() || !form.harga.trim()) {
      setErrorMessage("Nama produk dan harga wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nama_produk: form.nama_produk,
        harga: Number(form.harga) || 0,
        komisi: Number(form.komisi) || 0,
        estimasi_waktu: Number(form.estimasi_waktu) || 0,
        aktif: form.aktif,
      };

      if (selectedId) {
        await put(`products/${selectedId}`, payload);
        setStatusMessage("Produk berhasil diperbarui.");
      } else {
        await post("products", payload);
        setStatusMessage("Produk berhasil ditambahkan.");
      }

      setForm(initialForm);
      setSelectedId(null);
      await fetchProducts();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan produk.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Product) => {
    setSelectedId(item.id);
    setForm({
      nama_produk: item.nama_produk,
      harga: String(item.harga),
      komisi: String(item.komisi ?? 0),
      estimasi_waktu: String(item.estimasi_waktu ?? 0),
      aktif: item.aktif,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus produk ini?")) return;
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      await del(`products/${id}`);
      setStatusMessage("Produk berhasil dihapus.");
      await fetchProducts();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus produk.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Master Produk</h2>
            <p className="text-sm text-slate-500">Kelola item layanan yang digunakan di kasir.</p>
          </div>
        </div>

        {statusMessage && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{statusMessage}</div>}
        {errorMessage && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Nama Produk</label>
            <input
              value={form.nama_produk}
              onChange={(e) => handleChange("nama_produk", e.target.value)}
              className="mt-2 block w-full rounded-md border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Harga</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.harga}
              onChange={(e) => handleChange("harga", e.target.value)}
              className="mt-2 block w-full rounded-md border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Komisi</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.komisi}
              onChange={(e) => handleChange("komisi", e.target.value)}
              className="mt-2 block w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Estimasi Waktu (menit)</label>
            <input
              type="number"
              min="0"
              value={form.estimasi_waktu}
              onChange={(e) => handleChange("estimasi_waktu", e.target.value)}
              className="mt-2 block w-full rounded-md border px-3 py-2"
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.aktif}
                onChange={(e) => handleChange("aktif", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              Aktif
            </label>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3">
            {selectedId && (
              <button
                type="button"
                onClick={() => {
                  setSelectedId(null);
                  setForm(initialForm);
                }}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {saving ? "Menyimpan..." : selectedId ? "Perbarui Produk" : "Tambah Produk"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Daftar Produk</h3>
            <p className="text-sm text-slate-500">Produk yang bisa dipilih di kasir.</p>
          </div>
          {loading && <span className="text-sm text-slate-500">Memuat...</span>}
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">No</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Nama Produk</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Harga</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Aktif</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                    Tidak ada produk.
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={product.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{product.nama_produk}</td>
                    <td className="px-4 py-3">Rp {Number(product.harga).toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3">{product.aktif ? "Ya" : "Tidak"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="rounded-md bg-rose-500 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
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
