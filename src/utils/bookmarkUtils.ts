
import { supabase } from "@/integrations/supabase/client";
import type { Bookmark, SocialPlatform } from "./bookmarks";

export async function fetchUrlMetadata(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    return {
      title: doc.querySelector('title')?.textContent || '',
      description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      thumbnail: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
    };
  } catch (error) {
    console.error('Error fetching URL metadata:', error);
    return { title: '', description: '', thumbnail: '' };
  }
}

export async function createBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert([bookmark])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBookmark(id: string, bookmark: Partial<Bookmark>) {
  const { data, error } = await supabase
    .from('bookmarks')
    .update(bookmark)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
