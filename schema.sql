-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users Table
create table public.users (
    id uuid primary key default uuid_generate_v4(),
    email text unique not null,
    name text not null,
    role text not null check (role in ('admin', 'student')),
    avatar_url text,
    bio text,
    phone text,
    company text,
    position text,
    department text,
    completed_courses integer default 0,
    average_grade numeric(4,2) default 0.00,
    total_score integer default 0,
    last_active timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Groups Table
create table public.groups (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Group Permissions Table
create table public.group_permissions (
    id uuid primary key default uuid_generate_v4(),
    group_id uuid references public.groups(id) on delete cascade,
    resource_type text not null check (resource_type in ('course', 'module', 'lesson', 'feature')),
    resource_id uuid,
    permission text not null check (permission in ('read', 'write', 'execute')),
    created_at timestamp with time zone default now(),
    unique(group_id, resource_type, resource_id, permission)
);

-- User Groups Table
create table public.user_groups (
    user_id uuid references public.users(id) on delete cascade,
    group_id uuid references public.groups(id) on delete cascade,
    created_at timestamp with time zone default now(),
    primary key (user_id, group_id)
);

-- Courses Table
create table public.courses (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    thumbnail_url text,
    duration integer not null default 0,
    category text not null,
    level text not null check (level in ('beginner', 'intermediate', 'advanced')),
    instructor_id uuid references public.users(id),
    prerequisites jsonb default '[]'::jsonb,
    students_count integer default 0,
    rating numeric(3,2) default 0.00,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Modules Table
create table public.modules (
    id uuid primary key default uuid_generate_v4(),
    course_id uuid references public.courses(id) on delete cascade,
    title text not null,
    description text,
    duration integer not null default 0,
    order_index integer not null,
    required_for_completion boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Lessons Table
create table public.lessons (
    id uuid primary key default uuid_generate_v4(),
    module_id uuid references public.modules(id) on delete cascade,
    title text not null,
    description text,
    video_url text,
    duration integer not null default 0,
    order_index integer not null,
    required_for_completion boolean default true,
    thumbnail_url text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Attachments Table
create table public.attachments (
    id uuid primary key default uuid_generate_v4(),
    lesson_id uuid references public.lessons(id) on delete cascade,
    title text not null,
    url text not null,
    type text not null check (type in ('pdf', 'doc', 'other')),
    size integer not null,
    created_at timestamp with time zone default now()
);

-- Exams Table
create table public.exams (
    id uuid primary key default uuid_generate_v4(),
    module_id uuid references public.modules(id) on delete cascade,
    title text not null,
    description text,
    min_score numeric(4,2) not null,
    time_limit integer,
    max_attempts integer not null default 1,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Questions Table
create table public.questions (
    id uuid primary key default uuid_generate_v4(),
    exam_id uuid references public.exams(id) on delete cascade,
    text text not null,
    options jsonb not null,
    correct_option integer not null,
    explanation text,
    order_index integer not null,
    created_at timestamp with time zone default now()
);

-- User Progress Table
create table public.user_progress (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    lesson_id uuid references public.lessons(id) on delete cascade,
    completed boolean default false,
    watch_time integer default 0,
    last_position numeric(10,2) default 0,
    updated_at timestamp with time zone default now(),
    unique(user_id, lesson_id)
);

-- Exam Attempts Table
create table public.exam_attempts (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    exam_id uuid references public.exams(id) on delete cascade,
    score numeric(4,2),
    answers jsonb not null default '[]'::jsonb,
    started_at timestamp with time zone default now(),
    completed_at timestamp with time zone,
    unique(user_id, exam_id, started_at)
);

-- Certificates Table
create table public.certificates (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    course_id uuid references public.courses(id) on delete cascade,
    completion_date timestamp with time zone not null,
    grade numeric(4,2) not null,
    duration integer not null,
    valid_until timestamp with time zone,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default now(),
    unique(user_id, course_id)
);

-- News Table
create table public.news (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    content text not null,
    image_url text,
    category text not null check (category in ('announcement', 'update', 'event')),
    author_id uuid references public.users(id),
    featured boolean default false,
    published_at timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- News Tags Table
create table public.news_tags (
    news_id uuid references public.news(id) on delete cascade,
    tag text not null,
    primary key (news_id, tag)
);

-- Ebooks Table
create table public.ebooks (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    author text not null,
    description text,
    thumbnail_url text,
    pdf_url text not null,
    category text not null,
    downloads integer default 0,
    release_year text not null,
    published_at timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Notifications Table
create table public.notifications (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    type text not null check (type in ('course_completed', 'new_course', 'achievement', 'news')),
    title text not null,
    message text not null,
    read boolean default false,
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default now()
);

-- Achievements Table
create table public.achievements (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    type text not null check (type in ('course_completion', 'perfect_score', 'streak')),
    title text not null,
    description text not null,
    icon text not null,
    unlocked_at timestamp with time zone default now()
);

-- Create indexes for better query performance
create index idx_users_email on public.users(email);
create index idx_users_role on public.users(role);
create index idx_courses_category on public.courses(category);
create index idx_courses_level on public.courses(level);
create index idx_modules_course_id on public.modules(course_id);
create index idx_lessons_module_id on public.lessons(module_id);
create index idx_user_progress_user_id on public.user_progress(user_id);
create index idx_certificates_user_id on public.certificates(user_id);
create index idx_news_category on public.news(category);
create index idx_news_featured on public.news(featured);
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_achievements_user_id on public.achievements(user_id);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at columns
create trigger update_users_updated_at
    before update on public.users
    for each row
    execute function update_updated_at_column();

create trigger update_groups_updated_at
    before update on public.groups
    for each row
    execute function update_updated_at_column();

create trigger update_courses_updated_at
    before update on public.courses
    for each row
    execute function update_updated_at_column();

create trigger update_modules_updated_at
    before update on public.modules
    for each row
    execute function update_updated_at_column();

create trigger update_lessons_updated_at
    before update on public.lessons
    for each row
    execute function update_updated_at_column();

create trigger update_exams_updated_at
    before update on public.exams
    for each row
    execute function update_updated_at_column();

create trigger update_news_updated_at
    before update on public.news
    for each row
    execute function update_updated_at_column();

create trigger update_ebooks_updated_at
    before update on public.ebooks
    for each row
    execute function update_updated_at_column();

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.groups enable row level security;
alter table public.group_permissions enable row level security;
alter table public.user_groups enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.attachments enable row level security;
alter table public.exams enable row level security;
alter table public.questions enable row level security;
alter table public.user_progress enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.certificates enable row level security;
alter table public.news enable row level security;
alter table public.news_tags enable row level security;
alter table public.ebooks enable row level security;
alter table public.notifications enable row level security;
alter table public.achievements enable row level security;

-- Create basic policies (you may want to customize these based on your needs)
create policy "Enable read access for all users"
    on public.users for select
    using (true);

create policy "Enable insert for authenticated users only"
    on public.users for insert
    with check (auth.role() = 'authenticated');

create policy "Enable update for users based on email"
    on public.users for update
    using (auth.email() = email);

-- Note: Add more specific policies based on your application's requirements