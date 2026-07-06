import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Attendance from "../pages/Attendance";
import History from "../pages/History";
import Karyawan from "../pages/Karyawan";
import Setting from "../pages/Setting";

export const routes = [
  {
    path: "/",
    title: "Login",
    element: <Login />,
    layout: false,
  },
  {
    path: "/dashboard",
    title: "Dashboard",
    element: <Dashboard />,
    layout: true,
  },
  {
    path: "/attendance",
    title: "Absensi",
    element: <Attendance />,
    layout: true,
  },
  {
    path: "/history",
    title: "Riwayat Absensi",
    element: <History />,
    layout: true,
  },
];