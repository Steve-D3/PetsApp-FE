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

            // Filter out nulls and set the appointments
            const validAppointments = petAppointments.filter(
              Boolean
            ) as (Appointment & { petName: string })[];
            setAppointments(validAppointments);
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
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2 bg-gray-50">
        <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">
          Welcome back, {user?.name}
        </h2>
      </div>

      {/* Hero Image */}
      <div
        className="w-full bg-center bg-no-repeat bg-cover min-h-[218px]"
        style={{
          backgroundImage:
            "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAmg8l2k9pfYd17Zj3FlArUYKAmM-R8oBeT7Pr15GgevI2bV4FGdycODEzAC8OQwnUglP6wmyykrll9JudMS_32zcAzU6_xuQHyI8h1pKzd1n82MS1WlFT_T2ibbrarAHYEWF6Jp8Ho11xGTdsoB9bW-WPVunLH1gVEG0LCnzMc5GAB4GvtZN9sT4oIPtuRzuInuqmZ2SruurKSGbqjD0ydlzf5mFfvBaUXjZOwCVQ8063XatgpdhBJBCK5UgA_GEKRArpqLx4iqvw)",
        }}
      />

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

      {/* Pet Snapshot */}
      <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Pet Snapshot
      </h2>

      <div className="flex overflow-x-auto px-4 pb-4 -mx-4">
        <div className="flex gap-4">
          {pets.map((pet) => (
            <div key={pet.id} className="flex-shrink-0 w-40">
              <div className="flex flex-col gap-2">
                <div
                  className="w-full aspect-square bg-cover bg-center rounded-xl"
                  style={{
                    backgroundImage: `url(https://media.istockphoto.com/id/108271508/photo/young-gray-cat.jpg?s=612x612&w=0&k=20&c=Cnra41iZ85qkZGDJB3cDNQ41BTg0vgl11Mlgu-OpjwM=)`,
                  }}
                />
                <div>
                  <p className="text-[#101518] text-base font-medium leading-normal">
                    {pet.name}
                  </p>
                  <p className="text-[#5c778a] text-sm font-normal leading-normal">
                    {pet.weight} kg
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
