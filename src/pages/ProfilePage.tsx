// src/pages/ProfilePage.tsx
import { useNavigate } from "react-router-dom";
import { Calendar, Pill } from "lucide-react";
import { MainLayout } from "@/components/templates/MainLayout";
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
    <MainLayout>
      <div className="bg-white min-h-screen">
        <ProfileHeader title={MOCK_PET.name} />

        {/* Profile Section */}
        <div className="p-4">
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-32 h-32 rounded-full bg-cover bg-center mb-4"
              style={{ backgroundImage: `url(${MOCK_PET.imageUrl})` }}
            />
            <Text variant="h1" className="mb-1">
              {MOCK_PET.name}
            </Text>
            <Text variant="caption" className="text-gray-600">
              {MOCK_PET.breed} · {MOCK_PET.gender} · {MOCK_PET.age}
            </Text>
          </div>

          {/* Last Visit */}
          <InfoCard
            title="Last visit"
            subtitle={MOCK_PET.lastVisit}
            icon={<Calendar className="h-5 w-5" />}
            className="mb-6"
          />

          {/* Allergies */}
          <div className="mb-6">
            <Text variant="h3" className="mb-2 px-4">
              Allergies
            </Text>
            <InfoCard
              title="Allergies"
              subtitle={MOCK_PET.allergies}
              icon={<Pill className="h-5 w-5" />}
            />
          </div>

          {/* Treatments */}
          <div className="mb-6">
            <Text variant="h3" className="mb-2 px-4">
              Treatments
            </Text>
            <div className="space-y-2">
              {MOCK_PET.treatments.map((treatment, index) => (
                <InfoCard
                  key={index}
                  title={treatment.name}
                  subtitle={`Next due: ${treatment.nextDue}`}
                />
              ))}
            </div>
          </div>

          {/* Medications */}
          <div className="mb-6">
            <Text variant="h3" className="mb-2 px-4">
              Medications
            </Text>
            <div className="space-y-2">
              {MOCK_PET.medications.map((medication, index) => (
                <InfoCard
                  key={index}
                  title={medication.name}
                  subtitle={`${medication.dosage}, ${medication.frequency}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
