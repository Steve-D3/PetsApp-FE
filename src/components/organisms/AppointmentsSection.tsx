import { Calendar } from "lucide-react";
import { NoContentMessage } from "../molecules/NoContentMessage";
import type { Appointment } from "@/features/pets/types";

interface AppointmentsSectionProps {
  appointments?: Array<Appointment>;
  onScheduleAppointment: () => void;
  className?: string;
}

export const AppointmentsSection = ({
  appointments = [],
  onScheduleAppointment,
  className = "",
}: AppointmentsSectionProps) => {
  const hasAppointments = appointments.length > 0;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          Upcoming Appointments
        </h3>
      </div>
      <div className="p-4">
        {!hasAppointments ? (
          <NoContentMessage
            icon={<Calendar className="h-10 w-10 mx-auto text-gray-300 mb-2" />}
            title="No upcoming appointments"
            actionText="Schedule Appointment"
            onAction={onScheduleAppointment}
          />
        ) : (
          <div>
            {/* Render appointments list here */}
            <p className="text-center py-4">
              Appointments list will be displayed here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
