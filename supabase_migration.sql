-- =====================================================================
-- SUPABASE DATABASE SCHEMA MIGRATION FOR "EU E MOI"
-- =====================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Profile Table
CREATE TABLE public.author_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    pseudonym TEXT NOT NULL,
    biography TEXT NOT NULL,
    short_bio TEXT NOT NULL,
    hero_phrase TEXT NOT NULL,
    photo TEXT DEFAULT '',
    signature TEXT DEFAULT '',
    instagram TEXT DEFAULT '',
    other_social_links JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Posts Table
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('conto', 'cronica', 'poesia')),
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'scheduled')),
    cover_image TEXT DEFAULT '',
    featured BOOLEAN DEFAULT false NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    author_id UUID DEFAULT '00000000-0000-0000-0000-000000000000'::uuid NOT NULL
);

-- Index on post slug for fast routing queries
CREATE INDEX idx_posts_slug ON public.posts (slug);
-- Index on status and published_at for filtering active posts
CREATE INDEX idx_posts_active ON public.posts (status, published_at);

-- 3. Create Tags Table
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Post Tags Join Table
CREATE TABLE public.post_tags (
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- 5. Create Revisions Table
CREATE TABLE public.revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index on revisions post_id
CREATE INDEX idx_revisions_post_id ON public.revisions (post_id);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.author_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revisions ENABLE ROW LEVEL SECURITY;

-- Anonymous users (public readers) can view published and active content
CREATE POLICY "Public profiles are viewable by everyone" ON public.author_profile
    FOR SELECT USING (true);

CREATE POLICY "Public posts are viewable by everyone" ON public.posts
    FOR SELECT USING (
        status = 'published' AND published_at <= timezone('utc'::text, now())
    );

CREATE POLICY "Public tags are viewable by everyone" ON public.tags
    FOR SELECT USING (true);

CREATE POLICY "Public post_tags are viewable by everyone" ON public.post_tags
    FOR SELECT USING (true);

-- Authenticated admins can perform ALL actions
CREATE POLICY "Admins have full access to profile" ON public.author_profile
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to posts" ON public.posts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to tags" ON public.tags
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to post_tags" ON public.post_tags
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to revisions" ON public.revisions
    FOR ALL USING (auth.role() = 'authenticated');
