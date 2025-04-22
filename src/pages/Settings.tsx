
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { deleteBookmark, getAllBookmarks } from "@/utils/bookmarks";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    toast(next ? "Dark mode enabled" : "Light mode enabled");
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all bookmarks?")) return;
    setDeleting(true);
    try {
      const all = await getAllBookmarks();
      await Promise.all(all.map(b => deleteBookmark(b.id)));
      toast.success("All bookmarks deleted!");
    } catch {
      toast.error("Failed to delete all bookmarks!");
    }
    setDeleting(false);
  };

  return (
    <div className="container mx-auto max-w-lg py-8">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className="mb-8 flex items-center justify-between">
        <span>Dark Mode</span>
        <Switch checked={isDarkMode} onCheckedChange={handleThemeToggle} />
      </div>
      <Button
        variant="destructive"
        disabled={deleting}
        onClick={handleDeleteAll}
        className="w-full"
      >
        {deleting ? "Deleting..." : "Delete all Bookmarks"}
      </Button>
      <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </Button>
    </div>
  );
};

export default Settings;
