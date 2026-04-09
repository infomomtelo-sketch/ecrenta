import ecrentaLogo from "@/assets/ecrenta-logo.png";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function BrandLogo({ size = "md", showText = true, className = "" }: BrandLogoProps) {
  const heights = { sm: "h-6", md: "h-8", lg: "h-10" };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={ecrentaLogo}
        alt="ecrenta — easy to rent a space"
        className={`${heights[size]} w-auto`}
      />
    </div>
  );
}

export { ecrentaLogo };
