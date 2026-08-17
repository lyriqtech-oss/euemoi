import { createClient } from '@supabase/supabase-js';
import { Post, Tag, AuthorProfile, INITIAL_POSTS, INITIAL_TAGS, INITIAL_AUTHOR_PROFILE } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// KEYS FOR LOCAL STORAGE
const LS_POSTS_KEY = 'euemoi_posts';
const LS_PROFILE_KEY = 'euemoi_profile';
const LS_TAGS_KEY = 'euemoi_tags';
const LS_REVISIONS_KEY = 'euemoi_revisions';

// HELPER: Get mock data from localStorage or fallback
const getLSData = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Error reading localStorage key: ' + key, error);
    return fallback;
  }
};

const setLSData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing localStorage key: ' + key, error);
  }
};

// ==========================================
// DB API
// ==========================================

export const db = {
  // --- POSTS ---
  async getPosts(options?: {
    type?: 'conto' | 'cronica' | 'poesia';
    includeDrafts?: boolean;
    query?: string;
    tag?: string;
  }): Promise<Post[]> {
    if (isSupabaseConfigured && supabase) {
      let queryBuilder = supabase
        .from('posts')
        .select('*, post_tags(tags(*))')
        .order('published_at', { ascending: false });

      if (options?.type) {
        queryBuilder = queryBuilder.eq('type', options.type);
      }
      if (!options?.includeDrafts) {
        queryBuilder = queryBuilder.eq('status', 'published');
        // Filter out future scheduled posts
        queryBuilder = queryBuilder.lte('published_at', new Date().toISOString());
      }
      
      const { data, error } = await queryBuilder;
      if (error) throw error;

      let posts = (data || []).map((p: any) => ({
        ...p,
        tags: p.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || []
      })) as Post[];

      if (options?.query) {
        const q = options.query.toLowerCase();
        posts = posts.filter(
          p =>
            p.title.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q)
        );
      }

      if (options?.tag) {
        posts = posts.filter(p => p.tags?.some(t => t.slug === options.tag));
      }

      return posts;
    } else {
      // Mock / Offline Mode
      let posts = getLSData<Post[]>(LS_POSTS_KEY, INITIAL_POSTS);

      // Filter drafts & scheduling
      if (!options?.includeDrafts) {
        const now = new Date();
        posts = posts.filter(
          p => p.status === 'published' && new Date(p.published_at) <= now
        );
      }

      // Filter by type
      if (options?.type) {
        posts = posts.filter(p => p.type === options.type);
      }

      // Filter by tag slug
      if (options?.tag) {
        posts = posts.filter(p => p.tags?.some(t => t.slug === options.tag));
      }

      // Filter by search query
      if (options?.query) {
        const q = options.query.toLowerCase();
        posts = posts.filter(
          p =>
            p.title.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            p.tags?.some(t => t.name.toLowerCase().includes(q))
        );
      }

      // Sort by date descending
      return [...posts].sort(
        (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
    }
  },

  async getPostBySlug(slug: string): Promise<Post | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('posts')
        .select('*, post_tags(tags(*))')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return {
        ...data,
        tags: data.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || []
      } as Post;
    } else {
      const posts = getLSData<Post[]>(LS_POSTS_KEY, INITIAL_POSTS);
      const post = posts.find(p => p.slug === slug);
      return post || null;
    }
  },

  async getPostById(id: string): Promise<Post | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('posts')
        .select('*, post_tags(tags(*))')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return {
        ...data,
        tags: data.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || []
      } as Post;
    } else {
      const posts = getLSData<Post[]>(LS_POSTS_KEY, INITIAL_POSTS);
      return posts.find(p => p.id === id) || null;
    }
  },

  async savePost(
    postData: Omit<Post, 'created_at' | 'updated_at' | 'id'> & {
      id?: string;
      created_at?: string;
      updated_at?: string;
    }
  ): Promise<Post> {
    const now = new Date().toISOString();
    let id = postData.id;
    if (!id) {
      if (isSupabaseConfigured) {
        id = typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "00000000-0000-0000-0000-" + Math.random().toString(16).slice(2, 14).padStart(12, "0");
      } else {
        id = `post-${Date.now()}`;
      }
    }
    
    const postToSave: Post = {
      ...postData,
      id,
      created_at: postData.created_at || now,
      updated_at: now,
      published_at: postData.published_at || now,
      author_id: postData.author_id || (isSupabaseConfigured ? "d7b21e84-18be-4054-9cf9-7e3e9d8b7244" : "author-1")
    };

    if (isSupabaseConfigured && supabase) {
      const { tags, ...supabasePost } = postToSave;
      
      const { data, error } = await supabase
        .from('posts')
        .upsert({
          ...supabasePost,
          updated_at: now
        })
        .select()
        .single();

      if (error) throw error;

      // Handle tags association
      if (tags) {
        // Clear old post tags
        await supabase.from('post_tags').delete().eq('post_id', id);
        
        // Insert new associations
        if (tags.length > 0) {
          const associations = tags.map(t => ({ post_id: id, tag_id: t.id }));
          const { error: assocError } = await supabase
            .from('post_tags')
            .insert(associations);
          if (assocError) throw assocError;
        }
      }

      return { ...data, tags: tags || [] } as Post;
    } else {
      const posts = getLSData<Post[]>(LS_POSTS_KEY, INITIAL_POSTS);
      const existingIndex = posts.findIndex(p => p.id === id);

      if (existingIndex > -1) {
        posts[existingIndex] = postToSave;
      } else {
        posts.push(postToSave);
      }

      setLSData(LS_POSTS_KEY, posts);
      
      // Save a revision
      await this.saveRevision(id, postToSave.content);

      return postToSave;
    }
  },

  async deletePost(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      return true;
    } else {
      const posts = getLSData<Post[]>(LS_POSTS_KEY, INITIAL_POSTS);
      const filtered = posts.filter(p => p.id !== id);
      setLSData(LS_POSTS_KEY, filtered);
      return true;
    }
  },

  // --- AUTHOR PROFILE ---
  async getProfile(): Promise<AuthorProfile> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('author_profile')
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // If profile table empty, populate with default
          const { data: newProfile, error: createError } = await supabase
            .from('author_profile')
            .insert({ id: 'd7b21e84-18be-4054-9cf9-7e3e9d8b7244', ...INITIAL_AUTHOR_PROFILE })
            .select()
            .single();
          if (createError) throw createError;
          return newProfile as AuthorProfile;
        }
        throw error;
      }
      return data as AuthorProfile;
    } else {
      return getLSData<AuthorProfile>(LS_PROFILE_KEY, INITIAL_AUTHOR_PROFILE);
    }
  },

  async updateProfile(profile: AuthorProfile): Promise<AuthorProfile> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('author_profile')
        .upsert({ id: 'd7b21e84-18be-4054-9cf9-7e3e9d8b7244', ...profile })
        .select()
        .single();

      if (error) throw error;
      return data as AuthorProfile;
    } else {
      setLSData(LS_PROFILE_KEY, profile);
      return profile;
    }
  },

  // --- TAGS ---
  async getTags(): Promise<Tag[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return data as Tag[];
    } else {
      return getLSData<Tag[]>(LS_TAGS_KEY, INITIAL_TAGS);
    }
  },

  async saveTag(tagData: Omit<Tag, 'id'> & { id?: string }): Promise<Tag> {
    const id = tagData.id || `tag-${Date.now()}`;
    const tag: Tag = { ...tagData, id };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('tags')
        .upsert(tag)
        .select()
        .single();
      if (error) throw error;
      return data as Tag;
    } else {
      const tags = getLSData<Tag[]>(LS_TAGS_KEY, INITIAL_TAGS);
      const existingIndex = tags.findIndex(t => t.id === id);

      if (existingIndex > -1) {
        tags[existingIndex] = tag;
      } else {
        tags.push(tag);
      }

      setLSData(LS_TAGS_KEY, tags);
      return tag;
    }
  },

  // --- REVISIONS ---
  async getRevisions(postId: string): Promise<{ id: string; post_id: string; content: string; created_at: string }[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('revisions')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const allRevisions = getLSData<any[]>(LS_REVISIONS_KEY, []);
      return allRevisions
        .filter(r => r.post_id === postId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  },

  async saveRevision(postId: string, content: string): Promise<void> {
    const now = new Date().toISOString();
    const id = `revision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('revisions')
        .insert({ id, post_id: postId, content, created_at: now });
    } else {
      const revisions = getLSData<any[]>(LS_REVISIONS_KEY, []);
      
      // Limit to max 10 revisions per post to avoid filling localStorage
      const postRevs = revisions.filter(r => r.post_id === postId);
      if (postRevs.length >= 10) {
        // Remove oldest
        postRevs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        const oldestId = postRevs[0].id;
        const index = revisions.findIndex(r => r.id === oldestId);
        if (index > -1) revisions.splice(index, 1);
      }

      revisions.push({ id, post_id: postId, content, created_at: now });
      setLSData(LS_REVISIONS_KEY, revisions);
    }
  }
};
