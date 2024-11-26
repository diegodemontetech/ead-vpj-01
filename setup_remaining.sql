-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Initial Data Population
INSERT INTO public.users (email, name, role, avatar_url, bio, department, position)
SELECT 
  'diegodemontevpj@gmail.com', 'Diego Monte', 'admin', 'https://ui-avatars.com/api/?name=Diego+Monte', 'Administrador do sistema', 'Diretoria', 'Diretor'
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE email = 'diegodemontevpj@gmail.com'
);

INSERT INTO public.users (email, name, role, avatar_url, bio, department, position)
SELECT 
  'joao.silva@vpj.com.br', 'Dr. João Silva', 'admin', 'https://randomuser.me/api/portraits/men/1.jpg', 'Especialista em gestão de pastagens com mais de 15 anos de experiência.', 'Pecuária', 'Coordenador Técnico'
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE email = 'joao.silva@vpj.com.br'
);

INSERT INTO public.users (email, name, role, avatar_url, bio, department, position)
SELECT 
  'maria.santos@vpj.com.br', 'Dra. Maria Santos', 'admin', 'https://randomuser.me/api/portraits/women/1.jpg', 'Pesquisadora e especialista em nutrição animal.', 'Pecuária', 'Coordenadora de Nutrição'
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE email = 'maria.santos@vpj.com.br'
);

-- Insert Courses
INSERT INTO public.courses (title, description, thumbnail_url, duration, category, level, instructor_id, prerequisites, students_count, rating)
SELECT 
    'Gestão de Pastagens',
    'Aprenda técnicas avançadas de manejo de pastagens para maximizar a produtividade do seu rebanho. Este curso abrange desde conceitos básicos até estratégias avançadas de manejo.',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    40,
    'pastagens',
    'intermediate',
    id,
    '["Conhecimentos básicos em pecuária"]',
    45,
    4.8
FROM public.users 
WHERE email = 'joao.silva@vpj.com.br'
AND NOT EXISTS (
    SELECT 1 FROM public.courses WHERE title = 'Gestão de Pastagens'
);

INSERT INTO public.courses (title, description, thumbnail_url, duration, category, level, instructor_id, prerequisites, students_count, rating)
SELECT 
    'Nutrição Animal',
    'Fundamentos e práticas avançadas de nutrição animal para pecuária.',
    'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
    35,
    'nutricao',
    'advanced',
    id,
    '["Formação em Medicina Veterinária ou Zootecnia"]',
    32,
    4.5
FROM public.users 
WHERE email = 'maria.santos@vpj.com.br'
AND NOT EXISTS (
    SELECT 1 FROM public.courses WHERE title = 'Nutrição Animal'
);

-- Insert News
INSERT INTO public.news (title, content, image_url, category, author_id, featured)
SELECT 
    'Novo Curso de Gestão de Pastagens',
    'Estamos muito empolgados em anunciar o lançamento do nosso mais novo curso sobre gestão eficiente de pastagens!',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    'announcement',
    id,
    true
FROM public.users 
WHERE email = 'diegodemontevpj@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.news WHERE title = 'Novo Curso de Gestão de Pastagens'
);

INSERT INTO public.news (title, content, image_url, category, author_id, featured)
SELECT 
    'Webinar: Nutrição Animal',
    'Participe do nosso próximo webinar sobre nutrição animal e aprenda técnicas avançadas para otimizar a alimentação do seu rebanho.',
    'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
    'event',
    id,
    true
FROM public.users 
WHERE email = 'diegodemontevpj@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.news WHERE title = 'Webinar: Nutrição Animal'
);

-- Insert News Tags (only if news exists and tags don't)
INSERT INTO public.news_tags (news_id, tag)
SELECT n.id, t.tag
FROM public.news n
CROSS JOIN (
    SELECT unnest(ARRAY['cursos', 'pastagens', 'nutrição']) as tag
) t
WHERE NOT EXISTS (
    SELECT 1 
    FROM public.news_tags nt 
    WHERE nt.news_id = n.id AND nt.tag = t.tag
);

-- Insert Ebooks
INSERT INTO public.ebooks (title, author, description, thumbnail_url, pdf_url, category, downloads, release_year)
SELECT
    'Gestão Moderna de Pastagens',
    'Dr. João Silva',
    'Um guia completo sobre técnicas modernas de gestão de pastagens.',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    'https://example.com/ebooks/gestao-pastagens.pdf',
    'pastagens',
    245,
    '2024'
WHERE NOT EXISTS (
    SELECT 1 FROM public.ebooks WHERE title = 'Gestão Moderna de Pastagens'
);

INSERT INTO public.ebooks (title, author, description, thumbnail_url, pdf_url, category, downloads, release_year)
SELECT
    'Nutrição Animal Avançada',
    'Dra. Maria Santos',
    'Fundamentos e práticas avançadas de nutrição animal.',
    'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
    'https://example.com/ebooks/nutricao-animal.pdf',
    'nutricao',
    183,
    '2024'
WHERE NOT EXISTS (
    SELECT 1 FROM public.ebooks WHERE title = 'Nutrição Animal Avançada'
);

-- Insert Modules for each course that doesn't have them yet
INSERT INTO public.modules (course_id, title, description, duration, order_index, required_for_completion)
SELECT 
    c.id as course_id,
    'Introdução',
    'Fundamentos e conceitos básicos',
    10,
    0,
    true
FROM public.courses c
WHERE NOT EXISTS (
    SELECT 1 FROM public.modules m 
    WHERE m.course_id = c.id AND m.title = 'Introdução'
);

INSERT INTO public.modules (course_id, title, description, duration, order_index, required_for_completion)
SELECT 
    c.id as course_id,
    'Práticas Avançadas',
    'Técnicas e estratégias avançadas',
    15,
    1,
    true
FROM public.courses c
WHERE NOT EXISTS (
    SELECT 1 FROM public.modules m 
    WHERE m.course_id = c.id AND m.title = 'Práticas Avançadas'
);

-- Insert Lessons for each module that doesn't have them yet
INSERT INTO public.lessons (module_id, title, description, video_url, duration, order_index, required_for_completion)
SELECT 
    m.id as module_id,
    m.title || ' - Aula 1',
    'Descrição detalhada da aula 1',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    45,
    0,
    true
FROM public.modules m
WHERE NOT EXISTS (
    SELECT 1 FROM public.lessons l 
    WHERE l.module_id = m.id AND l.title = m.title || ' - Aula 1'
);

INSERT INTO public.lessons (module_id, title, description, video_url, duration, order_index, required_for_completion)
SELECT 
    m.id as module_id,
    m.title || ' - Aula 2',
    'Descrição detalhada da aula 2',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    40,
    1,
    true
FROM public.modules m
WHERE NOT EXISTS (
    SELECT 1 FROM public.lessons l 
    WHERE l.module_id = m.id AND l.title = m.title || ' - Aula 2'
);