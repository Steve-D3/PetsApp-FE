// src/pages/ProfilePage.tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Pill, ChevronRight } from 'lucide-react';
import MainLayout from "../components/layout/MainLayout";

// This is a workaround to ensure the ChevronRight icon is properly imported and used

const ProfilePage = () => {
  const navigate = useNavigate();

  // Mock data - this will be replaced with real data later
  const pet = {
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

  return (
    <MainLayout>
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center bg-white p-4 pb-2 justify-between sticky top-0 z-10">
          <button
            onClick={() => navigate(-1)}
            className="text-[#181511] flex size-12 shrink-0 items-center"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="text-[#181511] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            {pet.name}
          </h2>
        </div>

        {/* Profile Section */}
        <div className="flex p-4">
          <div className="flex w-full flex-col gap-4 items-start">
            <div className="flex gap-4 flex-col items-start">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                style={{ backgroundImage: `url(${pet.imageUrl})` }}
              ></div>
              <div className="flex flex-col justify-center">
                <p className="text-[#181511] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                  {pet.name}
                </p>
                <p className="text-[#8a7a60] text-base font-normal leading-normal">
                  {pet.breed} · {pet.gender} · {pet.age}
                </p>
              </div>
            </div>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f5f3f0] text-[#181511] text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] sm:w-auto">
              <span className="truncate">View Profile</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="pb-3">
          <div className="flex border-b border-[#e6e2db] px-4 gap-8">
            <button className="flex flex-col items-center justify-center border-b-[3px] border-b-[#181511] text-[#181511] pb-[13px] pt-4">
              <p className="text-[#181511] text-sm font-bold leading-normal tracking-[0.015em]">
                Medical Records
              </p>
            </button>
            <button className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#8a7a60] pb-[13px] pt-4">
              <p className="text-[#8a7a60] text-sm font-bold leading-normal tracking-[0.015em]">
                Vaccines
              </p>
            </button>
            <button className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#8a7a60] pb-[13px] pt-4">
              <p className="text-[#8a7a60] text-sm font-bold leading-normal tracking-[0.015em]">
                Notes
              </p>
            </button>
          </div>
        </div>

        {/* Last Visit */}
        <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
          <div className="flex flex-col justify-center">
            <p className="text-[#181511] text-base font-medium leading-normal line-clamp-1">
              Last visit
            </p>
            <p className="text-[#8a7a60] text-sm font-normal leading-normal line-clamp-2">
              {pet.lastVisit}
            </p>
          </div>
          <div className="shrink-0">
            <Calendar className="h-6 w-6 text-[#181511]" />
          </div>
        </div>

        {/* Allergies */}
        <h3 className="text-[#181511] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Allergies
        </h3>
        <div className="flex items-center gap-4 bg-white px-4 min-h-14">
          <div className="text-[#181511] flex items-center justify-center rounded-lg bg-[#f5f3f0] shrink-0 size-10">
            <Pill className="h-5 w-5" />
          </div>
          <p className="text-[#181511] text-base font-normal leading-normal flex-1 truncate">
            {pet.allergies}
          </p>
        </div>

        {/* Treatments */}
        <h3 className="text-[#181511] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Treatments
        </h3>
        {pet.treatments.map((treatment, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between"
          >
            <div className="flex flex-col justify-center">
              <p className="text-[#181511] text-base font-medium leading-normal line-clamp-1">
                {treatment.name}
              </p>
              <p className="text-[#8a7a60] text-sm font-normal leading-normal line-clamp-2">
                Next due: {treatment.nextDue}
              </p>
            </div>
            <ChevronRight className="h-6 w-6 text-[#181511]" />
          </div>
        ))}

        {/* Medications */}
        <h3 className="text-[#181511] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Medications
        </h3>
        {pet.medications.map((medication, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between"
          >
            <div className="flex flex-col justify-center">
              <p className="text-[#181511] text-base font-medium leading-normal line-clamp-1">
                {medication.name}
              </p>
              <p className="text-[#8a7a60] text-sm font-normal leading-normal line-clamp-2">
                {medication.dosage}, {medication.frequency}
              </p>
            </div>
            <ChevronRight className="h-6 w-6 text-[#181511]" />
          </div>
        ))}

        <div className="h-5 bg-white"></div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
