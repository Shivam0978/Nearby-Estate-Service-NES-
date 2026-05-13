
-- profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- property_listings
CREATE TABLE public.property_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  price TEXT NOT NULL,
  bedrooms INT NOT NULL DEFAULT 0,
  bathrooms NUMERIC NOT NULL DEFAULT 0,
  sqft INT NOT NULL DEFAULT 0,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  features TEXT,
  description TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view listings" ON public.property_listings FOR SELECT USING (true);
CREATE POLICY "Users insert own listings" ON public.property_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own listings" ON public.property_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own listings" ON public.property_listings FOR DELETE USING (auth.uid() = user_id);

-- inquiries
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_title TEXT,
  inquiry_type TEXT NOT NULL,
  message TEXT,
  offer_price TEXT,
  sender_name TEXT,
  sender_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own inquiries" ON public.inquiries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own inquiries" ON public.inquiries FOR INSERT WITH CHECK (auth.uid() = user_id);
