
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

interface ProductFiltersProps {
  sortOption: string;
  setSortOption: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  priceRange: number;
  setPriceRange: (value: number) => void;
  categories: string[];
}

export function ProductFilters({
  sortOption,
  setSortOption,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  categories,
}: ProductFiltersProps) {

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
      <div className="flex items-center gap-2">
        <Label htmlFor="sort-by" className="text-sm shrink-0">Sort by:</Label>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger id="sort-by" className="w-full sm:w-[180px]">
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
      <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2">
            <Label htmlFor="category" className="text-sm shrink-0">Category:</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category" className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        <div className="flex flex-1 items-center gap-4 max-w-sm">
            <Label className="text-sm shrink-0">Price Range:</Label>
            <Slider
                defaultValue={[priceRange]}
                max={10000}
                step={100}
                className="flex-1"
                onValueChange={(value) => setPriceRange(value[0])}
            />
            <span className="text-sm text-muted-foreground font-medium w-24 text-right">
              Up to &#8377;{priceRange.toLocaleString('en-IN')}
            </span>
        </div>
      </div>
    </div>
  );
}
