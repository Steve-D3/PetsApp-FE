// src/pages/DashboardPage.tsx
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import petsApi from "@/features/pets/api/petsApi";
import type { Pet } from "@/features/pets/api/petsApi";

interface Appointment {
  id: string;
  date: string;
  doctor: string;
  type: string;
  image: string;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Debug: Log user data to console
  useEffect(() => {
    console.log("Pets data:", pets);
    console.log("User data:", user);
  }, [user, pets]);

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

  // Mock data - replace with real API calls
  const appointments: Appointment[] = [
    {
      id: "1",
      date: "Tomorrow",
      doctor: "Dr. Harper",
      type: "Vet Appointment",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCEAhqHTC8AWrKe6dKoc7Jd1HNstupYJlmL21C1HDf9BFRJ56F5Pd1FJFY4vtY0T_x9i-kQmsfEbEkFimF6laMTyQzzDNh2f6dqrgVhHp1e-A12lviHFxBDFgyW0cwi_6qC5Bjl0sVdxB4vVCxenD0o1NoqCpLOj1EHpYLDrf-qew124QI6ZqgBXMt872e3nd8B2c2LUvHKzknEro3KmSVxPiqr6HEUlTuzSAQsEro2xWTvfvTMDoYafDd4CEjxwGJ71H8vSZVxMf4",
    },
    {
      id: "2",
      date: "Today",
      doctor: "Max's Antibiotics",
      type: "Medication Reminder",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCGSEPW485WJ1N_rNBO1Bqc6VSPdTrmoSNDnL_MR0Q9eIRTjI-gzOTTjVIrTfFFsa135ip9Y5dSdXjkmibZXUND_9e1bpa2Yv-QsaMzmMfJUXuPb88ahMsbYdF1GsSnUfW8g1t9tEmqWcM81nWrtiQTbboU2WsjGkE0pZ3L_NKDvpChCkHj7wuvBUp96S9b_kGUea2DvV4GCx5VvXdynFaHB31s9Gj5UZxxmVQh59x0E8OuiOGU0iRUSGa7CPKmcGbhLX_EIfsaeE0",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2 bg-gray-50">
        <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">
          Welcome back, {user?.data?.name}
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
      <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Upcoming Appointments
      </h2>

      {appointments.map((appt) => (
        <div key={appt.id} className="px-4 py-2">
          <div className="flex items-stretch justify-between gap-4 rounded-xl bg-white p-4 shadow">
            <div className="flex flex-col gap-1 flex-[2_2_0px]">
              <p className="text-[#5c778a] text-sm font-normal leading-normal">
                {appt.date}
              </p>
              <p className="text-[#101518] text-base font-bold leading-tight">
                {appt.doctor}
              </p>
              <p className="text-[#5c778a] text-sm font-normal leading-normal">
                {appt.type}
              </p>
            </div>
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1"
              style={{ backgroundImage: `url(${appt.image})` }}
            />
          </div>
        </div>
      ))}

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
