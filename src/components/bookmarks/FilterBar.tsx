
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialPlatform } from "@/utils/bookmarks";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Bookmark, Search } from "lucide-react";

interface FilterBarProps {
  selectedPlatform: SocialPlatform | "all";
  onPlatformChange: (platform: SocialPlatform | "all") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedPlatform,
  onPlatformChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <Tabs 
          value={selectedPlatform} 
          onValueChange={(value) => onPlatformChange(value as SocialPlatform | "all")}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-7 w-full sm:w-auto">
            <TabsTrigger value="all" className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">All</span>
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm">
              <Twitter className="h-4 w-4" />
              <span className="hidden sm:inline">Twitter</span>
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm">
              <Facebook className="h-4 w-4" />
              <span className="hidden sm:inline">Facebook</span>
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm">
              <Instagram className="h-4 w-4" />
              <span className="hidden sm:inline">Instagram</span>
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm">
              <Linkedin className="h-4 w-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm">
              <Youtube className="h-4 w-4" />
              <span className="hidden sm:inline">YouTube</span>
            </TabsTrigger>
            <TabsTrigger value="reddit" className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Reddit</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex w-full sm:w-64 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full py-2 text-xs sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
