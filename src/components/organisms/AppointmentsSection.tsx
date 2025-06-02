import { useNavigate } from "react-router-dom";
import { Button } from "@/components/atoms/Button";
import { Plus } from "lucide-react";

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  doctor: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface AppointmentsSectionProps {
  appointments: Appointment[];
  onViewAll?: () => void;
  onAddAppointment?: () => void;
  className?: string;
}

export const AppointmentsSection = ({
  appointments = [],
  onViewAll,
  onAddAppointment,
  className = "",
}: AppointmentsSectionProps) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate("/appointments");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddAppointment}
            className="text-blue-600 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
          <button
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={handleViewAll}
          >
            View All
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {appointments.length > 0 ? (
          appointments.slice(0, 3).map((appointment) => (
            <div key={appointment.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                  <p className="text-sm text-gray-500">
                    {appointment.date} • {appointment.time}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Dr. {appointment.doctor}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500">No upcoming appointments</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={onAddAppointment}
            >
              <Plus className="h-4 w-4 mr-1" />
              Schedule Appointment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsSection;
