
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ListPropertyFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ListPropertyForm = ({ isOpen, onClose }: ListPropertyFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    status: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    location: '',
    address: '',
    features: '',
    description: ''
  });
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();

  const propertyTypes = [
    'House', 'Apartment', 'Condo', 'Townhouse', 'Villa', 
    'Cottage', 'Penthouse', 'Mansion', 'Eco-Home', 'Cabin'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length < 4) {
      toast({
        title: "Insufficient Images",
        description: "Please upload at least 4 images showing different angles of your property.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Property Listed Successfully!",
      description: "Your property has been submitted for review and will be live within 24 hours.",
    });
    
    // Reset form
    setFormData({
      title: '', type: '', status: '', price: '', bedrooms: '', 
      bathrooms: '', sqft: '', location: '', address: '', features: '', description: ''
    });
    setImages([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            List Your Property
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Modern Family Home in Downtown"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Property Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Listing Type *</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="For Sale or Rent?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="For Sale">For Sale</SelectItem>
                  <SelectItem value="For Rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                placeholder="e.g., $850,000 or $2,500/month"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sqft">Square Feet *</Label>
              <Input
                id="sqft"
                type="number"
                min="0"
                value={formData.sqft}
                onChange={(e) => handleInputChange('sqft', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Downtown, Metro City"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Full Address *</Label>
            <Input
              id="address"
              placeholder="Complete street address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="features">Features</Label>
            <Input
              id="features"
              placeholder="e.g., Pool, Garage, Garden, Fireplace (comma separated)"
              value={formData.features}
              onChange={(e) => handleInputChange('features', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your property in detail..."
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
          
          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label>Property Images * (Upload at least 4 images from different angles)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-2">
                    <img src={image} alt={`Property ${index + 1}`} className="w-full h-32 object-cover rounded" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {images.length < 8 && (
                <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                  <CardContent className="p-2 h-36 flex items-center justify-center">
                    <label htmlFor="image-upload" className="cursor-pointer text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-600">Upload Image</span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </CardContent>
                </Card>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Uploaded: {images.length}/8 images (minimum 4 required)
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              List Property
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ListPropertyForm;
