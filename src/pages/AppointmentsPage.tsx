// src/pages/AppointmentsPage.tsx
import { Calendar, Video, Pill, Syringe } from "lucide-react";
import { TimelineSection } from "@/components/molecules/TimeLineSection";
import { AppointmentCalendar } from "@/components/molecules/AppointmentCalendar";
import { useEffect, useState } from "react";
import petsApi from "@/features/pets/api/petsApi";
import type { Pet } from "@/features/pets/api/petsApi";
import { useNavigate } from "react-router-dom";

// Mock data - replace with API calls in a real app
const mockAppointments = [
  {
    id: "1",
    date: "Dr. Sarah, 2 days ago",
    title: "Vomiting",
    subtitle: "Vomiting",
    icon: <Calendar className="h-6 w-6" />,
    actionIcon: <Video className="h-6 w-6" />,
  },
  {
    id: "2",
    date: "Dr. Sarah, 6 months ago",
    title: "Annual checkup",
    subtitle: "Annual checkup",
    icon: <Calendar className="h-6 w-6" />,
    actionIcon: <Video className="h-6 w-6" />,
  },
];

const mockTreatments = [
  {
    id: "1",
    date: "Dr. Sarah, 3 weeks ago",
    title: "Prescription: Antibiotics",
    subtitle: "Prescription: Antibiotics",
    icon: <Calendar className="h-6 w-6" />,
    actionIcon: <Pill className="h-6 w-6" />,
  },
];

const mockVaccinations = [
  {
    id: "1",
    date: "Dr. Sarah, 1 year ago",
    title: "Vaccination: Canine Influenza - H3N8 & H3N2",
    subtitle: "Vaccination: Canine Influenza - H3N8 & H3N2",
    icon: <Calendar className="h-6 w-6" />,
    actionIcon: <Syringe className="h-6 w-6" />,
  },
];

const mockUpcoming = [
  {
    id: "1",
    date: "Dr. Sarah, 6 months later",
    title: "Annual Checkup",
    subtitle: "Annual Checkup",
    icon: <Calendar className="h-6 w-6" />,
    actionIcon: <Video className="h-6 w-6" />,
  },
];

export const AppointmentsPage = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem("token");

        // Check if user is authenticated
        if (!token) {
          setError("Please log in to view your pets");
          setLoading(false);
          // Optionally redirect to login page
          navigate("/login");
          return;
        }

        const response = await petsApi.getUserPets();
        setPets(response);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("No authentication token")) {
            setError("Session expired. Please log in again.");
            // Optionally clear any invalid token
            localStorage.removeItem("auth_token");
          } else {
            setError(`Failed to fetch pets: ${error.message}`);
          }
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
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
  return (
    <div className="space-y-1">
      <div>
        <h2>My Pets {pets.length}</h2>
        {pets.map((pet) => (
          <div key={pet.id}>
            <h3>{pet.name}</h3>
            <p>Breed: {pet.breed}</p>
            <p>Species: {pet.species}</p>
            {/* Add more pet details as needed */}
          </div>
        ))}
      </div>
      <div className="flex items-center p-4 pb-2 justify-between">
        <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Pet's Timeline
        </h2>
      </div>

      <TimelineSection title="Consultations" items={mockAppointments} />
      <TimelineSection title="Treatments" items={mockTreatments} />
      <TimelineSection title="Vaccinations" items={mockVaccinations} />
      <TimelineSection title="Upcoming Care Dates" items={mockUpcoming} />

      <div className="px-4 py-4 flex justify-center">
        <AppointmentCalendar />
      </div>
    </div>
  );
};

export default AppointmentsPage;
