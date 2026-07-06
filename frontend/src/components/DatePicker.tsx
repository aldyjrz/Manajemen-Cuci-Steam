import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

type DatePickerProps = {
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function DatePicker({
  id,
  value,
  onChange,
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <CalendarDaysIcon
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
        onClick={() => inputRef.current?.showPicker()}
      />

      <input
        ref={inputRef}
        id={id}
        onFocus={() => inputRef.current?.showPicker()}
        type="date"
        value={value}
        onChange={onChange}
        className="pl-10 rounded-md border px-3 py-2"
      />
    </div>
  );
}