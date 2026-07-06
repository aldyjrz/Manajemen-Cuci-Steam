import { useState } from "react";

type NavbarProps = {
  username: string;
  onToggleSidebar: () => void;
  onLogout: () => void;
};

export default function Navbar({ username, onToggleSidebar, onLogout }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const initials = username
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <nav className="bg-slate-800   px-4 md:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        <h1 className="text-sm font-medium text-white">
          Sistem Absensi
        </h1>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen((open) => !open)}
          className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm hover:bg-slate-50 focus:outline-none"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          <span className="hidden sm:inline text-slate-700">{username}</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
            {initials}
          </div>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-200 bg-white shadow-lg">
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                onLogout();
              }}
              className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}