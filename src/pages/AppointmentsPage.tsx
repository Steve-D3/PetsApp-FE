import { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Loader2,
  Clock,
  User,
  ClockAlert,
  NotebookPenIcon,
  TimerOffIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  EventContentArg,
  EventApi,
  EventClickArg,
} from "@fullcalendar/core";
import type {
  DateClickArg,
} from "@fullcalendar/interaction";
import { format, addDays, isSameDay } from "date-fns";
import { TimelineSection } from "@/components/molecules/TimeLineSection";
import { Button } from "@/components/atoms/Button";
import { AddAppointmentModal } from "@/components/organisms/AddAppointmentModal";
import petsApi from "@/features/pets/api/petsApi";
import { useToast } from "@/components/atoms/use-toast";
// Simple dialog component since @/components/ui/dialog is not available
const Dialog = ({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

interface DialogProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

const DialogContent = ({ children, className, ...props }: DialogProps) => (
  <div className={`p-6 ${className || ""}`} {...props}>
    {children}
  </div>
);

const DialogHeader = ({ children, className, ...props }: DialogProps) => (
  <div
    className={`border-b border-gray-200 p-4 relative ${className || ""}`}
    {...props}
  >
    {children}
  </div>
);

const DialogTitle = ({ children, className, ...props }: DialogProps) => (
  <h3
    className={`text-lg font-semibold text-gray-900 ${className || ""}`}
    {...props}
  >
    {children}
  </h3>
);

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
          <TimerOffIcon className="h-5 w-5 text-red-500" />
        ),
      actionIcon: <NotebookPenIcon className="h-5 w-5 text-gray-500" />,
    }));
};

export const AppointmentsPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>(
    []
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const calendarRef = useRef<FullCalendar>(null);
  const { toast } = useToast();

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);

      // Update calendar view if needed
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        const currentView = calendarApi.view.type;
        if (mobile && currentView === "timeGridWeek") {
          calendarApi.changeView("timeGridDay");
        } else if (!mobile && currentView === "timeGridDay") {
          calendarApi.changeView("dayGridMonth");
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    const clickedDate = arg.date;
    setSelectedDate(clickedDate);

    // Filter events for the clicked date
    const eventsForDate = events.filter((event) => {
      if (!event.start) return false;
      const eventDate =
        typeof event.start === "string" ? new Date(event.start) : event.start;
      return isSameDay(eventDate, clickedDate);
    });

    setSelectedDateEvents(eventsForDate);
    setIsDayModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const eventDate = event.start
      ? new Date(event.start.toString())
      : new Date();
    setSelectedDate(eventDate);

    // Show just this event in the modal
    const eventType = event.extendedProps?.type as
      | "completed"
      | "confirmed"
      | "cancelled"
      | "pending"
      | undefined;
    setSelectedDateEvents([
      {
        id: event.id,
        title: event.title,
        start: event.start ? new Date(event.start.toString()) : new Date(),
        end: event.end ? new Date(event.end.toString()) : undefined,
        extendedProps: {
          type: eventType || "confirmed",
          doctor: event.extendedProps?.doctor || "",
          status: event.extendedProps?.status || "scheduled",
          petName: event.extendedProps?.petName || "Unknown Pet",
        },
        backgroundColor: event.backgroundColor as string | undefined,
        borderColor: event.borderColor as string | undefined,
      },
    ]);

    setIsDayModalOpen(true);
  };

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = addDays(selectedDate, direction === "prev" ? -1 : 1);
    setSelectedDate(newDate);

    const eventsOnDate = events.filter((event) => {
      const eventDate = new Date(event.start as string);
      return isSameDay(eventDate, newDate);
    });

    setSelectedDateEvents(eventsOnDate);
  };

  // Custom event content to show only the first event and a more link
  interface ExtendedProps {
    isAdditional?: boolean;
    type?: string;
    doctor?: string;
    status?: string;
    petName?: string;
  }

  const renderEventContent = (eventInfo: EventContentArg) => {
    const start = eventInfo.event.start
      ? new Date(eventInfo.event.start.toString())
      : null;

    const extendedProps = eventInfo.event.extendedProps as ExtendedProps;

    // Only show the first event in the cell
    if (extendedProps.isAdditional) {
      return null; // Don't render additional events
    }

    return (
      <div className="p-1">
        <div className="text-xs font-medium truncate">
          {start && format(start, "h:mm a")} {eventInfo.event.title}
        </div>
      </div>
    );
  };

  // Define event class names based on event type
  const getEventClassNames = (event: EventApi) => {
    const type = event.extendedProps?.type;
    const baseClasses = [
      "cursor-pointer",
      "border-l-4",
      "py-1",
      "px-2",
      "text-xs",
      "rounded-r",
      "my-0.5",
      "overflow-hidden",
      "transition-all",
      "duration-150",
      "ease-in-out",
      "hover:shadow-sm",
      "h-16", // Fixed height for all events
      "flex",
      "items-center",
    ];

    switch (type) {
      case "completed":
        return [
          ...baseClasses,
          "border-green-500",
          "bg-green-50",
          "hover:bg-green-100",
        ];
      case "confirmed":
        return [
          ...baseClasses,
          "border-blue-500",
          "bg-blue-50",
          "hover:bg-blue-100",
        ];
      case "cancelled":
        return [
          ...baseClasses,
          "border-red-500",
          "bg-red-50",
          "hover:bg-red-100",
          "line-through",
        ];
      case "pending":
        return [
          ...baseClasses,
          "border-yellow-500",
          "bg-yellow-50",
          "hover:bg-yellow-100",
        ];
      default:
        return baseClasses;
    }
  };

  // Filter events for timeline sections
  const upcomingAppointments = events.filter(
    (event) => new Date(event.start as string) > new Date()
  );

  const recentVaccinations = events.filter(
    (event) =>
      event.extendedProps.type === "confirmed" &&
      new Date(event.start as string) <= new Date()
  );

  // Function to render event details in the day modal
  const renderEventDetails = (event: CalendarEvent) => {
    const start = event.start ? new Date(event.start as string) : null;
    const end = event.end ? new Date(event.end as string) : null;

    const statusColors = {
      completed: "bg-green-100 text-green-800 border-green-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    } as const;

    const statusColor =
      statusColors[event.extendedProps.type] ||
      "bg-gray-100 text-gray-800 border-gray-200";

    return (
      <div
        key={event.id}
        className="border-b border-gray-100 py-3 last:border-0"
      >
        <div className="flex items-start">
          <div
            className={`w-2 h-2 rounded-full mt-1.5 mr-2 ${statusColor.replace(
              "bg-",
              "bg-opacity-70 "
            )}`}
          ></div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-900">{event.title}</h4>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${statusColor} border`}
              >
                {event.extendedProps.status.charAt(0).toUpperCase() +
                  event.extendedProps.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-0.5">
              {event.extendedProps.petName}
            </p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              {start ? format(start, "h:mm a") : ""}
              {end && ` - ${format(end, "h:mm a")}`}
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <User className="h-3.5 w-3.5 mr-1.5" />
              {event.extendedProps.doctor}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
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

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Calendar */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-4 h-full">
              <div className="relative h-full">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView={isMobile ? "timeGridDay" : "dayGridMonth"}
                  headerToolbar={{
                    left: isMobile ? "prev,next" : "prev,next today",
                    center: "title",
                    right: isMobile
                      ? "dayGridMonth,timeGridDay"
                      : "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  events={events}
                  eventClick={handleEventClick}
                  dateClick={handleDateClick}
                  aspectRatio={1.5}
                  nowIndicator={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={1} // Only show one event per day
                  firstDay={1}
                  weekNumberCalculation="ISO"
                  eventContent={renderEventContent}
                  eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    meridiem: "short",
                  }}
                  slotMinTime="08:00:00"
                  slotMaxTime="20:00:00"
                  allDaySlot={false}
                  moreLinkContent={(args) => `+${args.num} more`}
                  stickyHeaderDates={true}
                  expandRows={true}
                  dayMaxEventRows={1}
                  eventClassNames={(arg) => getEventClassNames(arg.event)}
                  dayHeaderClassNames="text-gray-600 font-medium text-sm uppercase tracking-wider"
                  dayHeaderFormat={{
                    weekday: isMobile ? "narrow" : "long"
                  }}
                  dayHeaderContent={(arg) => {
                    const dayName = arg.date.toLocaleDateString(undefined, { weekday: 'long' });
                    return {
                      html: isMobile ? dayName.substring(0, 3) : dayName
                    };
                  }}
                  views={{
                    dayGridMonth: {
                      dayMaxEventRows: 3,
                      dayMaxEvents: 3,
                      titleFormat: { year: "numeric", month: "long" },
                    },
                    timeGridWeek: {
                      dayMaxEventRows: 6,
                      titleFormat: {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    },
                    timeGridDay: {
                      dayMaxEventRows: 6,
                      titleFormat: {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Timeline Sections */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-4 space-y-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                {upcomingAppointments.length > 0 && (
                  <div className="md:col-span-2 lg:col-span-1">
                    <TimelineSection
                      title="Confirmed Appointments"
                      items={formatEventsForTimeline(
                        upcomingAppointments,
                        "confirmed"
                      )}
                      className="bg-white rounded-xl shadow-sm p-4 h-full"
                    />
                  </div>
                )}

                {upcomingAppointments.length > 0 && (
                  <div className="md:col-span-1 lg:col-span-1">
                    <TimelineSection
                      title="Pending Appointments"
                      items={formatEventsForTimeline(
                        upcomingAppointments,
                        "pending"
                      )}
                      className="bg-white rounded-xl shadow-sm p-4 h-full"
                    />
                  </div>
                )}

                {upcomingAppointments.length > 0 && (
                  <div className="md:col-span-1 lg:col-span-1">
                    <TimelineSection
                      title="Cancelled Appointments"
                      items={formatEventsForTimeline(
                        upcomingAppointments,
                        "cancelled"
                      )}
                      className="bg-white rounded-xl shadow-sm p-4 h-full"
                    />
                  </div>
                )}

                {recentVaccinations.length > 0 && (
                  <div className="md:col-span-2 lg:col-span-1">
                    <TimelineSection
                      title="Vaccination History"
                      items={formatEventsForTimeline(
                        recentVaccinations,
                        "confirmed"
                      )}
                      className="bg-white rounded-xl shadow-sm p-4 h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day View Modal */}
      <Dialog open={isDayModalOpen} onOpenChange={setIsDayModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDay("prev")}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-center">
                {format(selectedDate, "MMMM d, yyyy")}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDay("next")}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="mt-4">
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-2">
                {selectedDateEvents.map((event, index) => (
                  <div key={`${event.id}-${index}`}>
                    {renderEventDetails(event)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No appointments scheduled for this day
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AddAppointmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAppointmentAdded={handleAppointmentAdded}
      />
    </div>
  );
};

export default AppointmentsPage;
