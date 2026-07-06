import { useEffect, useRef, useState } from "react";
import { get, post } from "../services/api";
import { getCurrentUser } from "../services/auth";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type AttendanceItem = {
  id: number;
  tanggal: string;
  jam_masuk?: string;
  jam_pulang?: string;
  status: string;
  User?: { nama: string };
};

const defaultColumns = [
  { key: "no", label: "No" },
  { key: "user", label: "Karyawan" },
  { key: "status", label: "Status" },
  { key: "jam_masuk", label: "Jam Masuk" },
  { key: "jam_pulang", label: "Jam Pulang" },
];

export default function Attendance() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceItem[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentUser = getCurrentUser();

  const defaultAttendance: AttendanceItem[] = [];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const fetchTodayAttendance = async () => {
      setAttendanceLoading(true);
      setAttendanceError(null);

      try {
        const response = await get<{ attendances: AttendanceItem[] }>(`attendance?tanggal=${today}`);
        setTodayAttendance(response.data || defaultAttendance);
      } catch (error) {
        setAttendanceError(error instanceof Error ? error.message : "Gagal memuat absensi hari ini.");
        setTodayAttendance(defaultAttendance);
      } finally {
        setAttendanceLoading(false);
      }
    };

    fetchTodayAttendance();
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleGetLocation = () => {
    setErrorMessage(null);
    setStatusMessage("Mengambil lokasi...");

    if (!navigator.geolocation) {
      setErrorMessage("Geolocation tidak didukung oleh browser ini.");
      setStatusMessage(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatusMessage("Lokasi berhasil diambil.");
      },
      (error) => {
        setErrorMessage(`Gagal mengambil lokasi: ${error.message}`);
        setStatusMessage(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleStartCamera = async () => {
    setErrorMessage(null);
    setStatusMessage("Membuka kamera...");

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("Kamera tidak didukung oleh browser ini.");
      setStatusMessage(null);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setStatusMessage("Kamera aktif. Ambil foto untuk absensi.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal membuka kamera.");
      setStatusMessage(null);
    }
  };

  const handleCapturePhoto = () => {
    setErrorMessage(null);
    if (!videoRef.current || !canvasRef.current) {
      setErrorMessage("Kamera belum siap.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setErrorMessage("Tidak dapat mengambil foto.");
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setPhotoDataUrl(dataUrl);
    setStatusMessage("Foto berhasil diambil.");
    stopCamera();
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    setStatusMessage(null);

    if (!currentUser) {
      setErrorMessage("Data pengguna tidak ditemukan. Silakan login ulang.");
      return;
    }

    if (!coordinates) {
      setErrorMessage("Silakan ambil lokasi terlebih dahulu.");
      return;
    }

    if (!photoDataUrl) {
      setErrorMessage("Silakan ambil foto menggunakan kamera terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    try {
      await post("attendance", {
        user_id: currentUser.id,
        tanggal: new Date().toISOString().slice(0, 10),
        jam_masuk: new Date().toISOString(),
        status: "Hadir",
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      setStatusMessage("Absensi berhasil dikirim.");
      setPhotoDataUrl(null);
      setCoordinates(null);
      setTodayAttendance((prev) => [
        ...prev,
        {
          id: Date.now(),
          tanggal: new Date().toISOString().slice(0, 10),
          jam_masuk: new Date().toISOString(),
          status: "Hadir",
          User: { nama: currentUser.nama || currentUser.username || "-" },
        },
      ]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold">Absensi</h2>
          <p className="text-sm text-slate-500">Gunakan kamera dan GPS untuk melakukan absensi.</p>
          <p className="text-lg font-bold">
            {time.toLocaleTimeString("id-ID", {
              timeZone: "Asia/Jakarta",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>

        {statusMessage && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{statusMessage}</div>}
        {errorMessage && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div>}

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-3 text-lg font-semibold">Lokasi</h3>
            <p className="text-sm text-slate-600">Lat: {coordinates ? coordinates.latitude.toFixed(6) : "-"}</p>
            <p className="text-sm text-slate-600">Lng: {coordinates ? coordinates.longitude.toFixed(6) : "-"}</p>
            <button
              type="button"
              onClick={handleGetLocation}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Ambil Lokasi
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-3 text-lg font-semibold">Foto</h3>
            <div className="flex flex-col gap-3">
              {cameraActive ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
                  <video ref={videoRef} className="h-64 w-full object-cover" muted playsInline />
                </div>
              ) : photoDataUrl ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img src={photoDataUrl} alt="Preview foto" className="h-64 w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
                  Kamera belum aktif
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleStartCamera}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Buka Kamera
                </button>
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
                >
                  Ambil Foto
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !coordinates || !photoDataUrl}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Absensi"}
          </button>
          <p className="text-sm text-slate-500">Pastikan lokasi dan foto sudah benar sebelum mengirim.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Absensi Hari Ini</h3>
            <p className="text-sm text-slate-500">Daftar absensi karyawan untuk hari ini.</p>
          </div>
          {attendanceLoading && <span className="text-sm text-slate-500">Memuat...</span>}
        </div>

        {attendanceError && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{attendanceError}</div>}

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 font-semibold text-slate-700">No</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Karyawan</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Jam Masuk</th>
              </tr>
            </thead>
            <tbody>
              {!todayAttendance.length ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                    Belum ada absensi hari ini.
                  </td>
                </tr>
              ) : (
                todayAttendance.map((item, index) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{item.User?.nama || "-"}</td>
                    <td className="px-4 py-3">{item.status || "-"}</td>
                    <td className="px-4 py-3">{item.jam_masuk ? new Date(item.jam_masuk).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

        {statusMessage && <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{statusMessage}</div>}
        {errorMessage && <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div>}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-3 text-lg font-semibold">Lokasi</h3>
            <p className="text-sm text-slate-600">Lat: {coordinates ? coordinates.latitude.toFixed(6) : "-"}</p>
            <p className="text-sm text-slate-600">Lng: {coordinates ? coordinates.longitude.toFixed(6) : "-"}</p>
            <button
              type="button"
              onClick={handleGetLocation}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Ambil Lokasi
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-3 text-lg font-semibold">Foto</h3>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleCaptureClick}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Ambil Foto
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoChange}
              />

              {previewUrl ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img src={previewUrl} alt="Preview foto" className="h-64 w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
                  Foto belum dipilih
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !coordinates || !photoFile}
            className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Absensi"}
          </button>
          <p className="text-sm text-slate-500">
            Pastikan lokasi dan foto sudah benar sebelum mengirim.
          </p>
        </div>
      </div>
    </div>
  );
}
