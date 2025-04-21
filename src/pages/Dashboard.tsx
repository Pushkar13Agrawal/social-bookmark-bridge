
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAllBookmarks, getBookmarksByPlatform, searchBookmarks, deleteBookmark, Bookmark, SocialPlatform } from "@/utils/bookmarks";
import { useAuth } from "@/context/AuthContext";
import BookmarkGrid from "@/components/bookmarks/BookmarkGrid";
import FilterBar from "@/components/bookmarks/FilterBar";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { useToast } from "@/hooks/use-toast";
import { Bookmark as BookmarkIcon, Plus } from "lucide-react";
import BookmarkFormModal from "@/components/bookmarks/BookmarkFormModal";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch bookmarks based on selected platform
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
        
        // If no search query is active, update filtered bookmarks too
        if (!searchQuery.trim()) {
          setFilteredBookmarks(data);
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        toast({
          title: "Error",
          description: "Failed to fetch bookmarks",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [user, selectedPlatform, toast]);

  // Handle search filtering
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
        toast({
          title: "Error",
          description: "Failed to search bookmarks",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    filterBookmarks();
  }, [searchQuery, bookmarks, toast]);

  const handlePlatformChange = (platform: SocialPlatform | "all") => {
    setSelectedPlatform(platform);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleRemoveBookmark = async (id: string) => {
    try {
      const success = await deleteBookmark(id);
      if (success) {
        setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
        setFilteredBookmarks(filteredBookmarks.filter(bookmark => bookmark.id !== id));
        toast({
          title: "Success",
          description: "Bookmark removed successfully",
        });
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to remove bookmark",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBookmarkSuccess = () => {
    // Refetch all bookmarks after creating a new one
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

  // Show loading state while checking authentication
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookmarkIcon className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Social Bookmark Bridge</h1>
          </div>
          <div className="flex items-center space-x-4">
            <BookmarkFormModal
              onSuccess={handleBookmarkSuccess}
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Bookmark
                </Button>
              }
            />
            {user && <ProfileDropdown user={user} onLogout={handleLogout} />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Your Bookmarks</h2>
          <p className="text-muted-foreground">
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
