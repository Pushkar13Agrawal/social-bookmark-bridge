
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAllBookmarks, getBookmarksByPlatform, searchBookmarks, deleteBookmark, Bookmark, SocialPlatform } from "@/utils/bookmarks";
import { User } from "@/utils/auth";
import { useAuth } from "@/context/AuthContext";
import BookmarkGrid from "@/components/bookmarks/BookmarkGrid";
import FilterBar from "@/components/bookmarks/FilterBar";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { useToast } from "@/components/ui/use-toast";
import { Bookmark as BookmarkIcon } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setIsLoading(true);
      try {
        let data: Bookmark[];
        
        if (selectedPlatform === "all") {
          data = await getAllBookmarks();
        } else {
          data = await getBookmarksByPlatform(selectedPlatform);
        }
        
        setBookmarks(data);
        setFilteredBookmarks(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch bookmarks",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBookmarks();
    }
  }, [user, selectedPlatform, toast]);

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
      await deleteBookmark(id);
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
      setFilteredBookmarks(filteredBookmarks.filter(bookmark => bookmark.id !== id));
      toast({
        title: "Success",
        description: "Bookmark removed successfully",
      });
    } catch (error) {
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
            <ProfileDropdown user={user} onLogout={handleLogout} />
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
