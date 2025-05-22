// src/pages/DashboardPage.tsx
import {
  Bell,
  Search,
  HeartPulse,
  Calendar,
  PawPrint,
  Clock,
  Plus,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";

const DashboardPage = () => {
  const { user } = useAuth();

  // Mock data - replace with real API calls
  const petStats = [
    {
      name: "Total Pets",
      value: "3",
      icon: <PawPrint className="h-6 w-6" />,
      change: "+1 from last month",
      trend: "up",
    },
    {
      name: "Upcoming Appointments",
      value: "2",
      icon: <Calendar className="h-6 w-6" />,
      change: "Next: Tomorrow, 10:00 AM",
      trend: "neutral",
    },
    {
      name: "Medications Due",
      value: "1",
      icon: <HeartPulse className="h-6 w-6" />,
      change: "Flea treatment due in 3 days",
      trend: "warning",
    },
    {
      name: "Vaccinations",
      value: "1",
      icon: <HeartPulse className="h-6 w-6" />,
      change: "Annual checkup in 2 weeks",
      trend: "warning",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      pet: "Max",
      type: "Appointment",
      description: "Annual checkup completed",
      time: "2 hours ago",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      id: 2,
      pet: "Bella",
      type: "Medication",
      description: "Flea treatment given",
      time: "Yesterday",
      icon: <HeartPulse className="h-5 w-5" />,
    },
    {
      id: 3,
      pet: "Charlie",
      type: "Vaccination",
      description: "Rabies vaccine due soon",
      time: "3 days ago",
      icon: <HeartPulse className="h-5 w-5" />,
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      pet: "Max",
      date: "Tomorrow",
      time: "10:00 AM",
      type: "Annual Checkup",
      vet: "Dr. Smith",
    },
    {
      id: 2,
      pet: "Bella",
      date: "May 30, 2025",
      time: "2:30 PM",
      type: "Dental Cleaning",
      vet: "Dr. Johnson",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name || "Pet Parent"}!
          </p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search pets, vets, appointments..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {petStats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center rounded-lg bg-blue-50 p-3 text-blue-600">
                {stat.icon}
              </div>
              <span
                className={`text-sm font-medium ${
                  stat.trend === "up"
                    ? "text-green-600"
                    : stat.trend === "warning"
                    ? "text-amber-600"
                    : "text-gray-500"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-gray-900">
              {stat.value}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{stat.name}</p>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <Card className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-center rounded-lg bg-gray-100 p-2 text-gray-600">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        {activity.pet}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Upcoming Appointments
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <Card className="p-6">
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-center rounded-lg bg-blue-50 p-2 text-blue-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        {appointment.pet}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {appointment.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {appointment.vet} • {appointment.date}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Appointment
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
