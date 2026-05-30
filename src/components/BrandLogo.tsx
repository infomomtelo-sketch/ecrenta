import ecrentaLogo from "@/assets/ecrenta-logo.png";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function BrandLogo({ size = "md", showText = false, className = "" }: BrandLogoProps) {
  const heights = { sm: "h-8", md: "h-10", lg: "h-14" };

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={ecrentaLogo}
        alt="ecrenta — Property Management Simplified for Landlords & Property Owners. Proudly Serving Fresno County."
        className={`${heights[size]} w-auto object-contain`}
      />
    </div>
  );
}

export { ecrentaLogo };
