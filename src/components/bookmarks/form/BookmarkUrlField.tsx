
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { fetchUrlMetadata } from "@/utils/bookmarkUtils";
import { Loader2 } from "lucide-react";

interface BookmarkUrlFieldProps {
  url: string;
  onChange: (url: string) => void;
  onMetadataLoad: (metadata: { title?: string; description?: string }) => void;
  disabled?: boolean;
  isEdit?: boolean;
}

export const BookmarkUrlField: React.FC<BookmarkUrlFieldProps> = ({
  url,
  onChange,
  onMetadataLoad,
  disabled,
  isEdit
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlChange = async (url: string) => {
    onChange(url);
    if (url && !isEdit && url.startsWith('http')) {
      try {
        setIsLoading(true);
        toast.info("Fetching metadata from URL...");
        const metadata = await fetchUrlMetadata(url);
        
        if (metadata.title || metadata.description) {
          onMetadataLoad(metadata);
          toast.success("URL metadata loaded successfully");
        } else {
          toast.info("Could not extract title from URL");
        }
      } catch (error) {
        console.error("Error fetching metadata:", error);
        toast.error("Failed to fetch URL metadata");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative">
      <Input
        placeholder="Enter URL"
        value={url}
        onChange={(e) => handleUrlChange(e.target.value)}
        disabled={disabled}
        required
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  );
};
