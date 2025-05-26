import { useNavigate } from "react-router-dom";

interface HeroBannerProps {
  userName: string;
  className?: string;
}

export const HeroBanner = ({ userName, className = "" }: HeroBannerProps) => {
  const navigate = useNavigate();
  const firstName = userName?.split(" ")[0] || "there";

  return (
    <div className={`relative w-full overflow-hidden rounded-lg mx-auto mt-4 mb-6 shadow-lg ${className}`}>
      <div
        className="w-full h-64 bg-center bg-cover bg-no-repeat relative"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%), " +
            "url(https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80)",
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {firstName}!
          </h1>
          <p className="text-lg md:text-xl mb-6 text-gray-200 max-w-2xl">
            Keep track of your pets' health and upcoming appointments in one
            place.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/appointments")}
              className="px-6 py-2.5 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 hover:text-black transition-colors duration-200"
            >
              Book Appointment
            </button>
            <button
              onClick={() => navigate("/pets")}
              className="px-6 py-2.5 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 hover:text-black transition-colors duration-200"
            >
              View Pets
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>
    </div>
  );
};
