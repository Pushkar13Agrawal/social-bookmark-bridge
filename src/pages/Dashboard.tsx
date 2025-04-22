import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAllBookmarks, getBookmarksByPlatform, searchBookmarks, deleteBookmark, Bookmark, SocialPlatform } from "@/utils/bookmarks";
import { useAuth } from "@/context/AuthContext";
import BookmarkGrid from "@/components/bookmarks/BookmarkGrid";
import FilterBar from "@/components/bookmarks/FilterBar";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { toast } from "sonner";
import { Bookmark as BookmarkIcon, Plus, Undo2 } from "lucide-react";
import BookmarkFormModal from "@/components/bookmarks/BookmarkFormModal";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletedBookmark, setDeletedBookmark] = useState<Bookmark | null>(null);
  const [undoTimeoutId, setUndoTimeoutId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        let data: Bookmark[];
        
        if (selectedPlatform === "all") {
          data = await getAllBookmarks();
        } else {
          data = await getBookmarksByPlatform(selectedPlatform);
        }
        
        console.log("Fetched bookmarks:", data);
        setBookmarks(data);
        
        if (!searchQuery.trim()) {
          setFilteredBookmarks(data);
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        toast.error("Failed to fetch bookmarks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [user, selectedPlatform]);

  useEffect(() => {
    const filterBookmarks = async () => {
      if (!searchQuery.trim()) {
        setFilteredBookmarks(bookmarks);
        return;
      }
      
      setIsLoading(true);
      try {
        const results = await searchBookmarks(searchQuery);
        setFilteredBookmarks(results);
      } catch (error) {
        console.error("Error searching bookmarks:", error);
        toast.error("Failed to search bookmarks");
      } finally {
        setIsLoading(false);
      }
    };

    filterBookmarks();
  }, [searchQuery, bookmarks]);

  const handlePlatformChange = (platform: SocialPlatform | "all") => {
    setSelectedPlatform(platform);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleRemoveBookmark = async (id: string) => {
    const bookmarkToDelete = bookmarks.find(b => b.id === id);
    if (!bookmarkToDelete) return;

    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
    setFilteredBookmarks(filteredBookmarks.filter(bookmark => bookmark.id !== id));
    
    setDeletedBookmark(bookmarkToDelete);

    if (undoTimeoutId) {
      clearTimeout(undoTimeoutId);
    }

    toast.info("Bookmark deleted", {
      description: "Click undo to restore the bookmark",
      action: {
        label: "Undo",
        onClick: () => handleUndoDelete()
      },
      duration: 5000
    });

    const timeoutId = window.setTimeout(async () => {
      if (deletedBookmark?.id === id) {
        try {
          await deleteBookmark(id);
          setDeletedBookmark(null);
        } catch (error) {
          console.error("Error removing bookmark:", error);
          toast.error("Failed to remove bookmark");
          setBookmarks(prev => [...prev, bookmarkToDelete]);
          setFilteredBookmarks(prev => [...prev, bookmarkToDelete]);
        }
      }
    }, 5000);

    setUndoTimeoutId(timeoutId);
  };

  const handleUndoDelete = () => {
    if (deletedBookmark) {
      setBookmarks(prev => [...prev, deletedBookmark]);
      setFilteredBookmarks(prev => [...prev, deletedBookmark]);
      
      setDeletedBookmark(null);
      
      if (undoTimeoutId) {
        clearTimeout(undoTimeoutId);
        setUndoTimeoutId(null);
      }

      toast.success("Bookmark restored");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBookmarkSuccess = () => {
    if (selectedPlatform === "all") {
      getAllBookmarks().then(data => {
        setBookmarks(data);
        if (!searchQuery.trim()) {
          setFilteredBookmarks(data);
        }
      });
    } else {
      getBookmarksByPlatform(selectedPlatform).then(data => {
        setBookmarks(data);
        if (!searchQuery.trim()) {
          setFilteredBookmarks(data);
        }
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-2 sm:px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookmarkIcon className="h-6 w-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold whitespace-nowrap">
              Social Bookmark Bridge
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <BookmarkFormModal
              onSuccess={handleBookmarkSuccess}
              trigger={
                <Button className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                  <Plus className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Add Bookmark</span>
                  <span className="inline sm:hidden">Add</span>
                </Button>
              }
            />
            {user && <ProfileDropdown user={user} onLogout={handleLogout} />}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
            Your Bookmarks
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage all your saved content from across the web
          </p>
        </div>
        
        <FilterBar 
          selectedPlatform={selectedPlatform}
          onPlatformChange={handlePlatformChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        
        <BookmarkGrid 
          bookmarks={filteredBookmarks}
          onRemoveBookmark={handleRemoveBookmark}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default Dashboard;
