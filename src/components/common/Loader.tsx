import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center items-center h-full min-h-64 overflow-hidden", className)}>
      <div className="relative w-48 h-24">
        <div className="absolute bottom-8 w-full h-1 bg-muted-foreground/20 overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-48 animate-drive">
            <ShoppingCart className="h-10 w-10 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Additional hand-drawn style loader for specific contexts
export function HandDrawnLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 gap-4">
        <div className="animate-float">
          {/* Simple SVG illustration for hand-drawn effect */}
          <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20,50 A 30,30 0 1,1 80,50 A 30,30 0 1,1 20,50" stroke="hsl(var(--primary))" strokeWidth="6" fill="none" strokeLinecap="round" transform="rotate(0)" strokeDasharray="100 100">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="stroke-dasharray" from="10, 188.4" to="188.4, 10" dur="1.5s" repeatCount="indefinite" />
            </path>
            <path d="M 35,50 L 65,50" stroke="hsl(var(--primary))" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 50,35 L 50,65" stroke="hsl(var(--primary))" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
        </div>
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
    </div>
  );
}
