import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const storedUser = localStorage.getItem("user");
  let username = "User";
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      username = parsed.nama || parsed.username || username;
    } catch {
      username = "User";
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        username={username}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
        onLogout={handleLogout}
      />

      <div className="flex flex-col md:flex-row">
        <Sidebar isOpen={sidebarOpen} />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
