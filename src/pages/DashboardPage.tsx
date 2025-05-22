import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../features/auth/hooks/useAuth";
import {
  Calendar,
  BarChart,
  Users,
  PawPrint,
  Bell,
  Search,
} from "lucide-react";

const DashboardPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Mock data
  const stats = [
    { name: "Total Pets", value: "24", change: "+2.5%", icon: PawPrint },
    { name: "Active Clients", value: "1,234", change: "+14%", icon: Users },
    { name: "Appointments", value: "48", change: "-3%", icon: Calendar },
    { name: "Revenue", value: "$12,345", change: "+8.2%", icon: BarChart },
  ];

  const recentAppointments = [
    {
      id: 1,
      name: "Max",
      time: "10:00 AM",
      type: "Checkup",
      status: "Confirmed",
    },
    {
      id: 2,
      name: "Bella",
      time: "11:30 AM",
      type: "Grooming",
      status: "Pending",
    },
    {
      id: 3,
      name: "Charlie",
      time: "2:15 PM",
      type: "Vaccination",
      status: "Confirmed",
    },
  ];

  return (
    <div className=" max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
            <Bell className="h-6 w-6" />
          </button>
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p
                  className={`text-sm mt-1 ${
                    stat.change.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stat.change} from last month
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Recent Appointments</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  <PawPrint className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{appointment.name}</h3>
                  <p className="text-sm text-gray-500">{appointment.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{appointment.time}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                <PawPrint className="h-5 w-5 mr-2" />
                Add New Pet
              </button>
              <button className="w-full flex items-center p-3 rounded-lg bg-green-50 text-green-600 hover:bg-green-100">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Appointment
              </button>
              <button className="w-full flex items-center p-3 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100">
                <Users className="h-5 w-5 mr-2" />
                Add New Client
              </button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-4 py-1">
                  <p className="font-medium">Annual Checkup</p>
                  <p className="text-sm text-gray-500">Today, 2:00 PM</p>
                  <p className="text-sm text-gray-500">Dr. Smith</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
