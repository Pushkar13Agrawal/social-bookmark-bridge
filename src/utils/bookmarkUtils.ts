
import { supabase } from "@/integrations/supabase/client";
import type { Bookmark, SocialPlatform } from "./bookmarks";

export async function fetchUrlMetadata(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch URL');
    }
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const title = doc.querySelector('title')?.textContent || '';
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const thumbnail = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
    
    return { title, description, thumbnail };
  } catch (error) {
    console.error('Error fetching URL metadata:', error);
    return { title: '', description: '', thumbnail: '' };
  }
}

export async function createBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) {
  // Convert camelCase to snake_case for Supabase
  const { data, error } = await supabase
    .from('bookmarks')
    .insert({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      source: bookmark.source,
      tags: bookmark.tags,
      thumbnail: bookmark.thumbnail,
      user_id: bookmark.user_id // Ensure user_id is included
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBookmark(id: string, bookmark: Partial<Bookmark>) {
  // Convert camelCase to snake_case for Supabase
  const bookmarkData: Record<string, any> = {};
  
  if (bookmark.title) bookmarkData.title = bookmark.title;
  if (bookmark.url) bookmarkData.url = bookmark.url;
  if (bookmark.description) bookmarkData.description = bookmark.description;
  if (bookmark.source) bookmarkData.source = bookmark.source;
  if (bookmark.tags) bookmarkData.tags = bookmark.tags;
  if (bookmark.thumbnail) bookmarkData.thumbnail = bookmark.thumbnail;
  if (bookmark.user_id) bookmarkData.user_id = bookmark.user_id;
  
  const { data, error } = await supabase
    .from('bookmarks')
    .update(bookmarkData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
