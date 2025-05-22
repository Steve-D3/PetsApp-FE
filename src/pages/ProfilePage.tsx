import { Calendar, Pill } from "lucide-react";
import { ProfileHeader } from "@/components/organisms/ProfileHeader";
import { InfoCard } from "@/components/molecules/InfoCard";
import { Text } from "@/components/atoms/Text";

// Mock data - this will be replaced with real data later
const MOCK_PET = {
  name: "Benny",
  breed: "Beagle",
  gender: "Male",
  age: "4 years old",
  lastVisit: "Nov 12, 2022",
  imageUrl:
    "https://cdn.usegalileo.ai/sdxl10/6ed83772-fff5-4893-809d-c162203bd78d.png",
  allergies: "None",
  treatments: [
    { name: "Flea and Tick Prevention", nextDue: "Mar 31, 2023" },
    { name: "Heartworm Prevention", nextDue: "Mar 31, 2023" },
  ],
  medications: [
    { name: "Apoquel", dosage: "30mg", frequency: "1 tablet every 12 hours" },
    { name: "Zyrtec", dosage: "10mg", frequency: "1 tablet every 24 hours" },
    {
      name: "Gabapentin",
      dosage: "100mg",
      frequency: "1 capsule every 8 hours",
    },
  ],
};

export const ProfilePage = () => {
  return (
    <div className="bg-white min-h-screen">
      <ProfileHeader title={MOCK_PET.name} />

      <div className="max-w-4xl mx-auto">
        {/* Profile Section - Now in a row on tablet+ */}
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:gap-8">
            {/* Left Column - Profile Info */}
            <div className="w-full md:w-1/3 lg:w-1/4 mb-6 md:mb-0">
              <div className="flex flex-col items-center md:items-start">
                <div
                  className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-cover bg-center mb-4"
                  style={{ backgroundImage: `url(${MOCK_PET.imageUrl})` }}
                />
                <Text variant="h1" className="mb-1 text-center md:text-left">
                  {MOCK_PET.name}
                </Text>
                <Text
                  variant="caption"
                  className="text-gray-600 text-center md:text-left mb-4"
                >
                  {MOCK_PET.breed} · {MOCK_PET.gender} · {MOCK_PET.age}
                </Text>
                <button className="w-full md:w-auto px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="flex-1 space-y-6">
              {/* Last Visit & Allergies in a row on tablet+ */}
              <div className="grid md:grid-cols-2 gap-6">
                <InfoCard
                  title="Last visit"
                  subtitle={MOCK_PET.lastVisit}
                  icon={<Calendar className="h-5 w-5" />}
                />
                <InfoCard
                  title="Allergies"
                  subtitle={MOCK_PET.allergies}
                  icon={<Pill className="h-5 w-5" />}
                />
              </div>

              {/* Treatments */}
              <div>
                <Text variant="h3" className="mb-4">
                  Treatments
                </Text>
                <div className="space-y-3">
                  {MOCK_PET.treatments.map((treatment, index) => (
                    <InfoCard
                      key={index}
                      title={treatment.name}
                      subtitle={`Next due: ${treatment.nextDue}`}
                      className="hover:bg-gray-50"
                    />
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div>
                <Text variant="h3" className="mb-4">
                  Medications
                </Text>
                <div className="space-y-3">
                  {MOCK_PET.medications.map((medication, index) => (
                    <InfoCard
                      key={index}
                      title={medication.name}
                      subtitle={`${medication.dosage}, ${medication.frequency}`}
                      className="hover:bg-gray-50"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
