-- First drop the foreign key constraint if it exists
ALTER TABLE IF EXISTS public.courses 
DROP CONSTRAINT IF EXISTS courses_instructor_id_fkey;

-- Then drop the instructor_id column
ALTER TABLE IF EXISTS public.courses 
DROP COLUMN IF EXISTS instructor_id;

-- Update existing courses data
UPDATE public.courses
SET 
  title = 'Gestão de Pastagens',
  description = 'Aprenda técnicas avançadas de manejo de pastagens para maximizar a produtividade do seu rebanho. Este curso abrange desde conceitos básicos até estratégias avançadas de manejo.',
  thumbnail_url = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
  duration = 40,
  category = 'pastagens',
  level = 'intermediate',
  prerequisites = '["Conhecimentos básicos em pecuária"]',
  students_count = 45,
  rating = 4.8
WHERE title = 'Gestão de Pastagens';

UPDATE public.courses
SET 
  title = 'Nutrição Animal',
  description = 'Fundamentos e práticas avançadas de nutrição animal para pecuária.',
  thumbnail_url = 'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
  duration = 35,
  category = 'nutricao',
  level = 'advanced',
  prerequisites = '["Formação em Medicina Veterinária ou Zootecnia"]',
  students_count = 32,
  rating = 4.5
WHERE title = 'Nutrição Animal';

-- Insert new courses if they don't exist
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
)
SELECT
  'Gestão de Pastagens',
  'Aprenda técnicas avançadas de manejo de pastagens para maximizar a produtividade do seu rebanho. Este curso abrange desde conceitos básicos até estratégias avançadas de manejo.',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
  40,
  'pastagens',
  'intermediate',
  '["Conhecimentos básicos em pecuária"]',
  45,
  4.8
WHERE NOT EXISTS (
  SELECT 1 FROM public.courses WHERE title = 'Gestão de Pastagens'
);

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
)
SELECT
  'Nutrição Animal',
  'Fundamentos e práticas avançadas de nutrição animal para pecuária.',
  'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
  35,
  'nutricao',
  'advanced',
  '["Formação em Medicina Veterinária ou Zootecnia"]',
  32,
  4.5
WHERE NOT EXISTS (
  SELECT 1 FROM public.courses WHERE title = 'Nutrição Animal'
);