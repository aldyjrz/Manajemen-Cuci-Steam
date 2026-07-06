import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { get, post, put, del } from "../services/api";

const columns = [
  { key: "id", label: "ID" },
  { key: "nama", label: "Nama" },
  { key: "username", label: "Username" },
  { key: "role", label: "Role" },
  { key: "no_hp", label: "No HP" },
  { key: "aktif", label: "Aktif" },
];

export default function Karyawan() {
  const [users, setUsers] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    nama: "",
    username: "",
    password: "",
    role: "Karyawan",
    no_hp: "",
    alamat: "",
  });
  const [selectedUser, setSelectedUser] = useState<Record<string, any> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await get<any[]>("users");
      setUsers(response.data || []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengambil data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const payload: Record<string, any> = {
        nama: form.nama,
        username: form.username,
        role: form.role,
        no_hp: form.no_hp,
        alamat: form.alamat,
      };

      if (form.password) {
        payload.password = form.password;
      }

      if (selectedUser) {
        await put(`users/${selectedUser.id}`, payload);
        setStatusMessage("Data karyawan berhasil diperbarui.");
      } else {
        await post("users", payload);
        setStatusMessage("Pengguna berhasil dibuat.");
      }

      setForm({ nama: "", username: "", password: "", role: "Karyawan", no_hp: "", alamat: "" });
      setSelectedUser(null);
      setIsModalOpen(false);
      await fetchUsers();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan data pengguna.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus pengguna ini?")) return;
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      await del(`users/${id}`);
      setStatusMessage("Pengguna berhasil dihapus.");
      await fetchUsers();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus pengguna.");
    }
  };

  const handleEdit = (user: Record<string, any>) => {
    setSelectedUser(user);
    setForm({
      nama: user.nama || "",
      username: user.username || "",
      password: "",
      role: user.role || "Karyawan",
      no_hp: user.no_hp || "",
      alamat: user.alamat || "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Data Karyawan</h2>
            <p className="text-sm text-slate-500">Kelola daftar karyawan dan pengguna.</p>
          </div>
          {loading && <span className="text-sm text-slate-500">Memuat...</span>}
        </div>

        {statusMessage && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{statusMessage}</div>}
        {errorMessage && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div>}

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Daftar Karyawan</h3>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Tambah Karyawan
            </button>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <DataTable
              columns={[...columns, { key: "actions", label: "Aksi" }]}
              data={users.map((user) => ({
                ...user,
                aktif: user.aktif ? "Ya" : "Tidak",
                actions: (
                  <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(user)}
                    className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(user.id)}
                    className="rounded-md bg-rose-500 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-600"
                  >
                    Hapus
                  </button>
                </div>
                ),
              }))}
            />
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser ? "Edit Karyawan" : "Tambah Karyawan"}</h3>
                  <p className="text-sm text-slate-500">{selectedUser ? "Perbarui data karyawan." : "Masukkan data pegawai baru di sini."}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-500 transition hover:text-slate-900"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">Nama</label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) => handleChange("nama", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Username</label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2"
                    placeholder={selectedUser ? "Kosongkan jika tidak ingin mengganti" : undefined}
                    required={!selectedUser}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Kasir">Kasir</option>
                    <option value="Karyawan">Karyawan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">No HP</label>
                  <input
                    type="text"
                    value={form.no_hp}
                    onChange={(e) => handleChange("no_hp", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">Alamat</label>
                  <textarea
                    value={form.alamat}
                    onChange={(e) => handleChange("alamat", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
