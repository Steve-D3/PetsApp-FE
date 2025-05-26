import { Calendar, Pencil, Pill, PawPrint, Syringe } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import petsApi, { type Pet } from "@/features/pets/api/petsApi";

// Mock data - this will be replaced with real data later
const MOCK_PET = {
  name: "Benny",
  breed: "Beagle",
  species: "Dog",
  gender: "Male",
  age: "4 years old",
  weight: "12 kg",
  lastVisit: "Nov 12, 2022",
  imageUrl:
    "https://cdn.usegalileo.ai/sdxl10/6ed83772-fff5-4893-809d-c162203bd78d.png",
  allergies: "None",
  treatments: [
    {
      id: "1",
      name: "Flea and Tick Prevention",
      nextDue: "Mar 31, 2023",
      icon: <PawPrint className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "2",
      name: "Heartworm Prevention",
      nextDue: "Mar 31, 2023",
      icon: <PawPrint className="h-5 w-5 text-green-500" />,
    },
  ],
  medications: [
    {
      id: "1",
      name: "Apoquel",
      dosage: "30mg",
      frequency: "1 tablet every 12 hours",
      icon: <Pill className="h-5 w-5 text-purple-500" />,
    },
    {
      id: "2",
      name: "Zyrtec",
      dosage: "10mg",
      frequency: "1 tablet every 24 hours",
      icon: <Pill className="h-5 w-5 text-purple-500" />,
    },
  ],
};

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const token = localStorage.getItem("token");

        // Check if user is authenticated
        if (!token) {
          setError("Please log in to view your pets");
          setLoading(false);
          navigate("/login");
          return;
        }

        console.log(petId);
        const response = await petsApi.getPetById(Number(petId));
        setPet(response);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("No authentication token")) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("auth_token");
          } else {
            setError(`Failed to fetch pet: ${error.message}`);
          }
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [navigate, petId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md mx-4 my-6">
        <p>{error}</p>
        {error.includes("log in") && (
          <button
            onClick={() => navigate("/login")}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Log In
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 text-center">
                <div
                  className="w-32 h-32 mx-auto rounded-full bg-cover bg-center mb-4 border-4 border-white shadow-md"
                  style={{ backgroundImage: `url(${pet?.photo})` }}
                />
                <h2 className="text-xl font-bold text-gray-900">{pet?.name}</h2>
                <p className="text-gray-600">
                  {pet?.breed} - {pet?.gender}
                </p>
                <p className="text-sm text-gray-500 mt-1">{pet?.birth_date}</p>
              </div>
              <div className="border-t border-gray-100 p-4">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <PawPrint className="h-4 w-4 mr-2 text-blue-500" />
                  View Health Records
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Weight</span>
                  <span className="font-medium">{pet?.weight} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Food Preferences</span>
                  <span className="font-medium">
                    {pet?.food_preferences || "None"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Allergies</span>
                  <span className="font-medium text-red-500">
                    {pet?.allergies || "None"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upcoming Appointments
                </h3>
              </div>
              <div className="p-4">
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                  <p>No upcoming appointments</p>
                  <Button
                    className="mt-4"
                    onClick={() => navigate("/appointments/new")}
                  >
                    Schedule Appointment
                  </Button>
                </div>
              </div>
            </div>

            {/* Treatments */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Treatments
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {MOCK_PET.treatments.map((treatment) => (
                  <div
                    key={treatment.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-50 p-2 rounded-lg mr-3">
                        {treatment.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {treatment.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Next due: {treatment.nextDue}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Medications
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {MOCK_PET.medications.map((medication) => (
                  <div
                    key={medication.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="bg-purple-50 p-2 rounded-lg mr-3">
                        {medication.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {medication.name}{" "}
                          <span className="text-sm text-gray-500">
                            ({medication.dosage})
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          {medication.frequency}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vaccinations */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Vaccinations
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {MOCK_PET.medications.map((medication) => (
                  <div
                    key={medication.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="bg-purple-50 p-2 rounded-lg mr-3">
                        <Syringe className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {medication.name}{" "}
                          <span className="text-sm text-gray-500">
                            ({medication.dosage})
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          {medication.frequency}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
