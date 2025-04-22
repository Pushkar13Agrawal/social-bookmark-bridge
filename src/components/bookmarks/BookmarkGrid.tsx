
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

  // Improved: More responsive classes (1 col xs, 2 sm, 3 md, 4 lg+)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={index}
            className="h-36 xs:h-44 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-2 sm:px-0">
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center break-words">
          {hasBookmarks === false ? 
            "Welcome! Here are some helpful resources to get you started" :
            "No bookmarks found"}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground text-center break-words">
          {hasBookmarks === false ? 
            "Start saving your favorite links by clicking the Add Bookmark button" :
            "Add a bookmark or try different filter options"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
