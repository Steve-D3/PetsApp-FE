import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { useToast } from "@/components/atoms/use-toast";
import petsApi from "@/features/pets/api/petsApi";

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
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    pet_id: "",
    veterinarian_id: "1", // Default to first vet for now
    start_time: new Date().toISOString().slice(0, 16), // Current date and time
    status: "pending",
    notes: "",
  });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setIsLoading(true);
        const userPets = await petsApi.getUserPets();
        setPets(userPets);

        // Set the first pet as default if available
        if (userPets.length > 0) {
          setFormData((prev) => ({
            ...prev,
            pet_id: userPets[0].id.toString(),
          }));
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
        toast({
          title: "Error",
          description: "Failed to load pets. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchPets();
    }
  }, [isOpen, toast]);

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

          <div>
            <label
              htmlFor="start_time"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Date & Time
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
