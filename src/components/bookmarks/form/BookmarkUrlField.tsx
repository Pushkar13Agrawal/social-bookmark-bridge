
import React from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { fetchUrlMetadata } from "@/utils/bookmarkUtils";

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
  const handleUrlChange = async (url: string) => {
    onChange(url);
    if (url && !isEdit && url.startsWith('http')) {
      try {
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
      }
    }
  };

  return (
    <Input
      placeholder="Enter URL"
      value={url}
      onChange={(e) => handleUrlChange(e.target.value)}
      disabled={disabled}
      required
    />
  );
};
