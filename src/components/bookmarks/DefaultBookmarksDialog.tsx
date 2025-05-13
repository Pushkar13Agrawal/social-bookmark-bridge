
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DefaultBookmarksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DefaultBookmarksDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: DefaultBookmarksDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Default Bookmarks?</AlertDialogTitle>
          <AlertDialogDescription>
            You've just added your first bookmark! Would you like to delete the default 
            example bookmarks that were created for you, or would you like to keep them?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Keep Them</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete Defaults</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
