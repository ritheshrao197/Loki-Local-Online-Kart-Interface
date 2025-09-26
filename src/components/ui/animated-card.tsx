"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  animateOnHover?: boolean;
  tiltEffect?: boolean;
  floating?: boolean;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, animateOnHover = true, tiltEffect = false, floating = false, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tiltEffect) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    };
    
    const getTiltStyle = () => {
      if (!tiltEffect || !isHovered) return {};
      
      // Calculate tilt based on mouse position
      const rect = document.createElement('div').getBoundingClientRect(); // Placeholder
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = (mousePosition.x - centerX) / 10;
      const rotateX = (centerY - mousePosition.y) / 10;
      
      return {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
      };
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border bg-card text-card-foreground shadow-sm backdrop-blur-sm transition-all duration-300 overflow-hidden",
          animateOnHover && "hover:shadow-lg",
          floating && "animate-float",
          className
        )}
        style={tiltEffect ? getTiltStyle() : {}}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePosition({ x: 0, y: 0 });
        }}
        onMouseMove={handleMouseMove}
        {...props}
      />
    )
  }
);

AnimatedCard.displayName = "AnimatedCard"

export { AnimatedCard }