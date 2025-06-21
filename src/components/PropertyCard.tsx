
import React, { useState } from 'react';
import { MapPin, Bed, Bath, Square, Heart, Eye, ShoppingCart, DollarSign, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
  const [currentView, setCurrentView] = useState('front');
  const [isInCart, setIsInCart] = useState(false);
  const { toast } = useToast();

  const views = ['front', 'back', 'side', 'top'];

  const handleViewChange = () => {
    const currentIndex = views.indexOf(currentView);
    const nextIndex = (currentIndex + 1) % views.length;
    setCurrentView(views[nextIndex]);
    toast({
      title: `Viewing ${views[nextIndex]} angle`,
      description: `Now showing ${property.title} from ${views[nextIndex]} view`,
    });
  };

  const handleAddToCart = () => {
    setIsInCart(!isInCart);
    toast({
      title: isInCart ? "Removed from cart" : "Added to cart",
      description: isInCart 
        ? `${property.title} has been removed from your cart`
        : `${property.title} has been added to your cart`,
    });
  };

  const handleBargain = () => {
    toast({
      title: "Bargain Request",
      description: "Please enter your offer price. Your bargain request will be sent to the owner.",
    });
  };

  const handleCheckout = () => {
    toast({
      title: "Meeting Request Sent",
      description: `A request to meet and view ${property.title} has been sent to the owner. They will contact you soon.`,
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={property.image}
          alt={`${property.title} - ${currentView} view`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={property.status === 'For Sale' ? 'default' : 'secondary'}>
            {property.status}
          </Badge>
          <Badge variant="outline" className="bg-white/90">
            {currentView} view
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

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewChange}
              className="flex items-center justify-center"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToCart}
              className={`flex items-center justify-center ${
                isInCart ? 'bg-green-50 text-green-600 border-green-200' : ''
              }`}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isInCart ? 'In Cart' : 'Add Cart'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBargain}
              className="flex items-center justify-center"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Bargain
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckout}
              className="flex items-center justify-center"
            >
              <Check className="h-4 w-4 mr-1" />
              Check Out
            </Button>
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
