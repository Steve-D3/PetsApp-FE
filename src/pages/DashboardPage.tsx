import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import petsApi, { type Appointment } from "@/features/pets/api/petsApi";
import { LoadingSpinner, ErrorDisplay } from "@/components/atoms";
import { DashboardLayout } from "@/components/templates";
import {
  HeroBanner,
  UpcomingAppointments,
  FeaturedContent,
} from "@/components/organisms";

const DashboardPage = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  // We don't need to store pets in state since we're only using it for fetching appointments
  const [appointments, setAppointments] = useState<
    (Appointment & { petName: string })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle authentication and data fetching
  useEffect(() => {
    // If still loading auth state, do nothing
    if (isAuthLoading) return;
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    // If we get here, we're authenticated and can fetch data

    const fetchPetsAndAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if we have a token
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        // Fetch pets and their appointments
        const petsResponse = await petsApi.getUserPets();

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
        console.log(localStorage.getItem("token"));
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
        setIsLoading(false);
      }
    };

    fetchPetsAndAppointments();
  }, [isAuthenticated, isAuthLoading, navigate]);

  const handleAppointmentClick = () => {
    navigate(`/appointments`);
  };

  const handleFeaturedItemClick = (itemId: string) => {
    // Handle featured item click (e.g., navigate to a specific page or show a modal)
    // we will change this into websites links
    console.log(`Featured item ${itemId} clicked`);
  };

  // Show loading state while checking authentication or loading data
  if (isLoading || isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorDisplay
          error={error}
          showLoginButton={error.toLowerCase().includes("log in") || error.toLowerCase().includes("session")}
        />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <HeroBanner userName={user?.name || "there"} />

      <div className="px-4 space-y-6">
        <UpcomingAppointments
          appointments={appointments}
          onAppointmentClick={handleAppointmentClick}
          className="bg-white rounded-xl shadow-sm p-4"
        />

        <FeaturedContent
          onItemClick={handleFeaturedItemClick}
          className="mt-6"
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
