// src/components/molecules/forms/PetForm.tsx
import { useForm } from "react-hook-form";
// import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Textarea } from "@/components/atoms/Textarea";
import type { PetFormData } from "@/features/pets/types";
import { Button } from "../atoms/Button";

interface PetFormProps {
  onSubmit: (data: PetFormData) => void;
  isSubmitting?: boolean;
  initialData?: Partial<PetFormData>;
  onClose?: () => void;
  isLoading?: boolean;
}

export function PetForm({
  onSubmit,
  onClose,
  isLoading = false,
}: PetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PetFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {...register("sterilized")}
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
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
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
