import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Attendance from '../pages/Attendance';
import History from '../pages/History';
import Karyawan from '../pages/Karyawan';
import Kasir from '../pages/Kasir';
import Setting from '../pages/Setting';
import AppLayout from '../components/AppLayout';
import TitleManager from '../components/TitleManager';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <>
      <TitleManager />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/history" element={<History />} />
            <Route path="/karyawan" element={<Karyawan />} />
            <Route path="/kasir" element={<Kasir />} />
            <Route path="/setting" element={<Setting />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
