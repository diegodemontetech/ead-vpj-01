import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';

async function populateDatabase() {
  try {
    console.log('Starting database population...');

    // Create admin user first
    console.log('Creating admin user...');
    await authService.createInitialAdmin();

    // Get admin user ID
    const { data: adminUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'diegodemontevpj@gmail.com')
      .single();

    if (!adminUser) throw new Error('Admin user not found');

    // Create instructors if they don't exist
    console.log('Creating instructors...');
    const instructors = [
      {
        name: 'Dr. João Silva',
        email: 'joao.silva@vpj.com.br',
        role: 'admin',
        avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
        bio: 'Especialista em gestão de pastagens com mais de 15 anos de experiência.',
        department: 'Pecuária',
        position: 'Coordenador Técnico',
      },
      {
        name: 'Dra. Maria Santos',
        email: 'maria.santos@vpj.com.br',
        role: 'admin',
        avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg',
        bio: 'Pesquisadora e especialista em nutrição animal.',
        department: 'Pecuária',
        position: 'Coordenadora de Nutrição',
      }
    ];

    for (const instructor of instructors) {
      const { data: existingInstructor } = await supabase
        .from('users')
        .select('id')
        .eq('email', instructor.email)
        .single();

      if (!existingInstructor) {
        await supabase.from('users').insert(instructor);
      }
    }

    // Get all instructors
    const { data: createdInstructors } = await supabase
      .from('users')
      .select('*')
      .in('email', instructors.map(i => i.email));

    if (!createdInstructors) throw new Error('Failed to get instructors');

    // Create courses if they don't exist
    console.log('Creating courses...');
    const courses = [
      {
        title: 'Gestão de Pastagens',
        description: 'Aprenda técnicas avançadas de manejo de pastagens para maximizar a produtividade do seu rebanho. Este curso abrange desde conceitos básicos até estratégias avançadas de manejo.',
        thumbnail_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
        duration: 40,
        category: 'pastagens',
        level: 'intermediate',
        instructor_id: createdInstructors[0].id,
        prerequisites: ['Conhecimentos básicos em pecuária'],
        students_count: 45,
        rating: 4.8,
      },
      {
        title: 'Nutrição Animal',
        description: 'Fundamentos e práticas avançadas de nutrição animal para pecuária.',
        thumbnail_url: 'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
        duration: 35,
        category: 'nutricao',
        level: 'advanced',
        instructor_id: createdInstructors[1].id,
        prerequisites: ['Formação em Medicina Veterinária ou Zootecnia'],
        students_count: 32,
        rating: 4.5,
      }
    ];

    for (const course of courses) {
      const { data: existingCourse } = await supabase
        .from('courses')
        .select('id')
        .eq('title', course.title)
        .single();

      if (!existingCourse) {
        const { data: createdCourse } = await supabase
          .from('courses')
          .insert(course)
          .select()
          .single();

        if (createdCourse) {
          // Create modules for the course
          const modules = [
            {
              course_id: createdCourse.id,
              title: 'Introdução',
              description: 'Fundamentos e conceitos básicos',
              duration: 10,
              order_index: 0,
              required_for_completion: true,
            },
            {
              course_id: createdCourse.id,
              title: 'Práticas Avançadas',
              description: 'Técnicas e estratégias avançadas',
              duration: 15,
              order_index: 1,
              required_for_completion: true,
            }
          ];

          for (const module of modules) {
            const { data: createdModule } = await supabase
              .from('modules')
              .insert(module)
              .select()
              .single();

            if (createdModule) {
              // Create lessons for the module
              const lessons = [
                {
                  module_id: createdModule.id,
                  title: `${createdModule.title} - Aula 1`,
                  description: 'Descrição detalhada da aula 1',
                  video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                  duration: 45,
                  order_index: 0,
                  required_for_completion: true,
                },
                {
                  module_id: createdModule.id,
                  title: `${createdModule.title} - Aula 2`,
                  description: 'Descrição detalhada da aula 2',
                  video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                  duration: 40,
                  order_index: 1,
                  required_for_completion: true,
                }
              ];

              await supabase.from('lessons').insert(lessons);
            }
          }
        }
      }
    }

    // Create news if they don't exist
    console.log('Creating news...');
    const news = [
      {
        title: 'Novo Curso de Gestão de Pastagens',
        content: 'Estamos muito empolgados em anunciar o lançamento do nosso mais novo curso sobre gestão eficiente de pastagens!',
        image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
        category: 'announcement',
        author_id: adminUser.id,
        featured: true,
      },
      {
        title: 'Webinar: Nutrição Animal',
        content: 'Participe do nosso próximo webinar sobre nutrição animal e aprenda técnicas avançadas para otimizar a alimentação do seu rebanho.',
        image_url: 'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
        category: 'event',
        author_id: adminUser.id,
        featured: true,
      }
    ];

    for (const newsItem of news) {
      const { data: existingNews } = await supabase
        .from('news')
        .select('id')
        .eq('title', newsItem.title)
        .single();

      if (!existingNews) {
        const { data: createdNews } = await supabase
          .from('news')
          .insert(newsItem)
          .select()
          .single();

        if (createdNews) {
          // Add tags to news
          const tags = ['cursos', 'pastagens', 'nutrição'];
          const newsTags = tags.map(tag => ({
            news_id: createdNews.id,
            tag
          }));

          await supabase.from('news_tags').insert(newsTags);
        }
      }
    }

    // Create ebooks if they don't exist
    console.log('Creating ebooks...');
    const ebooks = [
      {
        title: 'Gestão Moderna de Pastagens',
        author: 'Dr. João Silva',
        description: 'Um guia completo sobre técnicas modernas de gestão de pastagens.',
        thumbnail_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
        pdf_url: 'https://example.com/ebooks/gestao-pastagens.pdf',
        category: 'pastagens',
        downloads: 245,
        release_year: '2024',
      },
      {
        title: 'Nutrição Animal Avançada',
        author: 'Dra. Maria Santos',
        description: 'Fundamentos e práticas avançadas de nutrição animal.',
        thumbnail_url: 'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
        pdf_url: 'https://example.com/ebooks/nutricao-animal.pdf',
        category: 'nutricao',
        downloads: 183,
        release_year: '2024',
      }
    ];

    for (const ebook of ebooks) {
      const { data: existingEbook } = await supabase
        .from('ebooks')
        .select('id')
        .eq('title', ebook.title)
        .single();

      if (!existingEbook) {
        await supabase.from('ebooks').insert(ebook);
      }
    }

    console.log('Database population completed successfully!');

  } catch (error) {
    console.error('Error populating database:', error);
    throw error;
  }
}

// Run the population script
populateDatabase()
  .then(() => {
    console.log('All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to populate database:', error);
    process.exit(1);
  });