import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bookmark, SocialPlatform } from "@/utils/bookmarks";
import { fetchUrlMetadata, createBookmark, updateBookmark } from "@/utils/bookmarkUtils";
import { useAuth } from "@/context/AuthContext";

interface BookmarkFormModalProps {
  bookmark?: Bookmark;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export default function BookmarkFormModal({ bookmark, onSuccess, trigger }: BookmarkFormModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    url: bookmark?.url || "",
    title: bookmark?.title || "",
    description: bookmark?.description || "",
    source: bookmark?.source || "twitter" as SocialPlatform,
    tags: bookmark?.tags?.join(", ") || "",
  });

  const handleUrlChange = async (url: string) => {
    setFormData(prev => ({ ...prev, url }));
    if (url && !bookmark) { // Only fetch metadata for new bookmarks
      try {
        setLoading(true);
        const metadata = await fetchUrlMetadata(url);
        setFormData(prev => ({
          ...prev,
          title: metadata.title || prev.title,
          description: metadata.description || prev.description,
        }));
      } catch (error) {
        console.error("Error fetching metadata:", error);
        toast({
          title: "Error",
          description: "Failed to fetch URL metadata",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const bookmarkData = {
        url: formData.url,
        title: formData.title,
        description: formData.description,
        source: formData.source,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        user_id: user.id,
      };

      if (bookmark) {
        await updateBookmark(bookmark.id, bookmarkData);
        toast({ title: "Success", description: "Bookmark updated successfully" });
      } else {
        await createBookmark(bookmarkData);
        toast({ title: "Success", description: "Bookmark created successfully" });
      }
      
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Error saving bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to save bookmark",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Add Bookmark</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{bookmark ? "Edit Bookmark" : "Add New Bookmark"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Enter URL"
              value={formData.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div>
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              disabled={loading}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div>
            <Select
              value={formData.source}
              onValueChange={(value: SocialPlatform) => 
                setFormData(prev => ({ ...prev, source: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="reddit">Reddit</SelectItem>
                <SelectItem value="pinterest">Pinterest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              placeholder="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : bookmark ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
