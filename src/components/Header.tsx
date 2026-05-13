import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, User, ShoppingBag, KeyRound, Tag, LogOut, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import AuthModal from './AuthModal';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadAvatar = async (id: string) => {
      const { data } = await supabase.from('profiles').select('avatar_url').eq('id', id).maybeSingle();
      setAvatar((data as any)?.avatar_url ?? null);
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const id = session?.user?.id ?? null;
      setUserId(id);
      if (id) loadAvatar(id); else setAvatar(null);
    });
    supabase.auth.getSession().then(({ data }) => {
      const id = data.session?.user?.id ?? null;
      setUserId(id);
      if (id) loadAvatar(id);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const navItems = [
    { label: 'Buy', icon: ShoppingBag, onClick: () => navigate('/buy') },
    { label: 'Rent', icon: KeyRound, onClick: () => navigate('/') },
    { label: 'Sell', icon: Tag, onClick: () => navigate('/') },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Signed out' });
  };

  const ProfileButton = () => (
    <button
      onClick={() => navigate('/profile')}
      className="flex items-center gap-2 group"
      title="Profile"
    >
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 group-hover:scale-105 transition-transform">
        <div className="w-full h-full rounded-full overflow-hidden bg-white">
          {avatar ? (
            <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <UserCircle2 className="w-full h-full text-gray-400" />
          )}
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-700 hidden lg:inline">Profile</span>
    </button>
  );

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="group relative overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-500 group-hover:tracking-wide">
              Nearby Estate Service
            </h1>
            <span className="block h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500" />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(({ label, icon: Icon, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="group flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold mt-1">{label}</span>
              </button>
            ))}

            {userId ? (
              <div className="flex items-center gap-3">
                <ProfileButton />
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-1" /> Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowAuth(true)}>
                <User className="h-4 w-4 mr-2" /> Sign In
              </Button>
            )}
          </nav>

          <div className="md:hidden flex items-center gap-2">
            {userId && <ProfileButton />}
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex justify-around">
              {navItems.map(({ label, icon: Icon, onClick }) => (
                <button key={label} onClick={onClick} className="flex flex-col items-center text-gray-700">
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-semibold mt-1">{label}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 px-4">
              {userId ? (
                <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="w-full" onClick={() => setShowAuth(true)}>
                  <User className="h-4 w-4 mr-2" /> Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onAuthSuccess={() => setShowAuth(false)} />
    </header>
  );
};

export default Header;
