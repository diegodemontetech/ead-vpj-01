-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.courses CASCADE;

-- Recreate courses table with correct structure
CREATE TABLE public.courses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text,
    thumbnail_url text,
    duration integer NOT NULL DEFAULT 0,
    category text NOT NULL,
    level text NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    prerequisites jsonb DEFAULT '[]'::jsonb,
    students_count integer DEFAULT 0,
    rating numeric(3,2) DEFAULT 0.00,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON public.courses(level);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample courses
INSERT INTO public.courses (
    title,
    description,
    thumbnail_url,
    duration,
    category,
    level,
    prerequisites,
    students_count,
    rating
) VALUES (
    'Gestão de Pastagens',
    'Aprenda técnicas avançadas de manejo de pastagens para maximizar a produtividade do seu rebanho. Este curso abrange desde conceitos básicos até estratégias avançadas de manejo.',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    40,
    'pastagens',
    'intermediate',
    '["Conhecimentos básicos em pecuária"]',
    45,
    4.8
), (
    'Nutrição Animal',
    'Fundamentos e práticas avançadas de nutrição animal para pecuária.',
    'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
    35,
    'nutricao',
    'advanced',
    '["Formação em Medicina Veterinária ou Zootecnia"]',
    32,
    4.5
);