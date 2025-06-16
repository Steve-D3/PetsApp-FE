import type { Appointment } from "@/features/pets/api/petsApi";

interface AppointmentCardProps {
  appointment: Appointment & { petName: string };
  onViewDetails?: () => void;
}

export const AppointmentCard = ({
  appointment,
  onViewDetails,
}: AppointmentCardProps) => {
  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  const formatAppointmentTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return `${start.toLocaleTimeString(
      undefined,
      timeOptions
    )} - ${end.toLocaleTimeString(undefined, timeOptions)}`;
  };

  return (
    <div
      className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onViewDetails}
    >
      <div className="w-12 h-12 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center mr-3">
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-gray-900 truncate">
            {appointment.petName}'s Appointment
          </h4>
          <span className="text-sm text-gray-500 ml-2 whitespace-nowrap">
            {formatAppointmentDate(appointment.start_time)}
          </span>
        </div>
        <div className="mt-1 text-sm text-gray-600">
          <p>
            With Dr. {appointment.veterinarian?.clinic?.name || "Veterinarian"}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {formatAppointmentTime(
              appointment.start_time,
              appointment.end_time
            )}
          </p>
          {appointment.notes && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {appointment.notes}
            </p>
          )}
        </div>
        <div className="mt-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              appointment.status === "pending"
                ? "bg-blue-100 text-blue-800"
                : appointment.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};
