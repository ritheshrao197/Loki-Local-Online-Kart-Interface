'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export function ProductFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
      <div className="flex items-center gap-2">
        <Label htmlFor="sort-by" className="text-sm">Sort by:</Label>
        <Select defaultValue="featured">
          <SelectTrigger id="sort-by" className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2">
            <Label htmlFor="category" className="text-sm">Category:</Label>
            <Select defaultValue="all">
            <SelectTrigger id="category" className="w-[180px]">
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="home-decor">Home Decor</SelectItem>
                <SelectItem value="apparel">Apparel</SelectItem>
                <SelectItem value="food-groceries">Food & Groceries</SelectItem>
                <SelectItem value="art">Art</SelectItem>
            </SelectContent>
            </Select>
        </div>
        <div className="flex flex-1 items-center gap-4 max-w-sm">
            <Label className="text-sm min-w-fit">Price Range:</Label>
            <Slider
                defaultValue={[500]}
                max={5000}
                step={100}
                className="flex-1"
            />
        </div>
      </div>
    </div>
  );
}
