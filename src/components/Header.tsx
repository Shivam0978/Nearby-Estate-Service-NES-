import React, { useEffect, useState } from 'react';
import { Menu, User, ShoppingBag, KeyRound, Tag, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import AuthModal from './AuthModal';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { label: 'Buy', icon: ShoppingBag },
  { label: 'Rent', icon: KeyRound },
  { label: 'Sell', icon: Tag },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUserEmail(data.session?.user?.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Signed out' });
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Animated brand */}
          <a href="/" className="group relative overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-500 group-hover:tracking-wide">
              Nearby Estate Service
            </h1>
            <span className="block h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500" />
          </a>

          {/* Desktop nav with iconic icons */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href="#"
                className="group flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold mt-1">{label}</span>
              </a>
            ))}

            {userEmail ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 max-w-[140px] truncate">{userEmail}</span>
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

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex justify-around">
              {navItems.map(({ label, icon: Icon }) => (
                <a key={label} href="#" className="flex flex-col items-center text-gray-700">
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-semibold mt-1">{label}</span>
                </a>
              ))}
            </div>
            <div className="mt-4 px-4">
              {userEmail ? (
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
