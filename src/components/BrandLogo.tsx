import myrentalLogo from "@/assets/myrental-logo.png";

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
        src={myrentalLogo}
        alt="MyRental — easy to rent a space"
        className={`${heights[size]} w-auto`}
      />
      {showText && (
        <span className="font-[var(--font-heading)] font-bold text-foreground tracking-tight"
          style={{ fontSize: size === "sm" ? "1rem" : size === "lg" ? "1.5rem" : "1.25rem" }}>
          MyRental
        </span>
      )}
    </div>
  );
}

export { myrentalLogo };
