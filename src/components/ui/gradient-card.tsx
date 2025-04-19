
import * as React from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientFrom?: string;
  gradientTo?: string;
  borderGlow?: boolean;
}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ 
    className, 
    gradientFrom = "from-primary/20", 
    gradientTo = "to-accent/20", 
    borderGlow = false,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-lg overflow-hidden p-6",
          "bg-gradient-to-br",
          gradientFrom,
          gradientTo,
          borderGlow && "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:bg-gradient-to-br before:from-primary/50 before:to-accent/50 before:content-[''] before:-z-10",
          className
        )}
        {...props}
      />
    );
  }
);
GradientCard.displayName = "GradientCard";

export { GradientCard };
