
import React from 'react';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    price: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    image: string;
    type: string;
    status: string;
    features: string[];
  };
  onViewDetails: (property: any) => void;
}

const PropertyCard = ({ property, onViewDetails }: PropertyCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={property.status === 'For Sale' ? 'default' : 'secondary'}>
            {property.status}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline" className="bg-white/90">
            {property.type}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.location}</span>
            </div>
          </div>

          <div className="text-2xl font-bold text-blue-600">
            {property.price}
          </div>

          <div className="flex items-center justify-between text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.bedrooms}</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.bathrooms}</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {property.features.slice(0, 2).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {property.features.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{property.features.length - 2} more
              </Badge>
            )}
          </div>

          <Button
            className="w-full mt-4"
            onClick={() => onViewDetails(property)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
