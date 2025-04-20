
import { supabase } from "@/integrations/supabase/client";
import type { Bookmark, SocialPlatform } from "./bookmarks";

export async function fetchUrlMetadata(url: string) {
  try {
    // Using allorigins as a CORS proxy with JSON response
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch URL');
    }
    
    const data = await response.json();
    const html = data.contents;
    
    // Create a DOM parser and parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // More robust title extraction with multiple fallbacks
    const title = 
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
      doc.querySelector('title')?.textContent?.trim() ||
      doc.querySelector('h1')?.textContent?.trim() ||
      url;
      
    const description = 
      doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
      '';
      
    const thumbnail = 
      doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
      doc.querySelector('meta[property="og:image:url"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
      doc.querySelector('link[rel="icon"]')?.getAttribute('href') ||
      '';

    console.log('Extracted metadata:', { title, description, thumbnail });
    
    return { 
      title: title || url, 
      description: description || '', 
      thumbnail: thumbnail || '' 
    };
  } catch (error) {
    console.error('Error fetching URL metadata:', error);
    return { 
      title: url,
      description: '',
      thumbnail: ''
    };
  }
}

export async function createBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) {
  // Ensure user_id is a valid UUID string by validating it
  if (!bookmark.user_id || typeof bookmark.user_id !== 'string' || bookmark.user_id.length < 10) {
    throw new Error('Invalid user ID format');
  }

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
