import { useState, useEffect, useRef } from "react";
import {
  X,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Clock3,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { useToast } from "@/components/atoms/use-toast";
import type { Appointment } from "@/features/pets/api/petsApi";
import petsApi from "@/features/pets/api/petsApi";
import { Map } from "@/components/atoms/Map";
import axios, { AxiosError } from "axios";

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string | number | null;
  onAppointmentUpdated?: () => void;
}

export const AppointmentDetailModal = ({
  isOpen,
  onClose,
  appointmentId,
  onAppointmentUpdated,
}: AppointmentDetailModalProps) => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editNotes, setEditNotes] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  // Reset edit mode when appointment changes
  useEffect(() => {
    if (appointment) {
      setEditNotes(appointment.notes || "");
      setIsEditing(false);
    }
  }, [appointment]);

  // Handle keyboard navigation and focus trapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      // Trap focus within modal when open
      if (e.key === "Tab") {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        if (!focusableElements.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Focus the close button when modal opens
      closeButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setAppointment(null);
      setError(null);
      setLoading(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!appointmentId || !isOpen) return;

      setLoading(true);
      setError(null);

      try {
        // Add a delay to help with debugging
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Use the configured API client to ensure proper auth headers and base URL
        const response = await petsApi.getAppointmentById(appointmentId);

        // The API client should already handle the response structure, but let's be defensive
        const responseData = response;

        if (!responseData) {
          throw new Error("No appointment data found in the response");
        }

        const safeGet = <T,>(
          obj: unknown,
          path: string,
          defaultValue: T
        ): T => {
          if (!obj || typeof obj !== "object") return defaultValue;

          const value = path.split(".").reduce<unknown>((o, p) => {
            if (o && typeof o === "object" && p in o) {
              return (o as Record<string, unknown>)[p];
            }
            return undefined;
          }, obj);

          return (value as T) ?? defaultValue;
        };

        // Transform the data to match the expected structure with proper null checks
        const transformedData: Appointment = {
          ...responseData,
          id: responseData.id,
          pet_id: responseData.pet_id,
          veterinarian_id: responseData.veterinarian_id,
          location_id: responseData.location_id,
          start_time: responseData.start_time,
          end_time: responseData.end_time,
          status:
            (responseData.status as "pending" | "confirmed" | "cancelled") ??
            "pending",
          notes: responseData.notes,
          created_at: responseData.created_at,
          updated_at: responseData.updated_at,

          // Pet information with fallbacks
          pet: {
            id: responseData.pet_id,
            photo: responseData.pet.photo,
            microchip_number: responseData.pet.microchip_number,
            sterilized: responseData.pet.sterilized,
            gender: responseData.pet.gender,
            weight: responseData.pet.weight,
            allergies: responseData.pet.allergies,
            food_preferences: responseData.pet.food_preferences,
            owner: responseData.pet.owner,
            name: safeGet<string>(responseData, "pet.name", "Unknown Pet"),
            breed: safeGet<string>(responseData, "pet.breed", "Unknown"),
            species: safeGet<string>(responseData, "pet.species", "Unknown"),
            birth_date:
              safeGet<string>(responseData, "pet.date_of_birth", "") ||
              safeGet<string>(responseData, "pet.birth_date", ""),
          },

          // Veterinarian information with fallbacks
          veterinarian: {
            id: responseData.veterinarian_id,
            user_id: responseData.veterinarian.user_id,
            license_number: responseData.veterinarian.license_number,
            specialty: responseData.veterinarian.specialty,
            biography: responseData.veterinarian.biography,
            phone_number: responseData.veterinarian.phone_number,
            off_days: responseData.veterinarian.off_days,
            clinic: responseData.veterinarian.clinic,

            user: {
              id: responseData.veterinarian.user_id,
              name: responseData.veterinarian.user.name,
              email: responseData.veterinarian.user.email,
              role: responseData.veterinarian.user.role,
              current_team_id: responseData.veterinarian.user.current_team_id,
              profile_photo_path:
                responseData.veterinarian.user.profile_photo_path,
              profile_photo_url:
                responseData.veterinarian.user.profile_photo_url,
            },
          },

          // Location information with fallbacks
        };

        setAppointment(transformedData);
      } catch (error) {
        const err = error as AxiosError | Error;
        console.error("Error fetching appointment details:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load appointment details";
        console.error("Error details:", errorMessage);

        // More specific error message based on the error type
        if (axios.isAxiosError(err)) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error response data:", err.response?.data);
          console.error("Error status:", err.response?.status);
          console.error("Error headers:", err.response?.headers);

          if (err.response?.status === 404) {
            setError(
              "Appointment not found. It may have been cancelled or rescheduled."
            );
          } else if (
            err.response?.status === 401 ||
            err.response?.status === 403
          ) {
            setError("You do not have permission to view this appointment.");
          } else {
            setError(
              `Server error: ${
                err.response?.status || "Unknown"
              }. Please try again later.`
            );
          }
        } else if (err instanceof Error) {
          // The request was made but no response was received
          console.error("Error details:", err);
          setError(`Failed to load appointment: ${errorMessage}`);
        } else {
          // Something unexpected happened
          setError("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId, isOpen]);

  // Format pet's age from date of birth
  const getPetAge = (birthDate?: string) => {
    if (!birthDate) return "Unknown age";

    try {
      const birth = new Date(birthDate);
      const now = new Date();
      let years = now.getFullYear() - birth.getFullYear();
      const months = now.getMonth() - birth.getMonth();

      if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
        years--;
      }

      if (years === 0) {
        const totalMonths =
          (now.getFullYear() - birth.getFullYear()) * 12 +
          (now.getMonth() - birth.getMonth());
        return totalMonths <= 1 ? "1 month old" : `${totalMonths} months old`;
      }

      return years === 1 ? "1 year old" : `${years} years old`;
    } catch (e) {
      console.error("Error calculating pet age:", e);
      return "Unknown age";
    }
  };

  const handleUpdateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment || !appointmentId) return;

    setIsSaving(true);

    try {
      const updatedAppointment = {
        ...appointment,
        notes: editNotes,
      };

      await petsApi.updateAppointment(appointmentId, {
        notes: editNotes,
      });

      setAppointment(updatedAppointment);
      onAppointmentUpdated?.();

      toast({
        title: "Success",
        description: "Appointment updated successfully",
        variant: "success",
      });

      setIsEditing(false);
    } catch (err) {
      console.error("Error updating appointment:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update appointment";

      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!appointmentId) {
      toast({
        title: "Error",
        description: "No appointment selected.",
        variant: "error",
      });
      return;
    }

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment? This action cannot be undone."
    );
    if (!confirmCancel) return;

    setIsCancelling(true);

    try {
      await petsApi.cancelAppointment(appointmentId);

      // Show success message
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully.",
        variant: "success",
      });

      // Update the local state to reflect the cancellation
      if (appointment) {
        setAppointment({
          ...appointment,
          status: "cancelled",
          updated_at: new Date().toISOString(),
        });
      }

      // Notify parent component about the update
      onAppointmentUpdated?.();

      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";

      toast({
        title: "Cancellation Failed",
        description: `Failed to cancel appointment: ${errorMessage}`,
        variant: "error",
        duration: 5000,
      });
    } finally {
      setIsCancelling(false);
    }
  };

  if (!isOpen) return null;

  // Check if the appointment is in the future or today
  const isAppointmentUpcoming = (appointment: Appointment): boolean => {
    if (!appointment?.start_time) return false;

    const appointmentDate = new Date(appointment.start_time);
    const today = new Date();

    // Reset both dates to midnight for accurate date comparison
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);

    // Return true if appointment is today or in the future
    return appointmentDate >= today;
  };

  const getStatusBadge = (status: "pending" | "confirmed" | "cancelled") => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    switch (status) {
      case "confirmed":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </span>
        );
      case "pending":
      default:
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            <Clock3 className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Date not available";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      console.error("Error formatting time:", e);
      return "Time not available";
    }
  };

  const formatDuration = (startTime: string, endTime: string) => {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const diffInMs = end.getTime() - start.getTime();
      const diffInMinutes = Math.round(diffInMs / (1000 * 60));

      if (diffInMinutes < 60) {
        return `${diffInMinutes} min`;
      } else {
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;
        return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`.trim();
      }
    } catch (e) {
      console.error("Error calculating duration:", e);
      return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto outline-none scroll-smooth"
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-details-title"
        tabIndex={-1}
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2
            id="appointment-details-title"
            className="text-xl font-semibold text-gray-900"
          >
            Appointment Details
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md p-1 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-8 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-500"></div>
            <p className="text-gray-600">Loading appointment details...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading appointment
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <RefreshCw className="-ml-0.5 mr-2 h-4 w-4" />
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Details */}
        {!loading && !error && appointment && (
          <div className="p-6 space-y-6">
            {/* Status and Date/Time */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {appointment.pet.name}'s Appointment
                  </h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500">
                      {appointment.pet.breed} • {appointment.pet.species}
                    </p>
                    {appointment.pet.birth_date && (
                      <span className="text-xs text-gray-400">
                        • {getPetAge(appointment.pet.birth_date)}
                      </span>
                    )}
                  </div>
                </div>
                {getStatusBadge(appointment.status)}
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-sm text-gray-900">
                      {formatDate(appointment.start_time)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-sm font-medium text-gray-500">Time</p>
                      <span className="text-xs text-gray-400">
                        (
                        {formatDuration(
                          appointment.start_time,
                          appointment.end_time
                        )}
                        )
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {formatTime(appointment.start_time)} -{" "}
                      {formatTime(appointment.end_time)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Veterinarian Information */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Veterinarian
              </h3>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Dr. {appointment.veterinarian.user.name}
                  </p>
                  {appointment.veterinarian.specialty && (
                    <p className="text-sm text-gray-500">
                      {appointment.veterinarian.specialty}
                    </p>
                  )}
                  <div className="mt-1 space-y-1">
                    {appointment.veterinarian.clinic.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        <a
                          href={`tel:${appointment.veterinarian.clinic.phone}`}
                          className="hover:text-blue-600"
                        >
                          {appointment.veterinarian.clinic.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                      <a
                        href={`mailto:${appointment.veterinarian.user.email}`}
                        className="hover:text-blue-600"
                      >
                        {appointment.veterinarian.user.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Location
              </h3>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {appointment.veterinarian.clinic.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {appointment.veterinarian.clinic.address}
                    <br />
                    {appointment.veterinarian.clinic.city},{" "}
                    {appointment.veterinarian.clinic.postal_code}
                    <br />
                    {appointment.veterinarian.clinic.country}
                  </p>
                  {appointment.veterinarian.clinic.phone && (
                    <div className="mt-1 flex items-center text-sm text-gray-600">
                      <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                      <a
                        href={`tel:${appointment.veterinarian.clinic.phone}`}
                        className="hover:text-blue-600"
                      >
                        {appointment.veterinarian.clinic.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {/* Map Placeholder - You can integrate with Google Maps or Mapbox here */}
              <div className="mt-3 w-full">
                <div className="relative w-full" style={{ height: "300px" }}>
                  <Map
                    address={`${appointment.veterinarian.clinic.address}, ${appointment.veterinarian.clinic.postal_code} ${appointment.veterinarian.clinic.city}, ${appointment.veterinarian.clinic.country}`}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            {isEditing ? (
              <form onSubmit={handleUpdateAppointment} className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Notes</h3>
                  </div>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Add any notes about the appointment..."
                  />
                  <div className="mt-3 flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Notes
                  </h3>
                  {appointment.notes && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                </div>
                {appointment.notes ? (
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {appointment.notes}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add notes
                  </button>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex justify-end space-x-3">
              {appointment.status === "pending" &&
                isAppointmentUpcoming(appointment) && (
                  <>
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      onClick={() => setIsEditing(true)}
                      disabled={isEditing}
                    >
                      Edit Appointment
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                      onClick={handleCancelAppointment}
                      disabled={isCancelling}
                    >
                      {isCancelling ? "Cancelling..." : "Cancel Appointment"}
                    </Button>
                  </>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailModal;
