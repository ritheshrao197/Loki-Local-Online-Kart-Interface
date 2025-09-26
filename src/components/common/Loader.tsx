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
