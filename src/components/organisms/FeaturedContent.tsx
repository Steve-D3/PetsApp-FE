import { FeaturedContentCard } from "../molecules/FeaturedContentCard";

interface FeaturedContentProps {
  className?: string;
  onItemClick?: (itemId: string) => void;
}

export const FeaturedContent = ({
  className = "",
  onItemClick,
}: FeaturedContentProps) => {
  const featuredItems = [
    {
      id: "1",
      title: "Premium Dog Food",
      description: "Special offer on premium dog food",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAst-nLkjO461ZYPR04SG5v3E56qmWTyNDve8NNxoFVVw-6aveFK1GB-erKIBE3qI8_M7KX1LEkkbs8d3Hu_OP7SkIQD0UH-4Ikn1be-YQFx63fK5Ye4lLkbUDoV1yGSmyZ78MAnCXXxZXpPHBmqvT56VtaO3XvpipqW6wBruXfHYGSawK4gFQFMIaPX0PAa-mieWGMk4JrykiNa6p9P5Fkv8aV10v0v7WJ5AE4MzE2Y7Hi5rwBAYIHHb5KFwikGrCVti3HdTOTl3c",
    },
    {
      id: "2",
      title: "Professional Grooming",
      description: "Book a grooming session today",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBsXKEtqXe1lj1E9C48-adXqW76S2k-A-bp7vywzhisq_8rr61Iw98x-d3xXRaILuo14KFV08UKCWAoEEnz17fhultNJysvXL095URuj1YFuztldgkB5tJx3FoTrBZIS1kq3-dXITr7rom5tECZ7ILz2i7IvehQx88nSHsuMvSn5OHLfdLc8j1b5vIeP9WPyzCRMseAM_VFNO2FfkdmKWSk5uBEnsuTUo1VZ8QG8W8tK0qIxKehi1X9aqNtsESzgW5YsTlAOvaVujE",
    },
    {
      id: "3",
      title: "Local Dog Park Event",
      description: "Join us for a fun day at the park",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB23dMXX8cFNLCgW6BgOr6HXO4dMyUDisvXYE9MBYXbswpYLgQzyZRHpZDyTh7fdAyBSAoncoH6DfPYR2z_tLkPukhFVpKEoZ2i6vysL3B_XeMhUueunQMAxC7Gbofy0zQOVq-ZKUbS3uH3_WLyrIdQPTz9OYQ8eGBxOGwOjnn6s2V2wr8qN5MtWrK2Y3brFMIjT8mknynXrYr7EDqSJC17QDzfAxm7JlCy1U4PH_OzkpEmd1nqUWDcJ5uKeeokgYx5-q8CE1a6Yrs",
    },
  ];

  return (
    <div className={`px-4 pb-6 ${className}`}>
      <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
        Featured Content
      </h2>
      <div className="overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-stretch gap-4">
          {featuredItems.map((item) => (
            <FeaturedContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
              onClick={() => onItemClick?.(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
