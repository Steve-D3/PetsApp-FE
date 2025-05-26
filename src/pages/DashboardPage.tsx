// src/pages/DashboardPage.tsx
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import petsApi, {
  type Pet,
  type Appointment,
} from "@/features/pets/api/petsApi";

const DashboardPage = () => {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPetsAndAppointments = async () => {
      try {
        const token = localStorage.getItem("token");

        // Check if user is authenticated
        if (!token) {
          setError("Please log in to view your pets");
          setLoading(false);
          navigate("/login");
          return;
        }

        // Fetch pets
        const petsResponse = await petsApi.getUserPets();
        setPets(petsResponse);

        // Fetch appointments for all pets
        if (petsResponse.length > 0) {
          try {
            // Get current date to filter future appointments
            const now = new Date();

            // Fetch appointments for each pet and get the first upcoming one
            const petAppointments = await Promise.all(
              petsResponse.map(async (pet) => {
                try {
                  const appointments = await petsApi.getPetAppointments(pet.id);

                  // Filter future appointments and sort by date
                  const upcomingAppointments = appointments
                    .filter((appt) => new Date(appt.start_time) > now)
                    .sort(
                      (a, b) =>
                        new Date(a.start_time).getTime() -
                        new Date(b.start_time).getTime()
                    );

                  // Return the first upcoming appointment or null if none
                  return upcomingAppointments.length > 0
                    ? { ...upcomingAppointments[0], petName: pet.name }
                    : null;
                } catch (error) {
                  console.error(
                    `Error fetching appointments for pet ${pet.id}:`,
                    error
                  );
                  return null;
                }
              })
            );

            // Filter out nulls, sort by date, and set the appointments
            const validAppointments = petAppointments.filter(
              Boolean
            ) as (Appointment & { petName: string })[];

            // Sort appointments by start_time in ascending order
            const sortedAppointments = [...validAppointments].sort(
              (a, b) =>
                new Date(a.start_time).getTime() -
                new Date(b.start_time).getTime()
            );

            setAppointments(sortedAppointments);
          } catch (error) {
            console.error("Error processing appointments:", error);
            // Don't fail the whole page if appointments fail
          }
        }

        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("No authentication token")) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("token");
          } else {
            setError(`Failed to fetch data: ${error.message}`);
          }
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPetsAndAppointments();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>{error}</p>
        {error.includes("log in") && (
          <button
            onClick={() => navigate("/login")}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        )}
      </div>
    );
  }

  // Format date to be more readable
  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if the date is today, tomorrow, or another day
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  // Format time range for an appointment
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden rounded-lg mx-auto mt-4 mb-6 shadow-lg">
        {/* Background Image with gradient overlay */}
        <div
          className="w-full h-64 bg-center bg-cover bg-no-repeat relative"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%), " +
              "url(https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80)",
          }}
        >
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-200 max-w-2xl">
              Keep track of your pets' health and upcoming appointments in one
              place.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/appointments")}
                className="px-6 py-2.5 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 hover:text-black transition-colors duration-200"
              >
                Book Appointment
              </button>
              <button
                onClick={() => navigate("/pets")}
                className="px-6 py-2.5 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 hover:text-black transition-colors duration-200"
              >
                View Pets
              </button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3">Upcoming Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No upcoming appointments
          </p>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
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
                      {appt.pet.name}'s Appointment
                    </h4>
                    <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                      {formatAppointmentDate(appt.start_time)}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    <p>With Dr. {appt.veterinarian.clinic.name}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {formatAppointmentTime(appt.start_time, appt.end_time)}
                    </p>
                    {appt.notes && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {appt.notes}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appt.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : appt.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {appt.status.charAt(0).toUpperCase() +
                        appt.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Content */}
      <div className="px-4 pb-6">
        <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
          Featured Content
        </h2>
        <div className="overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-stretch gap-4">
            <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-[160px]">
              <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAst-nLkjO461ZYPR04SG5v3E56qmWTyNDve8NNxoFVVw-6aveFK1GB-erKIBE3qI8_M7KX1LEkkbs8d3Hu_OP7SkIQD0UH-4Ikn1be-YQFx63fK5Ye4lLkbUDoV1yGSmyZ78MAnCXXxZXpPHBmqvT56VtaO3XvpipqW6wBruXfHYGSawK4gFQFMIaPX0PAa-mieWGMk4JrykiNa6p9P5Fkv8aV10v0v7WJ5AE4MzE2Y7Hi5rwBAYIHHb5KFwikGrCVti3HdTOTl3c")',
                }}
              />
              <div>
                <p className="text-[#101518] text-base font-medium leading-normal">
                  Premium Dog Food
                </p>
                <p className="text-[#5c778a] text-sm font-normal leading-normal">
                  Special offer on premium dog food
                </p>
              </div>
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-[160px]">
              <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsXKEtqXe1lj1E9C48-adXqW76S2k-A-bp7vywzhisq_8rr61Iw98x-d3xXRaILuo14KFV08UKCWAoEEnz17fhultNJysvXL095URuj1YFuztldgkB5tJx3FoTrBZIS1kq3-dXITr7rom5tECZ7ILz2i7IvehQx88nSHsuMvSn5OHLfdLc8j1b5vIeP9WPyzCRMseAM_VFNO2FfkdmKWSk5uBEnsuTUo1VZ8QG8W8tK0qIxKehi1X9aqNtsESzgW5YsTlAOvaVujE")',
                }}
              />
              <div>
                <p className="text-[#101518] text-base font-medium leading-normal">
                  Professional Grooming
                </p>
                <p className="text-[#5c778a] text-sm font-normal leading-normal">
                  Book a grooming session today
                </p>
              </div>
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-[160px]">
              <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB23dMXX8cFNLCgW6BgOr6HXO4dMyUDisvXYE9MBYXbswpYLgQzyZRHpZDyTh7fdAyBSAoncoH6DfPYR2z_tLkPukhFVpKEoZ2i6vysL3B_XeMhUueunQMAxC7Gbofy0zQOVq-ZKUbS3uH3_WLyrIdQPTz9OYQ8eGBxOGwOjnn6s2V2wr8qN5MtWrK2Y3brFMIjT8mknynXrYr7EDqSJC17QDzfAxm7JlCy1U4PH_OzkpEmd1nqUWDcJ5uKeeokgYx5-q8CE1a6Yrs")',
                }}
              />
              <div>
                <p className="text-[#101518] text-base font-medium leading-normal">
                  Local Dog Park Event
                </p>
                <p className="text-[#5c778a] text-sm font-normal leading-normal">
                  Join us for a fun day at the park
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
