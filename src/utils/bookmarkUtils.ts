import { supabase } from "@/integrations/supabase/client";
import type { Bookmark, SocialPlatform } from "./bookmarks";

export async function fetchUrlMetadata(url: string) {
  try {
    // Special handling for YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) {
        const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
        if (response.ok) {
          const data = await response.json();
          return {
            title: data.title,
            description: data.author_name ? `By ${data.author_name}` : '',
            thumbnail: data.thumbnail_url || ''
          };
        }
      }
    }

    // First try using link preview API for faster and more reliable results
    const previewResponse = await fetch(`https://api.linkpreview.net/?q=${encodeURIComponent(url)}`, {
      method: 'POST',
      mode: 'cors',
    });

    if (previewResponse.ok) {
      const data = await previewResponse.json();
      return {
        title: data.title || url,
        description: data.description || '',
        thumbnail: data.image || ''
      };
    }

    // Fallback to allorigins if link preview fails
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch URL');
    }
    
    const data = await response.json();
    const html = data.contents;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Enhanced title extraction with better fallbacks
    const title = 
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
      doc.querySelector('title')?.textContent?.trim() ||
      doc.querySelector('h1')?.textContent?.trim() ||
      new URL(url).hostname;
      
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

    return { 
      title: title || new URL(url).hostname,
      description: description || '', 
      thumbnail: thumbnail || '' 
    };
  } catch (error) {
    console.error('Error fetching URL metadata:', error);
    try {
      const hostname = new URL(url).hostname;
      return { 
        title: hostname,
        description: '',
        thumbnail: ''
      };
    } catch {
      return { 
        title: url,
        description: '',
        thumbnail: ''
      };
    }
  }
}

function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
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
      user_id: bookmark.user_id
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

export async function hasUserBookmarks(userId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('bookmarks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error checking user bookmarks:', error);
    return false;
  }
  
  return count !== null && count > 0;
}
