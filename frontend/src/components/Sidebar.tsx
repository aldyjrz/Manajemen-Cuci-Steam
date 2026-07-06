import { Link } from "react-router-dom";
import logo from "../assets/react.svg";

type SidebarProps = {
  isOpen: boolean;
};

export default function Sidebar({ isOpen }: SidebarProps) {
  const menus = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
    },
      {
      name: "Data Karyawan",
      path: "/karyawan",
      icon: "👤",
    },
    {
      name: "Kasir",
      path: "/kasir",
      icon: "💳",
    },
    {
      name: "Master Produk",
      path: "/products",
      icon: "🛒",
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: "📍",
    },
    {
      name: "Riwayat Absensi",
      path: "/history",
      icon: "📋",
    },
    {
      name: "Setelan",
      path: "/setting",
      icon: "👤",
    },
  ];

  return (
    <aside className={`bg-slate-900 text-white transition-all duration-300 ${isOpen ? 'block w-full md:block md:w-56' : 'hidden md:block md:w-16'} md:min-h-screen`}>
       

      <ul className="p-3">
        {menus.map((menu) => (
          <li key={menu.path}>
            <Link
              to={menu.path}
              className="flex items-center gap-3 px-4 py-3 rounded hover:bg-slate-800"
            >
              <span className="text-lg">{menu.icon}</span>
              <span className={`${isOpen ? 'block' : 'hidden'} text-sm`}>{menu.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}