// src/pages/AppointmentsPage.tsx
import { Calendar, Video, Pill, Syringe } from "lucide-react";
import { TimelineSection } from "@/components/molecules/TimeLineSection";

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
  return (
    <div className="space-y-1">
      <div className="flex items-center p-4 pb-2 justify-between">
        <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Pet's Timeline
        </h2>
      </div>

      <TimelineSection title="Consultations" items={mockAppointments} />
      <TimelineSection title="Treatments" items={mockTreatments} />
      <TimelineSection title="Vaccinations" items={mockVaccinations} />
      <TimelineSection title="Upcoming Care Dates" items={mockUpcoming} />
    </div>
  );
};

export default AppointmentsPage;
