import { StatItem } from "../atoms/StatItem";

interface PetQuickStatsProps {
  weight?: string | number;
  foodPreferences?: string;
  allergies?: string;
  className?: string;
}

export const PetQuickStats = ({
  weight,
  foodPreferences,
  allergies,
  className = "",
}: PetQuickStatsProps) => (
  <div className={`bg-white p-4 rounded-xl shadow-sm ${className}`}>
    <h3 className="font-medium text-gray-900 mb-3">Quick Stats</h3>
    <div className="space-y-3">
      {weight !== undefined && (
        <StatItem label="Weight" value={`${weight} kg`} />
      )}
      {foodPreferences !== undefined && (
        <StatItem label="Food Preferences" value={foodPreferences || "None"} />
      )}
      <StatItem
        label="Allergies"
        value={allergies || "None"}
        isWarning={!!allergies}
      />
    </div>
  </div>
);
