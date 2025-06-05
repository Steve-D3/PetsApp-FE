import type { ReactNode } from "react";

// Re-export types that might be used elsewhere
export * from "./index";

export interface TreatmentItem {
  id: number;
  medical_record_id: number;
  name: string;
  category: string;
  description?: string;
  notes?: string;
  cost: string;
  quantity: string;
  unit: string;
  completed: boolean;
  administered_at: string;
  administered_by: number;
  treatment_type_id: number;
  vet: string;
  icon: ReactNode;
  nextDue?: string; // For backward compatibility with TreatmentCard
}

export interface TreatmentCardProps {
  id?: string | number;
  name: string;
  category?: string;
  description?: string;
  administered_at: string;
  icon: ReactNode;
  onEdit?: (id: string | number) => void;
  className?: string;
}

export interface TreatmentsSectionProps {
  treatments: TreatmentItem[];
  onViewAll?: () => void;
  onEditTreatment?: never; // Marked as never to ensure it's not used
  onDeleteTreatment?: never; // Marked as never to ensure it's not used
  isLoading?: boolean;
  className?: string;
}
