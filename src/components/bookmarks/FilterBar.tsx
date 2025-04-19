
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
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <Tabs 
          value={selectedPlatform} 
          onValueChange={(value) => onPlatformChange(value as SocialPlatform | "all")}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full md:w-auto">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              <span className="hidden md:inline">All</span>
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center gap-1">
              <Twitter className="h-4 w-4" />
              <span className="hidden md:inline">Twitter</span>
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center gap-1">
              <Facebook className="h-4 w-4" />
              <span className="hidden md:inline">Facebook</span>
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center gap-1">
              <Instagram className="h-4 w-4" />
              <span className="hidden md:inline">Instagram</span>
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-1">
              <Linkedin className="h-4 w-4" />
              <span className="hidden md:inline">LinkedIn</span>
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-1">
              <Youtube className="h-4 w-4" />
              <span className="hidden md:inline">YouTube</span>
            </TabsTrigger>
            <TabsTrigger value="reddit" className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              <span className="hidden md:inline">Reddit</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex w-full md:w-64 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
