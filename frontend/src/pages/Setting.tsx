import { useEffect, useState } from "react";
import { get, put } from "../services/api";

export default function Setting() {
  const [settings, setSettings] = useState({
    nama_steam: "",
    alamat: "",
    no_hp: "",
    footer: "",
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const response = await get<{ nama_steam: string; alamat: string; no_hp: string; footer: string }>("settings");
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Gagal memuat setelan.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);
    setLoading(true);

    try {
      await put("settings", settings);
      setStatusMessage("Setelan berhasil diperbarui.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan setelan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Setelan</h2>
            <p className="text-sm text-slate-500">Atur identitas dan kontak sistem.</p>
          </div>
          {loading && <span className="text-sm text-slate-500">Memuat...</span>}
        </div>

        {statusMessage && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{statusMessage}</div>}
        {errorMessage && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div>}

        <form onSubmit={handleSave} className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Nama Steam</label>
            <input
              value={settings.nama_steam}
              onChange={(e) => handleChange("nama_steam", e.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">No HP</label>
            <input
              value={settings.no_hp}
              onChange={(e) => handleChange("no_hp", e.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Alamat</label>
            <textarea
              value={settings.alamat}
              onChange={(e) => handleChange("alamat", e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Footer</label>
            <textarea
              value={settings.footer}
              onChange={(e) => handleChange("footer", e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Simpan Setelan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
