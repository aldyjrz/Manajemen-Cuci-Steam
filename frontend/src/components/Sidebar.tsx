import { Link, useLocation } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

type SidebarProps = {
  isOpen: boolean;
};

export default function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation(); // Opsional: Untuk menandai menu yang sedang aktif
  const currentUser = getCurrentUser();
  const userRole = currentUser?.role; // Mengambil role user saat ini (misal: "Admin", "Kasir", "Karyawan")

  const menus = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
      roles: ["Admin", "Kasir"],
    },
    {
      name: "Data Karyawan",
      path: "/karyawan",
      icon: "👤",
      roles: ["Admin"], // Hanya Admin
    },
    {
      name: "Kasir",
      path: "/kasir",
      icon: "💳",
      roles: ["Admin", "Kasir"], // Admin dan Kasir
    },
    {
      name: "Master Produk",
      path: "/products",
      icon: "🛒",
      roles: ["Admin"], // Hanya Admin
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: "📍",
      roles: ["Admin", "Karyawan"], // Admin dan Karyawan biasa
    },
    {
      name: "Riwayat Absensi",
      path: "/history",
      icon: "📋",
      roles: ["Admin", "Kasir"],
    },
    {
      name: "Setelan",
      path: "/setting",
      icon: "⚙️", // Mengubah ikon agar tidak kembar dengan Karyawan
      roles: ["Admin"],
    },
  ];

  // Filter menu berdasarkan role user yang sedang login
  const filteredMenus = menus.filter((menu) => menu.roles.includes(userRole || ""));

  return (
    <aside className={`bg-slate-900 text-white transition-all duration-300 ${isOpen ? 'block w-full md:block md:w-56' : 'hidden md:block md:w-16'} md:min-h-screen`}>
      <ul className="p-3 space-y-1">
        {filteredMenus.map((menu) => {
          // Cek apakah menu ini sedang aktif di browser
          const isActive = location.pathname === menu.path;

          return (
            <li key={menu.path}>
              <Link
                to={menu.path}
                className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                  isActive 
                    ? "bg-blue-600 text-white font-medium" 
                    : "hover:bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <span className="text-lg">{menu.icon}</span>
                <span className={`${isOpen ? 'block' : 'md:hidden'} text-sm whitespace-nowrap`}>
                  {menu.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
