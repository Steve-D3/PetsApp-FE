// src/components/organisms/ProfileHeader.tsx
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Text } from "../atoms/Text";

type ProfileHeaderProps = {
  title: string;
  onBack?: () => void;
};

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
    <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-white">
      <button
        onClick={handleBack}
        className="text-gray-900 flex size-12 shrink-0 items-center"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      <Text variant="h2" className="flex-1 text-center pr-12">
        {title}'s Profile
      </Text>
    </div>
  );
};
