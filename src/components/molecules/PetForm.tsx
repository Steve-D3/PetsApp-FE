import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Textarea } from "@/components/atoms/Textarea";
import { FileInput } from "@/components/atoms/FileInput";
import type { PetFormData } from "@/features/pets/types";
import { Button } from "../atoms/Button";

interface PetFormProps {
  onSubmit: (data: PetFormData) => void;
  isSubmitting?: boolean;
  initialData?: Partial<PetFormData>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function PetForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData = {},
}: PetFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Handle both string URLs and File objects for the preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    typeof initialData.photo === 'string' ? initialData.photo : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PetFormData>({
    defaultValues: {
      ...initialData,
      sterilized: initialData.sterilized ?? 0, // Ensure it's a number (0 or 1)
    },
  });

  // Watch the sterilized field to handle UI updates
  const sterilizedValue = watch('sterilized');

  const previousInitialData = useRef<Partial<PetFormData> | undefined>(
    undefined
  );

  // Reset form when initialData changes
  useEffect(() => {
    // Only reset if initialData exists and is different from previous
    if (
      initialData &&
      JSON.stringify(initialData) !==
        JSON.stringify(previousInitialData.current)
    ) {
      reset(initialData, {
        keepDefaultValues: true,
      });
      previousInitialData.current = initialData;
    }
  }, [reset, initialData]);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        // Set the photo field with the base64 string
        setValue("photo", base64String, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
      // When clearing the file, set photo to null or empty string based on your API requirements
      setValue("photo", null, { shouldValidate: true });
    }
  };

  const handleFormSubmit = (data: PetFormData) => {
    // Prepare the form data with proper types
    const formData: PetFormData = {
      ...data,
      // Ensure weight is a number
      weight: data.weight || 0,
      // Ensure required fields have values
      user_id: initialData.user_id || data.user_id,
      name: data.name.trim(),
      species: data.species.trim(),
      gender: data.gender as "Male" | "Female",
      // Include the photo from preview URL if no new file was selected
      // Ensure we only include the photo if it's a string (URL or base64)
      photo: typeof previewUrl === 'string' ? previewUrl : 
             typeof data.photo === 'string' ? data.photo : null,
    };

    // If there's a selected file, we should handle the file upload here
    // and then call onSubmit with the response URL
    if (selectedFile) {
      // In a real app, you would upload the file to your server here
      // and get back a URL, then include that URL in the form data
      // For now, we're just using the base64 data URL
      formData.photo = previewUrl || "";
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Photo Upload */}
      <div className="space-y-4">
        <FileInput
          label="Pet Photo"
          id="pet-photo"
          onFileSelect={handleFileChange}
          previewUrl={previewUrl}
          inputSize="lg"
          className="flex flex-col items-center"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Pet Name *"
          {...register("name", { required: "Name is required" })}
          error={errors.name?.message}
        />

        <Select
          label="Species *"
          {...register("species", { required: "Species is required" })}
          error={errors.species?.message}
        >
          <option value="">Select species</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Bird">Bird</option>
          <option value="Other">Other</option>
        </Select>

        <Input
          label="Breed"
          {...register("breed")}
          error={errors.breed?.message}
        />

        <Select
          label="Gender *"
          {...register("gender", { required: "Gender is required" })}
          error={errors.gender?.message}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </Select>

        <Input
          label="Birth Date"
          type="date"
          {...register("birth_date")}
          error={errors.birth_date?.message}
        />

        <Input
          label="Weight (kg)"
          type="number"
          step="0.1"
          {...register("weight")}
          error={errors.weight?.message}
        />

        <Input
          label="Microchip Number"
          {...register("microchip_number")}
          error={errors.microchip_number?.message}
        />

        <div className="flex items-center space-x-2 pt-6">
          <input
            type="checkbox"
            id="sterilized"
            checked={!!sterilizedValue}
            onChange={(e) => setValue('sterilized', e.target.checked ? 1 : 0, { shouldDirty: true })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="sterilized" className="text-sm text-gray-700">
            Sterilized
          </label>
        </div>
      </div>

      <Textarea
        label="Allergies"
        {...register("allergies")}
        error={errors.allergies?.message}
        rows={2}
      />

      <Textarea
        label="Food Preferences"
        {...register("food_preferences")}
        error={errors.food_preferences?.message}
        rows={2}
      />

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isLoading}>
          Save Pet
        </Button>
      </div>
    </form>
  );
}
