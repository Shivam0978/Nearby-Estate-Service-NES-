
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import FilterSidebar from '@/components/FilterSidebar';
import PropertyModal from '@/components/PropertyModal';
import { Button } from '@/components/ui/button';
import { Search, MapPin, TrendingUp, Award } from 'lucide-react';
import { sampleProperties } from '@/data/properties';

const Index = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 2000000],
    propertyType: 'all',
    bedrooms: 'any',
    bathrooms: 'any',
    features: []
  });

  const filteredProperties = useMemo(() => {
    return sampleProperties.filter(property => {
      // Price filter (convert property price to number for comparison)
      const propertyPrice = parseInt(property.price.replace(/[^0-9]/g, ''));
      const inPriceRange = propertyPrice >= filters.priceRange[0] && propertyPrice <= filters.priceRange[1];

      // Property type filter
      const matchesType = filters.propertyType === 'all' || 
        property.type.toLowerCase() === filters.propertyType;

      // Bedrooms filter
      const matchesBedrooms = filters.bedrooms === 'any' || 
        (filters.bedrooms === '5+' ? property.bedrooms >= 5 : property.bedrooms === parseInt(filters.bedrooms));

      // Bathrooms filter
      const matchesBathrooms = filters.bathrooms === 'any' || 
        (filters.bathrooms === '4+' ? property.bathrooms >= 4 : property.bathrooms === parseInt(filters.bathrooms));

      // Features filter
      const hasRequiredFeatures = filters.features.length === 0 || 
        filters.features.every(feature => property.features.includes(feature));

      return inPriceRange && matchesType && matchesBedrooms && matchesBathrooms && hasRequiredFeatures;
    });
  }, [filters]);

  const handleViewDetails = (property: any) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const stats = [
    { icon: TrendingUp, title: '50,000+', subtitle: 'Properties Listed' },
    { icon: Award, title: '98%', subtitle: 'Customer Satisfaction' },
    { icon: MapPin, title: '200+', subtitle: 'Cities Covered' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with Enhanced Background */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden">
        {/* Background Houses Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-24 bg-white/20 rounded-lg transform rotate-12"></div>
          <div className="absolute top-20 right-20 w-40 h-30 bg-white/15 rounded-lg transform -rotate-6"></div>
          <div className="absolute bottom-20 left-1/4 w-36 h-28 bg-white/20 rounded-lg transform rotate-3"></div>
          <div className="absolute bottom-10 right-1/3 w-28 h-20 bg-white/15 rounded-lg transform -rotate-12"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-36 bg-white/10 rounded-lg rotate-45"></div>
        </div>
        
        {/* Floating House Icons */}
        <div className="absolute inset-0">
          <div className="absolute top-16 left-1/4 animate-pulse">
            <div className="w-8 h-8 bg-white/30 rounded-sm transform rotate-45"></div>
          </div>
          <div className="absolute bottom-32 right-1/4 animate-pulse delay-1000">
            <div className="w-6 h-6 bg-white/25 rounded-sm transform rotate-12"></div>
          </div>
          <div className="absolute top-32 right-1/3 animate-pulse delay-500">
            <div className="w-10 h-10 bg-white/20 rounded-sm transform -rotate-12"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Find Your Dream Home
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover the perfect property with our advanced search and expert guidance
            </p>
            
            {/* Quick Search */}
            <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Enter city, neighborhood, or address"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <select className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-900">
                  <option>Property Type</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                </select>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.title}</div>
                <div className="text-gray-600">{stat.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <FilterSidebar filters={filters} onFiltersChange={setFilters} />
            </div>

            {/* Properties Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Featured Properties ({filteredProperties.length})
                </h2>
                <select className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500">
                  <option>Sort by: Price (Low to High)</option>
                  <option>Sort by: Price (High to Low)</option>
                  <option>Sort by: Newest</option>
                  <option>Sort by: Bedrooms</option>
                </select>
              </div>

              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">No properties match your current filters</div>
                  <Button variant="outline" onClick={() => setFilters({
                    priceRange: [0, 2000000],
                    propertyType: 'all',
                    bedrooms: 'any',
                    bathrooms: 'any',
                    features: []
                  })}>
                    Clear All Filters
                  </Button>
                </div>
              )}

              {/* Load More Button */}
              {filteredProperties.length > 0 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load More Properties
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">EstateHub</h3>
              <p className="text-gray-400 mb-4">
                Your trusted partner in finding the perfect home. Professional service, expert guidance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Buy</a></li>
                <li><a href="#" className="hover:text-white">Rent</a></li>
                <li><a href="#" className="hover:text-white">Sell</a></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>📞 (555) 123-4567</p>
                <p>📧 info@estatehub.com</p>
                <p>📍 123 Real Estate Ave, City, State 12345</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EstateHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Property Modal */}
      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProperty(null);
        }}
      />
    </div>
  );
};

export default Index;
