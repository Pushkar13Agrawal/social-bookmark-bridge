
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Bookmark } from "@/utils/bookmarks";
import { createBookmark, updateBookmark } from "@/utils/bookmarkUtils";
import { useAuth } from "@/context/AuthContext";
import { BookmarkForm } from "./form/BookmarkForm";

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
    source: bookmark?.source || "twitter",
    tags: bookmark?.tags?.join(", ") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save bookmarks",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const bookmarkData = {
        url: formData.url,
        title: formData.title,
        description: formData.description,
        source: formData.source,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        user_id: user.id,
        thumbnail: "",
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
      setFormData({
        url: "",
        title: "",
        description: "",
        source: "twitter",
        tags: "",
      });
    } catch (error) {
      console.error("Error saving bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to save bookmark: " + (error instanceof Error ? error.message : "Unknown error"),
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
        <BookmarkForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={() => setOpen(false)}
          loading={loading}
          isEdit={!!bookmark}
        />
      </DialogContent>
    </Dialog>
  );
}
