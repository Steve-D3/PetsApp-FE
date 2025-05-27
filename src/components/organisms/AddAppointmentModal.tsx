import { useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { useToast } from "@/components/atoms/use-toast";
import petsApi from "@/features/pets/api/petsApi";

// Type for the vet data from the API
type Vet = {
  id: number;
  user_id: number;
  license_number: string;
  specialty: string;
  biography: string;
  phone_number: string;
  off_days: string[];
};

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentAdded: () => void;
}

interface Pet {
  id: number;
  name: string;
}

export const AddAppointmentModal = ({
  isOpen,
  onClose,
  onAppointmentAdded,
}: AddAppointmentModalProps) => {
  const { toast } = useToast();
  const toastRef = useRef(toast);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<Vet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Update the ref when toast changes
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);
  const [formData, setFormData] = useState(() => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 minutes after start time

    return {
      pet_id: "",
      veterinarian_id: "1", // Default to first vet for now
      start_time: startTime.toISOString().slice(0, 16),
      end_time: endTime.toISOString().slice(0, 16),
      status: "pending",
      notes: "",
    };
  });

  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch pets
      const userPets = await petsApi.getUserPets();
      setPets(userPets);

      // Fetch vets
      const vetsData = await petsApi.getVets();
      setVets(vetsData);

      // Set the first pet and vet as default if available
      if (userPets.length > 0) {
        setFormData(prev => ({
          ...prev,
          pet_id: userPets[0].id.toString(),
          veterinarian_id: vetsData[0]?.id.toString() || "1",
        }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toastRef.current({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen, fetchInitialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.pet_id) {
      toast({
        title: "Error",
        description: "Please select a pet",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      await petsApi.createAppointment({
        ...formData,
        pet_id: parseInt(formData.pet_id, 10),
        veterinarian_id: parseInt(formData.veterinarian_id, 10),
        start_time: formData.start_time,
        end_time: formData.end_time,
        status: formData.status,
        notes: formData.notes,
      });

      toast({
        title: "Success",
        description: "Appointment created successfully!",
        variant: "success",
      });

      onAppointmentAdded();
      onClose();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Error",
        description: "Failed to create appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // If start_time is being updated, update end_time to be 30 minutes after
      if (name === "start_time" && value) {
        const startTime = new Date(value);
        const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
        return {
          ...prev,
          start_time: value,
          end_time: endTime.toISOString().slice(0, 16),
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-xl font-semibold">Add New Appointment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="pet_id"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Pet
            </label>
            <select
              id="pet_id"
              name="pet_id"
              value={formData.pet_id}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading || pets.length === 0}
              required
            >
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="start_time"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Start Time
              </label>
              <input
                type="datetime-local"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="veterinarian_id"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Veterinarian
              </label>
              <select
                id="veterinarian_id"
                name="veterinarian_id"
                value={formData.veterinarian_id}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoading || vets.length === 0}
                required
              >
                {vets.map((vet) => (
                  <option key={vet.id} value={vet.id}>
                    Vet #{vet.id} ({vet.specialty})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || pets.length === 0}>
              {isLoading ? "Creating..." : "Create Appointment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
