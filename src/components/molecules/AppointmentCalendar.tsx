import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState } from "react";

export function AppointmentCalendar() {
  const [selected, setSelected] = useState<Date>();

  return (
    <div className="appointment-calendar flex flex-col items-center">
      <h2>Appointment Calendar</h2>
      <DayPicker
        mode="single"
        className="rdp"
        selected={selected}
        onSelect={setSelected}
      />
    </div>
  );
}
