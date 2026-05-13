import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera, Trash2, Save, ShoppingBag, Tag, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    avatar_url: '' as string | null,
    date_of_birth: '',
    address: '',
    bio: '',
    buy_count: 0,
    sell_count: 0,
    rent_count: 0,
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }
      setEmail(user.email ?? '');
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (data) {
        setProfile({
          full_name: data.full_name ?? '',
          phone: data.phone ?? '',
          avatar_url: data.avatar_url ?? null,
          date_of_birth: data.date_of_birth ?? '',
          address: (data as any).address ?? '',
          bio: (data as any).bio ?? '',
          buy_count: (data as any).buy_count ?? 0,
          sell_count: (data as any).sell_count ?? 0,
          rent_count: (data as any).rent_count ?? 0,
        });
      }
      setLoading(false);
    })();
  }, [navigate]);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfile((p) => ({ ...p, avatar_url: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => setProfile((p) => ({ ...p, avatar_url: null }));

  const save = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      phone: profile.phone,
      avatar_url: profile.avatar_url,
      date_of_birth: profile.date_of_birth || null,
      address: profile.address,
      bio: profile.bio,
    } as any).eq('id', user.id);
    setSaving(false);
    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated' });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Button>

        <Card className="overflow-hidden shadow-xl">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
          <CardContent className="p-6 -mt-16">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                      {(profile.full_name || email).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow"
                  title="Change photo"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
              </div>
              {profile.avatar_url && (
                <Button variant="ghost" size="sm" onClick={removeAvatar} className="mt-2 text-red-600">
                  <Trash2 className="h-4 w-4 mr-1" /> Remove Photo
                </Button>
              )}
              <h1 className="text-2xl font-bold mt-3">{profile.full_name || 'Your Name'}</h1>
              <p className="text-gray-500 text-sm">{email}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <ShoppingBag className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                <div className="text-2xl font-bold">{profile.buy_count}</div>
                <div className="text-xs text-gray-600">Buys</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Tag className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                <div className="text-2xl font-bold">{profile.sell_count}</div>
                <div className="text-xs text-gray-600">Sells</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <KeyRound className="h-6 w-6 mx-auto text-indigo-600 mb-1" />
                <div className="text-2xl font-bold">{profile.rent_count}</div>
                <div className="text-xs text-gray-600">Rents</div>
              </div>
            </div>

            {/* Editable fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" value={profile.date_of_birth} onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Bio</Label>
                <Textarea rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
              </div>
            </div>

            <Button onClick={save} disabled={saving} className="w-full mt-6">
              <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
