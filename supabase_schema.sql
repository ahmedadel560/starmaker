-- Create Products Table
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    price NUMERIC NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL, -- Storing Base64 for simplicity as requested, or actual URL
    description TEXT,
    featured BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: Allow Public Read Access (Everyone can view products)
CREATE POLICY "Allow Public Read"
ON public.products
FOR SELECT
TO public
USING (true);

-- Policy: Allow Public Write Access (For Admin Page without Auth)
-- WARNING: This allows anyone with the API key to write. 
-- Security is handled by the Admin Page's JS PIN check.
CREATE POLICY "Allow Public Write"
ON public.products
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow Public Update"
ON public.products
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow Public Delete"
ON public.products
FOR DELETE
TO public
USING (true);
