
import React, { useEffect, useState } from "react";
import { Bookmark } from "@/utils/bookmarks";
import BookmarkCard from "./BookmarkCard";
import { hasUserBookmarks } from "@/utils/bookmarkUtils";
import { useAuth } from "@/context/AuthContext";

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  onRemoveBookmark?: (id: string) => void;
  isLoading?: boolean;
}

const BookmarkGrid: React.FC<BookmarkGridProps> = ({ 
  bookmarks, 
  onRemoveBookmark,
  isLoading = false 
}) => {
  const { user } = useAuth();
  const [hasBookmarks, setHasBookmarks] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      hasUserBookmarks(user.id).then(setHasBookmarks);
    }
  }, [user, bookmarks]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={index}
            className="h-64 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold mb-2">
          {hasBookmarks === false ? 
            "Welcome! Here are some helpful resources to get you started" :
            "No bookmarks found"}
        </h3>
        <p className="text-muted-foreground">
          {hasBookmarks === false ? 
            "Start saving your favorite links by clicking the Add Bookmark button" :
            "Add a bookmark or try different filter options"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map((bookmark) => (
        <BookmarkCard 
          key={bookmark.id} 
          bookmark={bookmark} 
          onRemove={onRemoveBookmark}
        />
      ))}
    </div>
  );
};

export default BookmarkGrid;
