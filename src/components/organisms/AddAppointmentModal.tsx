import { useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { useToast } from "@/components/atoms/use-toast";
import petsApi from "@/features/pets/api/petsApi";
import type { Veterinarian, Clinic } from "@/features/pets/api/petsApi";

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
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<string>("");
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVets, setIsLoadingVets] = useState(false);
  // Define the structure of a time slot
  type TimeSlot =
    | {
        time: string;
        formatted: string;
      }
    | string;

  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  useEffect(() => {
    toastRef.current = toast;
  }, [toast, availableSlots]);

  const [formData, setFormData] = useState(() => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 minutes after start time
    console.log("Available slots updated:", availableSlots);

    return {
      pet_id: "",
      veterinarian_id: "1", // Default to first vet for now
      start_time: startTime.toISOString().slice(0, 16),
      end_time: endTime.toISOString().slice(0, 16),
      status: "pending",
      notes: "",
    };
  });

  // Fetch clinics
  const fetchClinics = useCallback(async () => {
    try {
      const clinicsData = await petsApi.getClinics();
      setClinics(clinicsData);

      // Select first clinic by default if available
      if (clinicsData.length > 0) {
        setSelectedClinicId(clinicsData[0].id.toString());
      }

      return clinicsData;
    } catch (error) {
      console.error("Error fetching clinics:", error);
      toastRef.current({
        title: "Error",
        description: "Failed to load clinics. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  }, [toastRef]);

  // Fetch vets based on selected clinic
  const fetchVetsByClinic = useCallback(async (clinicId: string) => {
    if (!clinicId) return;

    try {
      setIsLoadingVets(true);
      // Assuming getVets can accept a clinicId parameter
      const vetsData = await petsApi.getVets();
      // Filter vets by clinic if needed, or modify the API to filter on the server
      const filteredVets = vetsData.filter(
        (vet) => vet.clinic.id.toString() === clinicId
      );
      setVets(filteredVets);

      // Update the form with the first vet if available
      if (filteredVets.length > 0) {
        setFormData((prev) => ({
          ...prev,
          veterinarian_id: filteredVets[0].id.toString(),
        }));
      }
    } catch (error) {
      console.error("Error fetching vets:", error);
      toastRef.current({
        title: "Error",
        description: "Failed to load veterinarians. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingVets(false);
    }
  }, []);

  // Handle clinic selection change
  const handleClinicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clinicId = e.target.value;
    setSelectedClinicId(clinicId);
    setSelectedTimeSlot("");
    setAvailableSlots([]);
    fetchVetsByClinic(clinicId);
  };

  // Handle vet selection change

  // const handleVetSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const vetId = e.target.value;
  //   setFormData((prev) => ({
  //     ...prev,
  //     veterinarian_id: vetId,
  //   }));
  //   // Reset time slot and date when vet changes
  //   setSelectedTimeSlot("");
  //   setAvailableSlots([]);
  //   setSelectedDate("");
  // };

  // Handle date selection change
  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTimeSlot("");

    if (!formData.veterinarian_id) {
      toastRef.current({
        title: "Warning",
        description: "Please select a veterinarian first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoadingSlots(true);
      const slots = await petsApi.getAvailableSlots(
        parseInt(formData.veterinarian_id, 10),
        date
      );

      // Convert string array to TimeSlot objects if needed
      const processedSlots = Array.isArray(slots)
        ? slots
            .map((slot: TimeSlot) => {
              if (typeof slot === "string") {
                return slot;
              } else if (slot && typeof slot === "object" && "time" in slot) {
                return {
                  time: slot.time,
                  formatted: slot.formatted || slot.time,
                };
              }
              console.warn("Invalid time slot format:", slot);
              return null;
            })
            .filter((slot): slot is TimeSlot => slot !== null)
        : [];

      setAvailableSlots(processedSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      toastRef.current({
        title: "Error",
        description: "Failed to load available time slots. Please try again.",
        variant: "destructive",
      });
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Handle time slot selection
  const handleTimeSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slotValue = e.target.value;

    if (!slotValue) {
      setSelectedTimeSlot("");
      setFormData((prev) => ({
        ...prev,
        start_time: "",
        end_time: "",
      }));
      return;
    }

    try {
      // Find the selected slot in availableSlots
      const selectedSlot = availableSlots.find((slot) =>
        typeof slot === "string" ? slot === slotValue : slot.time === slotValue
      );

      if (!selectedSlot) {
        throw new Error("Selected time slot not found");
      }

      let startDateTime: Date;

      // Create a date object from the selected date and time
      if (selectedDate) {
        if (typeof selectedSlot === "string") {
          // Handle string time slots (HH:MM format)
          const [hours, minutes] = selectedSlot.split(":").map(Number);
          startDateTime = new Date(selectedDate);
          startDateTime.setHours(hours, minutes, 0, 0);
        } else {
          // Handle object time slots with time property (HH:MM:SS format)
          const [hours, minutes] = selectedSlot.time.split(":").map(Number);
          startDateTime = new Date(selectedDate);
          startDateTime.setHours(hours, minutes, 0, 0);
        }
      } else {
        throw new Error("No date selected");
      }

      if (isNaN(startDateTime.getTime())) {
        throw new Error("Invalid date/time in selected time slot");
      }

      const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000); // 30 minutes slot

      setFormData((prev) => ({
        ...prev,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
      }));

      setSelectedTimeSlot(slotValue);
    } catch (error) {
      console.error("Error processing selected time slot:", error);
      toast({
        title: "Error",
        description: "Invalid time slot selected. Please try again.",
        variant: "destructive",
      });
      setSelectedTimeSlot("");
    }
  };

  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch pets and clinics in parallel
      const [userPets] = await Promise.all([
        petsApi.getUserPets(),
        fetchClinics(),
      ]);

      setPets(userPets);

      // Set the first pet as default if available
      if (userPets.length > 0) {
        setFormData((prev) => ({
          ...prev,
          pet_id: userPets[0].id.toString(),
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
  }, [fetchClinics]);

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen, fetchInitialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.pet_id ||
      !formData.veterinarian_id ||
      !formData.start_time ||
      !formData.end_time
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Debug: Log the selected veterinarian ID
    console.log("Selected veterinarian ID:", formData.veterinarian_id);

    // Validate veterinarian ID is a positive number
    const vetId = parseInt(formData.veterinarian_id, 10);
    if (isNaN(vetId) || vetId <= 0) {
      toast({
        title: "Error",
        description: "Please select a valid veterinarian",
        variant: "destructive",
      });
      return;
    }

    // Find the selected veterinarian to get their user_id
    const selectedVet = vets.find((vet) => vet.id === vetId);
    if (!selectedVet || !selectedVet.user_id) {
      toast({
        title: "Error",
        description:
          "Selected veterinarian is not valid or missing user information",
        variant: "destructive",
      });
      return;
    }

    // Debug: Log the parsed veterinarian ID and user_id
    console.log("Parsed veterinarian ID:", vetId);
    console.log("Veterinarian user_id:", selectedVet.user_id);

    try {
      setIsLoading(true);

      // Parse the dates
      const startTime = new Date(formData.start_time);
      const endTime = new Date(formData.end_time);

      // Get local hours and minutes for validation
      const localStartHour = startTime.getHours();
      const localStartMinute = startTime.getMinutes();

      // Convert to UTC for API
      const utcStartTime = new Date(
        Date.UTC(
          startTime.getFullYear(),
          startTime.getMonth(),
          startTime.getDate(),
          startTime.getHours(),
          startTime.getMinutes(),
          startTime.getSeconds()
        )
      );

      const utcEndTime = new Date(
        Date.UTC(
          endTime.getFullYear(),
          endTime.getMonth(),
          endTime.getDate(),
          endTime.getHours(),
          endTime.getMinutes(),
          endTime.getSeconds()
        )
      );

      // Validate appointment time is within business hours (09:00-12:00 or 13:00-16:00)
      const isMorningSlot =
        (localStartHour === 9 && localStartMinute >= 0) ||
        localStartHour === 10 ||
        localStartHour === 11 ||
        (localStartHour === 12 && localStartMinute === 0);

      const isAfternoonSlot =
        (localStartHour === 13 && localStartMinute >= 0) ||
        localStartHour === 14 ||
        localStartHour === 15 ||
        (localStartHour === 16 && localStartMinute === 0);

      const isValidTime = isMorningSlot || isAfternoonSlot;

      if (!isValidTime) {
        toast({
          title: "Invalid Appointment Time",
          description: `Selected time: ${localStartHour
            .toString()
            .padStart(2, "0")}:${localStartMinute
            .toString()
            .padStart(
              2,
              "0"
            )}. Appointments must be scheduled between 09:00–12:00 or 13:00–16:00.`,
          variant: "destructive",
          duration: 10000, // Show for 10 seconds
        });
        return;
      }

      // Format the data as expected by the API with UTC times
      const appointmentData = {
        pet_id: parseInt(formData.pet_id, 10),
        veterinarian_id: selectedVet.user_id, // Use the user_id as veterinarian_id for the API
        location_id: selectedVet.clinic?.id,
        start_time: utcStartTime.toISOString(),
        end_time: utcEndTime.toISOString(),
        status: "pending" as const,
        notes: formData.notes || "",
      };

      const response = await petsApi.createAppointment(appointmentData);
      console.log("Appointment created:", response);

      toast({
        title: "Success",
        description: "Appointment created successfully!",
        variant: "success",
      });

      onAppointmentAdded();
      onClose();
    } catch (error: unknown) {
      // Type assertion for Axios error
      const axiosError = error as {
        response?: {
          data: {
            message?: string;
            errors?: Record<string, string | string[]>;
          };
          status: number;
          headers: Record<string, string>;
        };
        message?: string;
      };

      console.error("Error creating appointment:", error);

      // Log the full error response
      if (axiosError.response) {
        console.error("Error response data:", axiosError.response.data);
        console.error("Error response status:", axiosError.response.status);
        console.error("Error response headers:", axiosError.response.headers);

        let errorMessage = "";

        // Show validation errors if they exist
        if (axiosError.response.data.errors) {
          errorMessage = Object.entries(axiosError.response.data.errors)
            .flatMap(([field, messages]) => {
              const messageList = Array.isArray(messages)
                ? messages
                : [messages];
              return messageList.map((msg) => `• ${field}: ${msg}`);
            })
            .join("\n");
        }

        // Add main error message if available
        if (axiosError.response.data.message) {
          errorMessage =
            axiosError.response.data.message +
            (errorMessage ? "\n\n" + errorMessage : "");
        }

        // If we have any error message, show it
        if (errorMessage) {
          toast({
            title: "Error Creating Appointment",
            description: errorMessage,
            variant: "destructive",
            duration: 15000, // Show for 15 seconds
          });
          return;
        }
      }

      // Fallback error message
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

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
      >
        <div className="sticky top-0 bg-white z-10 p-6 pb-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Schedule New Appointment
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Clinic Selection */}
          <div className="space-y-2">
            <label
              htmlFor="clinic"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Clinic *
            </label>
            <select
              id="clinic"
              value={selectedClinicId}
              onChange={handleClinicChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading || clinics.length === 0}
            >
              {isLoading ? (
                <option>Loading clinics...</option>
              ) : clinics.length === 0 ? (
                <option>No clinics available</option>
              ) : (
                clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))
              )}
            </select>
          </div>

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

            <div className="mb-4">
              <label
                htmlFor="veterinarian"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Veterinarian *
              </label>
              <select
                id="veterinarian"
                name="veterinarian_id"
                value={formData.veterinarian_id}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={
                  isLoadingVets || !selectedClinicId || vets.length === 0
                }
                required
              >
                {isLoadingVets ? (
                  <option>Loading veterinarians...</option>
                ) : !selectedClinicId ? (
                  <option>Please select a clinic first</option>
                ) : vets.length === 0 ? (
                  <option>No veterinarians available at this clinic</option>
                ) : (
                  vets.map(
                    (vet) => (
                      console.log(vet),
                      (
                        <option key={vet.user_id} value={vet.user_id}>
                          {vet.user?.name || `Vet #${vet.id}`}
                        </option>
                      )
                    )
                  )
                )}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Date Picker */}
              <div>
                <label
                  htmlFor="appointment-date"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Appointment Date *
                </label>
                <input
                  type="date"
                  id="appointment-date"
                  name="appointment-date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                  disabled={!formData.veterinarian_id || isLoadingSlots}
                  required
                />
              </div>

              {/* Time Slot Selection */}
              <div>
                <label
                  htmlFor="time-slot"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Available Time Slots *
                </label>
                <select
                  id="time-slot"
                  name="time-slot"
                  value={selectedTimeSlot}
                  onChange={handleTimeSlotChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                  disabled={
                    !selectedDate ||
                    availableSlots.length === 0 ||
                    isLoadingSlots
                  }
                  required
                >
                  <option value="">
                    {isLoadingSlots
                      ? "Loading time slots..."
                      : availableSlots.length === 0
                      ? "No available slots. Please select another date."
                      : "Select a time slot"}
                  </option>
                  {availableSlots
                    .map((slot, index) => {
                      try {
                        // Handle both string and object time slots
                        if (typeof slot === "string") {
                          // If it's a string, use it as both value and label
                          return {
                            value: slot,
                            label: slot,
                            key: `slot-${slot}-${index}`,
                          };
                        } else if (
                          slot &&
                          typeof slot === "object" &&
                          "time" in slot
                        ) {
                          // If it's an object with time and formatted properties
                          return {
                            value: slot.time,
                            label: slot.formatted || slot.time,
                            key: `slot-${slot.time}-${index}`,
                          };
                        } else {
                          console.warn("Unexpected time slot format:", slot);
                          return null;
                        }
                      } catch (error) {
                        console.error(
                          "Error processing time slot:",
                          error,
                          "Slot:",
                          slot
                        );
                        return null;
                      }
                    })
                    .filter(
                      (
                        slot
                      ): slot is {
                        value: string;
                        label: string;
                        key: string;
                      } => slot !== null
                    ) // Type guard to filter out nulls
                    .map((slot) => (
                      <option key={slot.key} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Hidden inputs for form submission */}
            <input
              type="hidden"
              name="start_time"
              value={formData.start_time}
            />
            <input type="hidden" name="end_time" value={formData.end_time} />
            <input type="hidden" name="status" value="pending" />

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

            <div className="flex justify-end space-x-3 pt-6">
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
    </div>
  );
};
