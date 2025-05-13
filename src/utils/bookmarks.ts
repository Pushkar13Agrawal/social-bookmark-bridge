// Types
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  thumbnail?: string;
  source: SocialPlatform;
  tags?: string[];
  createdAt: Date;
  user_id: string;
}

// Added "chatgpt" and "others" here
export type SocialPlatform = 
  | "twitter" 
  | "facebook" 
  | "instagram" 
  | "linkedin" 
  | "youtube" 
  | "reddit" 
  | "pinterest"
  | "chatgpt"
  | "others";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Get all bookmarks
export const getAllBookmarks = async (): Promise<Bookmark[]> => {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }
    
    return data.map(transformBookmarkData) || [];
  } catch (error) {
    console.error('Error in getAllBookmarks:', error);
    return [];
  }
};

// Get bookmarks by platform
export const getBookmarksByPlatform = async (platform: SocialPlatform): Promise<Bookmark[]> => {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('source', platform)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching bookmarks by platform:', error);
      throw error;
    }
    
    return data.map(transformBookmarkData) || [];
  } catch (error) {
    console.error('Error in getBookmarksByPlatform:', error);
    return [];
  }
};

// Search bookmarks
export const searchBookmarks = async (query: string): Promise<Bookmark[]> => {
  try {
    const normalizedQuery = query.toLowerCase();
    
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .or(`title.ilike.%${normalizedQuery}%,description.ilike.%${normalizedQuery}%`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error searching bookmarks:', error);
      throw error;
    }
    
    return data.map(transformBookmarkData) || [];
  } catch (error) {
    console.error('Error in searchBookmarks:', error);
    return [];
  }
};

// Delete a bookmark
export const deleteBookmark = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting bookmark:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteBookmark:', error);
    return false;
  }
};

// Helper to transform database data to Bookmark type
const transformBookmarkData = (item: any): Bookmark => {
  return {
    id: item.id,
    title: item.title,
    url: item.url,
    description: item.description || '',
    thumbnail: item.thumbnail || '',
    source: item.source,
    tags: item.tags || [],
    createdAt: new Date(item.created_at),
    user_id: item.user_id
  };
};

// Delete default bookmarks
export const deleteDefaultBookmarks = async (userId: string): Promise<boolean> => {
  try {
    // The default bookmarks are the ones created when a user first signs up
    // They have specific URLs from the template sites
    const defaultUrls = [
      'https://react.dev/learn',
      'https://www.typescriptlang.org/docs/',
      'https://tailwindcss.com/docs/installation',
      'https://roadmap.sh/frontend'
    ];
    
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .in('url', defaultUrls);
    
    if (error) {
      console.error('Error deleting default bookmarks:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteDefaultBookmarks:', error);
    return false;
  }
};
