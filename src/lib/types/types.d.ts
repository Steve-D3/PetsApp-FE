export type Pet = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  imageUrl: string;
};

export type MobileNavItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
};

export type TextProps = {
  variant?: "h1" | "h2" | "h3" | "body" | "caption";
  children: React.ReactNode;
  className?: string;
};

export type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
};

export type ProfileHeaderProps = {
  title: string;
  onBack?: () => void;
};

export type HeaderProps = {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
};

export type InfoCardProps = {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "outline";
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
};
