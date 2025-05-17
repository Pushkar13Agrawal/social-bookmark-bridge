
import React, { useState, useEffect } from "react";
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
  const [debouncedUrl, setDebouncedUrl] = useState(url);

  // Debounce URL changes to avoid too many metadata fetches
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUrl(url);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [url]);

  // Fetch metadata when debounced URL changes
  useEffect(() => {
    const fetchMetadata = async () => {
      if (debouncedUrl && !isEdit && debouncedUrl.startsWith('http')) {
        try {
          setIsLoading(true);
          toast.info("Fetching metadata from URL...");
          const metadata = await fetchUrlMetadata(debouncedUrl);
          
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

    fetchMetadata();
  }, [debouncedUrl, isEdit, onMetadataLoad]);

  return (
    <div className="relative">
      <Input
        placeholder="Enter URL"
        value={url}
        onChange={(e) => onChange(e.target.value)}
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
