
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Bookmark } from "@/utils/bookmarks";
import { createBookmark, updateBookmark } from "@/utils/bookmarkUtils";
import { useAuth } from "@/context/AuthContext";
import { BookmarkForm } from "./form/BookmarkForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

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
    reminderDate: undefined as Date | undefined,
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

      let bookmarkResult;
      if (bookmark) {
        bookmarkResult = await updateBookmark(bookmark.id, bookmarkData);
      } else {
        bookmarkResult = await createBookmark(bookmarkData);
      }

      // If a reminder date is set, create a reminder
      if (formData.reminderDate && bookmarkResult) {
        const { error: reminderError } = await supabase
          .from('bookmark_reminders')
          .insert({
            bookmark_id: bookmarkResult.id,
            user_id: user.id,
            reminder_time: formData.reminderDate.toISOString(),
          });

        if (reminderError) {
          console.error("Error creating reminder:", reminderError);
          toast({
            title: "Warning",
            description: "Bookmark saved but failed to set reminder",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Success",
        description: `Bookmark ${bookmark ? "updated" : "created"} successfully${formData.reminderDate ? " with reminder" : ""}`,
      });
      
      onSuccess();
      setOpen(false);
      setFormData({
        url: "",
        title: "",
        description: "",
        source: "twitter",
        tags: "",
        reminderDate: undefined,
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
