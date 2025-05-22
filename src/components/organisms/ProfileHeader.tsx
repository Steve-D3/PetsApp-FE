// src/components/organisms/ProfileHeader.tsx
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Text } from "../atoms/Text";
import type { ProfileHeaderProps } from "@/lib/types/types.d";

export const ProfileHeader = ({ title, onBack }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center p-4 md:px-6 md:py-4 justify-between sticky top-0 z-10 bg-white border-b border-gray-100">
      <button
        onClick={handleBack}
        className="text-gray-900 flex size-12 shrink-0 items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      <Text variant="h2" className="flex-1 text-center md:text-left md:pl-4">
        {title}
      </Text>
      <div className="w-12" /> {/* Spacer for alignment */}
    </div>
  );
};
