
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Square, Calendar, Phone, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface PropertyModalProps {
  property: any;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyModal = ({ property, isOpen, onClose }: PropertyModalProps) => {
  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{property.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Image */}
          <div className="relative">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-80 object-cover rounded-lg"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant={property.status === 'For Sale' ? 'default' : 'secondary'}>
                {property.status}
              </Badge>
              <Badge variant="outline" className="bg-white/90">
                {property.type}
              </Badge>
            </div>
          </div>

          {/* Price and Location */}
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {property.price}
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{property.location}</span>
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Property Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Bedrooms</span>
                  </div>
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Bathrooms</span>
                  </div>
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Square Feet</span>
                  </div>
                  <span className="font-medium">{property.sqft.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Year Built</span>
                  </div>
                  <span className="font-medium">2018</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <h3 className="font-semibold text-lg">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                This stunning {property.type} offers modern living at its finest. With {property.bedrooms} spacious bedrooms 
                and {property.bathrooms} beautifully appointed bathrooms, this home provides comfort and elegance throughout. 
                The open-concept design creates a seamless flow between living spaces, perfect for both everyday living and entertaining.
              </p>
              
              <h4 className="font-medium mt-4 mb-2">Features & Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Contact Agent</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    JS
                  </div>
                  <div>
                    <p className="font-medium">Jane Smith</p>
                    <p className="text-sm text-gray-600">Licensed Real Estate Agent</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span>jane.smith@estatehub.com</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Agent
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyModal;
