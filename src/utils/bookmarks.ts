
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
  user_id: string; // Add user_id field to match Supabase schema
}

export type SocialPlatform = 
  | "twitter" 
  | "facebook" 
  | "instagram" 
  | "linkedin" 
  | "youtube" 
  | "reddit" 
  | "pinterest";

// Mock bookmarks data
const mockBookmarks: Bookmark[] = [
  {
    id: "1",
    title: "Getting Started with React",
    url: "https://reactjs.org/docs/getting-started.html",
    description: "Learn the basics of React from the official documentation",
    thumbnail: "https://reactjs.org/logo-og.png",
    source: "twitter",
    tags: ["react", "javascript", "web-development"],
    createdAt: new Date("2023-05-15"),
    user_id: "12345", // Added user_id
  },
  {
    id: "2",
    title: "10 TypeScript Tips and Tricks",
    url: "https://example.com/typescript-tips",
    description: "Improve your TypeScript skills with these tips and tricks",
    source: "facebook",
    tags: ["typescript", "javascript", "programming"],
    createdAt: new Date("2023-06-22"),
    user_id: "12345", // Added user_id
  },
  {
    id: "3",
    title: "Tailwind CSS Tutorial",
    url: "https://example.com/tailwind-tutorial",
    description: "Learn how to use Tailwind CSS to build beautiful UIs",
    thumbnail: "https://tailwindcss.com/img/tailwind-twitter-card.jpg",
    source: "instagram",
    tags: ["css", "tailwind", "web-design"],
    createdAt: new Date("2023-07-10"),
    user_id: "12345", // Added user_id
  },
  {
    id: "4",
    title: "The Future of Web Development",
    url: "https://example.com/future-web-dev",
    description: "Exploring emerging trends in web development",
    source: "linkedin",
    tags: ["web-development", "future", "technology"],
    createdAt: new Date("2023-08-05"),
    user_id: "12345", // Added user_id
  },
  {
    id: "5",
    title: "Mastering JavaScript Array Methods",
    url: "https://example.com/js-array-methods",
    description: "A deep dive into JavaScript array methods",
    source: "reddit",
    tags: ["javascript", "programming", "arrays"],
    createdAt: new Date("2023-09-18"),
    user_id: "12345", // Added user_id
  },
  {
    id: "6",
    title: "Building Accessible Web Applications",
    url: "https://example.com/accessibility",
    description: "Best practices for building accessible web applications",
    source: "twitter",
    tags: ["accessibility", "web-development", "a11y"],
    createdAt: new Date("2023-10-12"),
    user_id: "12345", // Added user_id
  },
  {
    id: "7",
    title: "Introduction to GraphQL",
    url: "https://example.com/graphql-intro",
    description: "Learn the basics of GraphQL and how it differs from REST",
    source: "youtube",
    tags: ["graphql", "api", "web-development"],
    createdAt: new Date("2023-11-05"),
    user_id: "12345", // Added user_id
  },
  {
    id: "8",
    title: "CSS Grid Layout Tutorial",
    url: "https://example.com/css-grid",
    description: "Master CSS Grid layout with this comprehensive tutorial",
    source: "pinterest",
    tags: ["css", "web-design", "layout"],
    createdAt: new Date("2023-12-01"),
    user_id: "12345", // Added user_id
  },
];

// Get all bookmarks
export const getAllBookmarks = (): Promise<Bookmark[]> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve(mockBookmarks);
    }, 800);
  });
};

// Get bookmarks by platform
export const getBookmarksByPlatform = (platform: SocialPlatform): Promise<Bookmark[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = mockBookmarks.filter(bookmark => bookmark.source === platform);
      resolve(filtered);
    }, 500);
  });
};

// Search bookmarks
export const searchBookmarks = (query: string): Promise<Bookmark[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase();
      const results = mockBookmarks.filter(bookmark => 
        bookmark.title.toLowerCase().includes(normalizedQuery) ||
        (bookmark.description && bookmark.description.toLowerCase().includes(normalizedQuery)) ||
        (bookmark.tags && bookmark.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)))
      );
      resolve(results);
    }, 500);
  });
};

// Add a new bookmark
export const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Promise<Bookmark> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBookmark: Bookmark = {
        ...bookmark,
        id: (mockBookmarks.length + 1).toString(),
        createdAt: new Date(),
      };
      mockBookmarks.push(newBookmark);
      resolve(newBookmark);
    }, 500);
  });
};

// Delete a bookmark
export const deleteBookmark = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockBookmarks.findIndex(bookmark => bookmark.id === id);
      if (index !== -1) {
        mockBookmarks.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};
