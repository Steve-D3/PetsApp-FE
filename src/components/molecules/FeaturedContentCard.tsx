interface FeaturedContentCardProps {
  title: string;
  description: string;
  imageUrl: string;
  onClick?: () => void;
}

export const FeaturedContentCard = ({
  title,
  description,
  imageUrl,
  onClick,
}: FeaturedContentCardProps) => (
  <div 
    className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-[160px] cursor-pointer hover:opacity-90 transition-opacity"
    onClick={onClick}
  >
    <div
      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    />
    <div>
      <p className="text-[#101518] text-base font-medium leading-normal">
        {title}
      </p>
      <p className="text-[#5c778a] text-sm font-normal leading-normal">
        {description}
      </p>
    </div>
  </div>
);
