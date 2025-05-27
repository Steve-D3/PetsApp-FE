interface PetAvatarProps {
  photoUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PetAvatar = ({ 
  photoUrl, 
  name, 
  size = 'md',
  className = '' 
}: PetAvatarProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {photoUrl ? (
        <div 
          className="w-full h-full rounded-full bg-cover bg-center border-4 border-white shadow-md"
          style={{ backgroundImage: `url(${photoUrl})` }}
          aria-label={`${name}'s profile picture`}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
          <span className="text-xl font-medium">{name.charAt(0).toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};
