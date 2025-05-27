interface PetInfoProps {
  name: string;
  breed?: string;
  gender?: string;
  birthDate?: string;
  className?: string;
}

export const PetInfo = ({
  name,
  breed,
  gender,
  birthDate,
  className = ''
}: PetInfoProps) => (
  <div className={`text-center ${className}`}>
    <h2 className="text-xl font-bold text-gray-900">{name}</h2>
    {(breed || gender) && (
      <p className="text-gray-600">
        {breed} {breed && gender ? '•' : ''} {gender}
      </p>
    )}
    {birthDate && (
      <p className="text-sm text-gray-500 mt-1">{birthDate}</p>
    )}
  </div>
);
