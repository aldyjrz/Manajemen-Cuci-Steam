import DataTable from "../components/DataTable";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import DatePicker from "../components/DatePicker";
import { useState } from "react";
 export default function History() {
    const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
   const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const [loading, setLoading] = useState<string | null>(null);     
  const columns = [
    {
      key: "tanggal",
      label: "Tanggal",
    },
    {
      key: "jamMasuk",
      label: "Jam Masuk",
    },
    {
      key: "status",
      label: "Status",
    },
  ];

  const data = [
    {
      tanggal: "17-06-2026",
      jamMasuk: "08:00",
      status: "Hadir",
    },
  ];
  

  
  const handleFilter = async () => {
    setLoading("Filtering...");
    setStatusMessage(null);

    if (!data) {
      setErrorMessage("No data available.");
      return;
    } 
  
    setLoading("Filter");
  
    try {
      const formData = new FormData();
      formData.append("date-start", startDate);
      formData.append("date-end", endDate);
      
      const response = await fetch("/api/history/get-data", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to filter data.");
      }

      setStatusMessage("Data successfully filtered.");
     
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An error occurred while filtering.");
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
            <div>
        {statusMessage && <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{statusMessage}</div>}
        {errorMessage && <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div>}

              <label htmlFor="email" className="flex text-sm/6 font-medium text-black-500">
                Filter by date
              </label>
        <div className="flex gap-2 items-end">
  <div className="relative">
    <DatePicker
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

  </div>

  <div className="relative">
   
      <DatePicker
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
  </div>

  <button
     onClick={handleFilter}
    disabled={loading}
    type="submit"
    className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
  >
    Filter
  </button>
</div>
            

    <DataTable
      columns={columns}
      data={data}
    />
    </div>
  );
}