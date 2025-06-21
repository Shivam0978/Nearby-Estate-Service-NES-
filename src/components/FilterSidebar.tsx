
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface FilterSidebarProps {
  filters: {
    priceRange: number[];
    propertyType: string;
    bedrooms: string;
    bathrooms: string;
    features: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const FilterSidebar = ({ filters, onFiltersChange }: FilterSidebarProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...localFilters, priceRange: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePropertyTypeChange = (value: string) => {
    const newFilters = { ...localFilters, propertyType: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleBedroomsChange = (value: string) => {
    const newFilters = { ...localFilters, bedrooms: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleBathroomsChange = (value: string) => {
    const newFilters = { ...localFilters, bathrooms: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const newFeatures = checked
      ? [...localFilters.features, feature]
      : localFilters.features.filter(f => f !== feature);
    const newFilters = { ...localFilters, features: newFeatures };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const resetFilters = {
      priceRange: [0, 2000000],
      propertyType: 'all',
      bedrooms: 'any',
      bathrooms: 'any',
      features: []
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const propertyTypes = ['all', 'house', 'apartment', 'condo', 'townhouse'];
  const bedroomOptions = ['any', '1', '2', '3', '4', '5+'];
  const bathroomOptions = ['any', '1', '2', '3', '4+'];
  const availableFeatures = ['Pool', 'Garage', 'Garden', 'Fireplace', 'Balcony', 'Gym', 'Security'];

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="px-2">
            <Slider
              value={localFilters.priceRange}
              onValueChange={handlePriceChange}
              max={2000000}
              min={0}
              step={50000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>${localFilters.priceRange[0].toLocaleString()}</span>
              <span>${localFilters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Property Type */}
        <div>
          <h3 className="font-medium mb-3">Property Type</h3>
          <Select value={localFilters.propertyType} onValueChange={handlePropertyTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Bedrooms */}
        <div>
          <h3 className="font-medium mb-3">Bedrooms</h3>
          <Select value={localFilters.bedrooms} onValueChange={handleBedroomsChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bedroomOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option === 'any' ? 'Any' : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Bathrooms */}
        <div>
          <h3 className="font-medium mb-3">Bathrooms</h3>
          <Select value={localFilters.bathrooms} onValueChange={handleBathroomsChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bathroomOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option === 'any' ? 'Any' : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Features */}
        <div>
          <h3 className="font-medium mb-3">Features</h3>
          <div className="space-y-3">
            {availableFeatures.map(feature => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={localFilters.features.includes(feature)}
                  onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                />
                <label htmlFor={feature} className="text-sm cursor-pointer">
                  {feature}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
