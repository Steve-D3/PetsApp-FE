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

  // Check if the photoUrl is a base64 data URL or a regular URL
  const getImageUrl = (url: string | undefined) => {
    if (!url) return '';
    
    // If it's a base64 data URL or starts with http, use it as is
    if (url.startsWith('data:image') || url.startsWith('http') || url.startsWith('/storage')) {
      return url;
    }
    
    // If it's a temporary path, try to construct a full URL
    // This assumes your API is hosted at the same origin as your frontend
    // If not, you'll need to use the full API URL from your environment variables
    return `${import.meta.env.VITE_API_URL || ''}${url}`;
  };

  const imageUrl = getImageUrl(photoUrl);

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {imageUrl ? (
        <div 
          className="w-full h-full rounded-full bg-cover bg-center border-4 border-white shadow-md"
          style={{ backgroundImage: `url(${imageUrl})` }}
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
