
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookmarkUrlField } from "./BookmarkUrlField";
import { PlatformSelect } from "./PlatformSelect";
import { SocialPlatform } from "@/utils/bookmarks";

interface BookmarkFormProps {
  formData: {
    url: string;
    title: string;
    description: string;
    source: SocialPlatform;
    tags: string;
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  loading: boolean;
  isEdit?: boolean;
}

export const BookmarkForm: React.FC<BookmarkFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onClose,
  loading,
  isEdit
}) => {
  const handleMetadataLoad = (metadata: { title?: string; description?: string }) => {
    setFormData(prev => ({
      ...prev,
      title: metadata.title || prev.title,
      description: metadata.description || prev.description,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <BookmarkUrlField
          url={formData.url}
          onChange={(url) => setFormData(prev => ({ ...prev, url }))}
          onMetadataLoad={handleMetadataLoad}
          disabled={loading}
          isEdit={isEdit}
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
          disabled={loading}
        />
      </div>
      <div>
        <PlatformSelect
          value={formData.source}
          onChange={(value) => setFormData(prev => ({ ...prev, source: value }))}
          disabled={loading}
        />
      </div>
      <div>
        <Input
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          disabled={loading}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose} type="button" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update" : "Save"}
        </Button>
      </div>
    </form>
  );
};
