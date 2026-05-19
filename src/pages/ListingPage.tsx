import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, ArrowLeft, KeyRound, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ListingPageProps {
  mode: 'rent' | 'sell';
}

const ListingPage = ({ mode }: ListingPageProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '', type: '', price: '', bedrooms: '', bathrooms: '', sqft: '',
    location: '', address: '', apartmentName: '', apartmentNumber: '',
    features: '', description: '',
  });
  const [images, setImages] = useState<string[]>([]);

  const isRent = mode === 'rent';
  const title = isRent ? 'Rent Out Your Property' : 'Sell Your Property';
  const Icon = isRent ? KeyRound : Tag;
  const status = isRent ? 'For Rent' : 'For Sale';
  const accent = 'from-[hsl(210,55%,15%)] via-[hsl(200,55%,30%)] to-[hsl(185,50%,45%)]';

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
      setChecked(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
      setChecked(true);
      if (!data.session?.user) setShowAuth(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const setField = (k: string, v: string) => setFormData(p => ({ ...p, [k]: v }));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const r = new FileReader();
      r.onload = ev => { if (ev.target?.result) setImages(p => [...p, ev.target!.result as string]); };
      r.readAsDataURL(file);
    });
  };

  const removeImage = (i: number) => setImages(p => p.filter((_, idx) => idx !== i));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length < 4) {
      toast({ title: 'Need at least 4 images', variant: 'destructive' });
      return;
    }
    if (!userId) { setShowAuth(true); return; }
    setSubmitting(true);
    const fullAddress = [formData.apartmentName, formData.apartmentNumber, formData.address].filter(Boolean).join(', ');
    const { error } = await supabase.from('property_listings').insert({
      user_id: userId,
      title: formData.title,
      type: formData.type,
      status,
      price: formData.price,
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseFloat(formData.bathrooms) || 0,
      sqft: parseInt(formData.sqft) || 0,
      location: formData.location,
      address: fullAddress,
      features: formData.features,
      description: formData.description,
      images,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: 'Failed to submit', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: `Property listed for ${isRent ? 'rent' : 'sale'}!`, description: 'Now visible to other users.' });
    navigate('/buy');
  };

  if (!checked) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
        <Header />
        <div className="max-w-2xl mx-auto py-24 px-4 text-center">
          <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${accent} text-white mb-6`}>
            <Icon className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold text-[hsl(210,55%,15%)] mb-3">Sign in to continue</h1>
          <p className="text-gray-600 mb-6">You need an account to {isRent ? 'list your property for rent' : 'sell your property'}.</p>
          <Button size="lg" onClick={() => setShowAuth(true)} className={`bg-gradient-to-r ${accent}`}>
            Sign In / Create Account
          </Button>
        </div>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onAuthSuccess={() => setShowAuth(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/40">
      <Header />

      {/* Hero */}
      <section className={`relative bg-gradient-to-br ${accent} text-white py-16 overflow-hidden`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-24 bg-white/20 rounded-lg rotate-6"></div>
          <div className="absolute bottom-8 right-20 w-40 h-28 bg-white/15 rounded-lg -rotate-6"></div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:bg-white/10 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/15 rounded-xl backdrop-blur">
              <Icon className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
              <p className="text-cyan-100 mt-1">Reach thousands of buyers and renters on Nearby Estate Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-2 border-cyan-100 shadow-xl">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={submit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Property Title *</Label>
                    <Input value={formData.title} onChange={e => setField('title', e.target.value)} required placeholder="e.g., Spacious 3BHK near Park" />
                  </div>
                  <div className="space-y-1">
                    <Label>Property Type *</Label>
                    <Select value={formData.type} onValueChange={v => setField('type', v)}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {['House','Apartment','Condo','Townhouse','Villa','Penthouse','Studio','Cottage'].map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>{isRent ? 'Monthly Rent *' : 'Price *'}</Label>
                    <Input value={formData.price} onChange={e => setField('price', e.target.value)} required placeholder={isRent ? '₹25,000/month' : '₹85,00,000'} />
                  </div>
                  <div className="space-y-1">
                    <Label>Square Feet *</Label>
                    <Input type="number" value={formData.sqft} onChange={e => setField('sqft', e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label>Bedrooms *</Label>
                    <Input type="number" min="0" value={formData.bedrooms} onChange={e => setField('bedrooms', e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label>Bathrooms *</Label>
                    <Input type="number" min="0" step="0.5" value={formData.bathrooms} onChange={e => setField('bathrooms', e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label>Apartment / Building Name</Label>
                    <Input value={formData.apartmentName} onChange={e => setField('apartmentName', e.target.value)} placeholder="e.g., Sunrise Heights" />
                  </div>
                  <div className="space-y-1">
                    <Label>Apartment / Flat Number</Label>
                    <Input value={formData.apartmentNumber} onChange={e => setField('apartmentNumber', e.target.value)} placeholder="e.g., A-302" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label>Locality / Area *</Label>
                    <Input value={formData.location} onChange={e => setField('location', e.target.value)} required placeholder="Neighbourhood / Area, City" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label>Full Street Address *</Label>
                    <Input value={formData.address} onChange={e => setField('address', e.target.value)} required placeholder="Street, City, Pincode" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Features (comma separated)</Label>
                  <Input value={formData.features} onChange={e => setField('features', e.target.value)} placeholder="Pool, Parking, Garden, Gym, AC" />
                </div>

                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea rows={4} value={formData.description} onChange={e => setField('description', e.target.value)} placeholder="Describe your property…" />
                </div>

                <div className="space-y-3">
                  <Label>Property Images * (minimum 4, from different angles)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, i) => (
                      <Card key={i} className="relative">
                        <CardContent className="p-2">
                          <img src={img} alt={`img ${i+1}`} className="w-full h-32 object-cover rounded" />
                          <Button type="button" variant="destructive" size="sm" className="absolute top-1 right-1 h-6 w-6 p-0" onClick={() => removeImage(i)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    {images.length < 10 && (
                      <Card className="border-dashed border-2 border-cyan-300 hover:border-cyan-500 transition-colors">
                        <CardContent className="p-2 h-36 flex items-center justify-center">
                          <label htmlFor="img-up" className="cursor-pointer text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-cyan-600" />
                            <span className="text-sm text-gray-600">Upload</span>
                            <input id="img-up" type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
                          </label>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{images.length} uploaded (minimum 4 required)</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate('/')} className="flex-1">Cancel</Button>
                  <Button type="submit" disabled={submitting} className={`flex-1 bg-gradient-to-r ${accent} text-white`}>
                    {submitting ? 'Submitting…' : `Submit ${isRent ? 'Rental' : 'Sale'} Listing`}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ListingPage;
