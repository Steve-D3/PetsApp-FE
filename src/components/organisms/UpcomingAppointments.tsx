import type { Appointment } from "@/features/pets/api/petsApi";
import { AppointmentCard } from "../molecules/AppointmentCard";

interface UpcomingAppointmentsProps {
  appointments: (Appointment & { petName: string })[];
  onAppointmentClick?: (appointmentId: string) => void;
  className?: string;
}

export const UpcomingAppointments = ({
  appointments,
  onAppointmentClick,
  className = "",
}: UpcomingAppointmentsProps) => {
  if (appointments.length === 0) {
    return (
      <div className={`p-4 bg-white rounded-lg shadow-sm ${className}`}>
        <h3 className="text-lg font-semibold mb-3">Upcoming Appointments</h3>
        <p className="text-gray-500 text-center py-4">
          No upcoming appointments
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold mb-3">Upcoming Appointments</h3>
      <div className="space-y-3">
        {appointments.map((appt) => (
          <AppointmentCard
            key={appt.id}
            appointment={appt}
            onViewDetails={
              onAppointmentClick
                ? () => onAppointmentClick(appt.id.toString())
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};
