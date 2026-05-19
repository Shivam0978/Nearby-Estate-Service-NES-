import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

const AuthModal = ({ isOpen, onClose, onAuthSuccess }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendSignupEmail = async (payload: any) => {
    try {
      await supabase.functions.invoke('send-signup-email', { body: payload });
    } catch (e) {
      console.error('send-signup-email failed', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: 'Welcome back!', description: 'Signed in successfully.' });
        // Send login notification with profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();
        await sendSignupEmail({
          full_name: (profile as any)?.full_name,
          email: data.user.email,
          mobile_number: (profile as any)?.mobile_number ?? (profile as any)?.phone,
          city: (profile as any)?.city,
          address: (profile as any)?.address,
          date_of_birth: (profile as any)?.date_of_birth,
        });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: fullName, phone: mobile },
          },
        });
        if (error) throw error;

        // Save extra profile fields
        if (data.user) {
          await supabase
            .from('profiles')
            .update({
              full_name: fullName,
              mobile_number: mobile,
              phone: mobile,
              city,
              address,
              date_of_birth: dob || null,
            } as any)
            .eq('id', data.user.id);

          await sendSignupEmail({
            full_name: fullName,
            email,
            mobile_number: mobile,
            city,
            address,
            date_of_birth: dob,
          });
        }
        toast({ title: 'Account created!', description: 'You are now signed in.' });
      }
      onAuthSuccess();
      onClose();
    } catch (err: any) {
      toast({ title: 'Authentication failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isLogin ? 'Sign In' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <>
              <div className="space-y-1">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input id="mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="city">City *</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              </div>
            </>
          )}

          <div className="space-y-1">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input id="email" type="email" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input id="password" type="password" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-[hsl(210,55%,15%)] to-[hsl(190,55%,40%)]" disabled={loading}>
            {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
          </Button>

          <div className="text-center">
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-600 hover:underline">
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
