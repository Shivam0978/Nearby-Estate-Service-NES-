import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import PropertyModal from '@/components/PropertyModal';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { sampleProperties } from '@/data/properties';

const Buy = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const buyable = sampleProperties.filter((p) => p.status === 'For Sale');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:bg-white/10 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Button>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <ShoppingBag className="h-9 w-9" /> Houses & Apartments to Buy
          </h1>
          <p className="text-blue-100 mt-2">{buyable.length} properties available for purchase</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {buyable.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={(p) => { setSelected(p); setOpen(true); }}
              />
            ))}
          </div>
        </div>
      </section>

      <PropertyModal property={selected} isOpen={open} onClose={() => { setOpen(false); setSelected(null); }} />
    </div>
  );
};

export default Buy;
