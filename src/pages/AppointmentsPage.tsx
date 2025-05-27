import { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Loader2,
  ClockAlert,
  Syringe,
  NotebookPenIcon,
} from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import type { EventClickArg, EventContentArg } from "@fullcalendar/core";
import { format } from "date-fns";
import { TimelineSection } from "@/components/molecules/TimeLineSection";
import { Button } from "@/components/atoms/Button";
import { AddAppointmentModal } from "@/components/organisms/AddAppointmentModal";
import petsApi from "@/features/pets/api/petsApi";
import { useToast } from "@/components/atoms/use-toast";

// Helper function to map appointment status to event type and color
const getAppointmentDetails = (
  status: string
): {
  type: "completed" | "confirmed" | "cancelled" | "pending";
  color: string;
} => {
  const statusLower = status.toLowerCase();
  if (statusLower === "completed")
    return { type: "completed", color: "#10B981" };
  if (statusLower === "scheduled" || statusLower === "confirmed")
    return { type: "confirmed", color: "#3B82F6" };
  if (statusLower === "cancelled")
    return { type: "cancelled", color: "#EF4444" };
  return { type: "pending", color: "#6B7280" };
};

interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string;
  extendedProps: {
    type: "completed" | "confirmed" | "cancelled" | "pending";
    doctor: string;
    status: string;
    petName: string;
  };
  backgroundColor?: string;
  borderColor?: string;
}

// Format events for the timeline sections
const formatEventsForTimeline = (events: CalendarEvent[], type: string) => {
  return events
    .filter((event) => event.extendedProps.type === type)
    .map((event) => ({
      id: event.id,
      date: format(new Date(event.start), "MMM d, yyyy"),
      title: event.title,
      subtitle: event.extendedProps.doctor,
      icon:
        type === "completed" ? (
          <CalendarIcon className="h-5 w-5 text-green-500" />
        ) : type === "confirmed" ? (
          <CalendarIcon className="h-5 w-5 text-blue-500" />
        ) : type === "pending" ? (
          <ClockAlert className="h-5 w-5 text-yellow-500" />
        ) : (
          <Syringe className="h-5 w-5 text-red-500" />
        ),
      actionIcon: <NotebookPenIcon className="h-5 w-5 text-gray-500" />,
    }));
};

export const AppointmentsPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const calendarRef = useRef<FullCalendar | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserPetsAndAppointments = async () => {
      try {
        setLoading(true);

        // First, get all the user's pets
        const userPets = await petsApi.getUserPets();

        if (userPets.length === 0) {
          setEvents([]);
          return;
        }

        // Get all appointments for each pet
        const petAppointmentsPromises = userPets.map((pet) =>
          petsApi.getPetAppointments(pet.id)
        );

        const appointmentsResults = await Promise.all(petAppointmentsPromises);

        // Flatten the array of arrays into a single array of appointments
        const allAppointments = appointmentsResults.flat();

        const formattedEvents = allAppointments.map((appointment) => {
          const { type, color } = getAppointmentDetails(appointment.status);
          // Find the pet details for this appointment
          const pet = userPets.find((p) => p.id === appointment.pet_id);

          return {
            id: appointment.id.toString(),
            title: `Appointment for ${pet?.name || "Pet"}`,
            start: appointment.start_time,
            end: appointment.end_time,
            extendedProps: {
              type,
              doctor: `Dr. Vet ${appointment.veterinarian_id || ""}`,
              status: appointment.status,
              petName: pet?.name || "Pet",
            },
            backgroundColor: color,
            borderColor: color,
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPetsAndAppointments();
  }, []);

  const handleAppointmentAdded = async () => {
    try {
      setLoading(true);
      // Refresh the appointments list
      const userPets = await petsApi.getUserPets();
      if (userPets.length === 0) {
        setEvents([]);
        return;
      }

      // Get all appointments for each pet
      const petAppointmentsPromises = userPets.map((pet) =>
        petsApi.getPetAppointments(pet.id)
      );

      const appointmentsResults = await Promise.all(petAppointmentsPromises);
      const allAppointments = appointmentsResults.flat();

      const formattedEvents = allAppointments.map((appointment) => {
        const { type, color } = getAppointmentDetails(appointment.status);
        const pet = userPets.find((p) => p.id === appointment.pet_id);

        return {
          id: appointment.id.toString(),
          title: `Appointment for ${pet?.name || "Pet"}`,
          start: appointment.start_time,
          end: appointment.end_time,
          extendedProps: {
            type,
            doctor: `Dr. Vet ${appointment.veterinarian_id || ""}`,
            status: appointment.status,
            petName: pet?.name || "Pet",
          },
          backgroundColor: color,
          borderColor: color,
        };
      });

      setEvents(formattedEvents);

      toast({
        title: "Success",
        description: "Appointment created successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error refreshing appointments:", error);
      toast({
        title: "Error",
        description: "Failed to refresh appointments. Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleDateClick = (arg: DateClickArg) => {
    // Handle date click (e.g., open modal to add new event)
    console.log("Date clicked:", arg.date);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    // Handle event click (e.g., open event details)
    console.log("Event clicked:", clickInfo.event.title);
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const { extendedProps } = eventInfo.event;
    return (
      <div className="p-1 text-xs">
        <div className="font-medium truncate">{extendedProps.petName}</div>
        <div className="text-gray-600 truncate">{eventInfo.event.title}</div>
        <div className="text-gray-500 text-xxs">
          {format(new Date(eventInfo.event.start as Date), "h:mm a")} •{" "}
          {extendedProps.doctor}
        </div>
      </div>
    );
  };

  // Filter events for timeline sections
  const upcomingAppointments = events.filter(
    (event) => new Date(event.start as Date) > new Date()
  );
  const recentConsultations = events.filter(
    (event) =>
      event.extendedProps.type === "completed" &&
      new Date(event.start as Date) <= new Date()
  );
  const recentVaccinations = events.filter(
    (event) =>
      event.extendedProps.type === "confirmed" &&
      new Date(event.start as Date) <= new Date()
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500">Manage and schedule appointments</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Appointment
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height={600}
          nowIndicator={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          eventClassNames={["cursor-pointer"]}
          eventContent={renderEventContent}
        />
      </div>

      <AddAppointmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAppointmentAdded={handleAppointmentAdded}
      />

      {/* Timeline Sections */}
      <div className="space-y-4">
        {upcomingAppointments.length > 0 && (
          <TimelineSection
            title="Confirmed Appointments"
            items={formatEventsForTimeline(
              upcomingAppointments,
              upcomingAppointments[0].extendedProps.type
            )}
            className="bg-white rounded-xl shadow-sm p-4"
          />
        )}

        {upcomingAppointments.length > 0 && (
          <TimelineSection
            title="Pending Appointments"
            items={formatEventsForTimeline(
              upcomingAppointments,
              upcomingAppointments[3].extendedProps.type
            )}
            className="bg-white rounded-xl shadow-sm p-4"
          />
        )}

        {upcomingAppointments.length > 0 && (
          <TimelineSection
            title="Cancelled Appointments"
            items={formatEventsForTimeline(
              upcomingAppointments,
              upcomingAppointments[2].extendedProps.type
            )}
            className="bg-white rounded-xl shadow-sm p-4"
          />
        )}

        {recentConsultations.length > 0 && (
          <TimelineSection
            title="Recent Consultations"
            items={formatEventsForTimeline(recentConsultations, "completed")}
            className="bg-white rounded-xl shadow-sm p-4"
          />
        )}

        {recentVaccinations.length > 0 && (
          <TimelineSection
            title="Vaccination History"
            items={formatEventsForTimeline(recentVaccinations, "confirmed")}
            className="bg-white rounded-xl shadow-sm p-4"
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
