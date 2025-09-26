
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductDetailSkeleton = () => (
  <div className="px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <Skeleton className="aspect-square w-full rounded-lg" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-6 w-24 rounded-md" />
        <Skeleton className="h-10 w-3/4 rounded-md" />
        <Skeleton className="h-5 w-1/2 rounded-md" />
        <Skeleton className="h-12 w-48 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  </div>
);
