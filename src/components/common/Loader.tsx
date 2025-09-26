import { Triangle, Square, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center items-center h-full min-h-64", className)}>
      <div className="flex items-center justify-center space-x-6">
        <Triangle className="h-10 w-10 text-primary animate-float" />
        <Square className="h-10 w-10 text-accent animate-float [animation-delay:-0.5s]" />
        <Circle className="h-10 w-10 text-secondary-foreground animate-float [animation-delay:-1s]" />
      </div>
    </div>
  );
}
