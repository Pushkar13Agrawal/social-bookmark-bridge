
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { resetPassword } from "@/utils/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getAllBookmarks } from "@/utils/bookmarks";
import { createBookmark, fetchUrlMetadata } from "@/utils/bookmarkUtils";

const Profile = () => {
  const { user, setCurrentUser } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [profilePic, setProfilePic] = useState<string>("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "html">("json");
  const [importContent, setImportContent] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNameChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you should make a request to update the user's name using supabase
    toast({
      title: "Success",
      description: "Name updated successfully!",
    });
    setCurrentUser({ ...user!, user_metadata: { ...user!.user_metadata, full_name: name } });
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Here you can upload to storage, etc.
    setProfilePic(URL.createObjectURL(file));
    toast({
      title: "Success",
      description: "Profile picture updated! (Simulated)",
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    
    if (!password.trim()) {
      setPasswordError("Please enter a new password");
      return;
    }
    
    if (password === currentPassword) {
      setPasswordError("New password must be different from the current password");
      return;
    }

    try {
      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      setPassword("");
      setCurrentPassword("");
      toast({
        title: "Success",
        description: "Password updated successfully!",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "Unable to find your email address",
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);
    try {
      await resetPassword(user.email);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a link to reset your password.",
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleExportBookmarks = async () => {
    setIsExporting(true);
    try {
      const bookmarks = await getAllBookmarks();
      
      let content: string;
      let fileName: string;
      let mimeType: string;
      
      switch (exportFormat) {
        case 'json':
          content = JSON.stringify(bookmarks, null, 2);
          fileName = 'bookmarks.json';
          mimeType = 'application/json';
          break;
        case 'csv':
          // Create CSV header
          const header = 'Title,URL,Description,Source,Created At\n';
          // Map bookmarks to CSV rows
          const csvRows = bookmarks.map(bookmark => 
            `"${bookmark.title.replace(/"/g, '""')}","${bookmark.url}","${(bookmark.description || '').replace(/"/g, '""')}","${bookmark.source}","${bookmark.createdAt}"`
          ).join('\n');
          content = header + csvRows;
          fileName = 'bookmarks.csv';
          mimeType = 'text/csv';
          break;
        case 'html':
          // Create HTML bookmarks file
          const htmlBookmarks = bookmarks.map(bookmark => 
            `<li><a href="${bookmark.url}">${bookmark.title}</a> - ${bookmark.description || ''}</li>`
          ).join('\n');
          content = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
          <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
          <TITLE>Bookmarks</TITLE>
          <H1>Bookmarks</H1>
          <DL><p>
            <DT><H3>Exported Bookmarks</H3>
            <DL><p>
              ${htmlBookmarks}
            </DL><p>
          </DL>`;
          fileName = 'bookmarks.html';
          mimeType = 'text/html';
          break;
      }
      
      // Create a blob with the file content
      const blob = new Blob([content], { type: mimeType });
      
      // Create a link element and trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      
      toast({
        title: "Success",
        description: `Bookmarks exported as ${fileName}`,
      });
    } catch (error) {
      console.error("Error exporting bookmarks:", error);
      toast({
        title: "Error",
        description: "Failed to export bookmarks",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportBookmarks = async () => {
    if (!importContent.trim() || !user?.id) {
      toast({
        title: "Error",
        description: "Please enter valid bookmark data",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      let bookmarksToImport = [];

      try {
        // First try parsing as JSON
        const parsed = JSON.parse(importContent);
        if (Array.isArray(parsed)) {
          bookmarksToImport = parsed;
        } else if (parsed.bookmarks && Array.isArray(parsed.bookmarks)) {
          bookmarksToImport = parsed.bookmarks;
        } else {
          bookmarksToImport = [parsed]; // Single bookmark object
        }
      } catch (e) {
        // If not JSON, try parsing as CSV
        if (importContent.includes(',')) {
          const lines = importContent.split('\n').filter(line => line.trim());
          // Skip header if present
          const startIndex = lines[0].toLowerCase().includes('title') ? 1 : 0;
          
          for (let i = startIndex; i < lines.length; i++) {
            const parts = lines[i].split(',').map(part => part.trim().replace(/^"|"$/g, ''));
            if (parts.length >= 2) {
              bookmarksToImport.push({
                title: parts[0],
                url: parts[1],
                description: parts[2] || '',
                source: parts[3] || 'others'
              });
            }
          }
        } else {
          // If not CSV, try parsing as list of URLs
          const urls = importContent.split('\n').filter(url => url.trim() && url.includes('://'));
          bookmarksToImport = urls.map(url => ({ url }));
        }
      }

      // Process and add each bookmark
      let successCount = 0;
      for (const bookmark of bookmarksToImport) {
        if (bookmark.url) {
          try {
            // For any bookmarks without titles, fetch metadata
            if (!bookmark.title) {
              const metadata = await fetchUrlMetadata(bookmark.url);
              bookmark.title = metadata.title || new URL(bookmark.url).hostname;
              bookmark.description = bookmark.description || metadata.description;
              bookmark.thumbnail = bookmark.thumbnail || metadata.thumbnail;
            }
            
            await createBookmark({
              title: bookmark.title,
              url: bookmark.url,
              description: bookmark.description || '',
              source: bookmark.source || 'others',
              thumbnail: bookmark.thumbnail || '',
              user_id: user.id,
              tags: bookmark.tags || []
            });
            successCount++;
          } catch (e) {
            console.error(`Error importing bookmark: ${bookmark.url}`, e);
          }
        }
      }
      
      toast({
        title: "Import Complete",
        description: `Successfully imported ${successCount} out of ${bookmarksToImport.length} bookmarks.`,
      });
    } catch (error) {
      console.error("Error importing bookmarks:", error);
      toast({
        title: "Error",
        description: "Failed to import bookmarks. Please check your data format.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      setImportContent("");
    }
  };

  if (!user) {
    return (
      <div className="container py-8">
        <h2 className="text-xl font-semibold mb-4">Please login to manage your profile.</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg py-8">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      
      <div className="mb-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
        <h3 className="text-md font-medium text-gray-500 dark:text-gray-400 mb-1">Username</h3>
        <p className="text-lg font-semibold">{user.email?.split('@')[0] || "User"}</p>
      </div>
      
      <form onSubmit={handleNameChange} className="mb-6 space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <Button type="submit">Update Name</Button>
      </form>
      
      <form className="mb-6 space-y-4">
        <div>
          <Label htmlFor="profilePic">Profile Picture</Label>
          <Input id="profilePic" type="file" accept="image/*" onChange={handleProfilePicChange} />
          {profilePic && (
            <img src={profilePic} className="mt-2 w-20 h-20 object-cover rounded-full border" alt="Profile" />
          )}
        </div>
      </form>
      
      <form onSubmit={handlePasswordChange} className="space-y-4">
        {passwordError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{passwordError}</AlertDescription>
          </Alert>
        )}
        <div>
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
          />
        </div>
        <div>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            minLength={6}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
        <Button type="submit">Update Password</Button>
      </form>

      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold mb-3">Forgot your password?</h3>
        <p className="text-sm text-gray-500 mb-3">
          Click the button below to receive a password reset link in your email.
        </p>
        <Button 
          variant="outline" 
          onClick={handleResetPassword} 
          disabled={isResetting}
          className="w-full"
        >
          {isResetting ? "Sending Reset Link..." : "Send Password Reset Link"}
        </Button>
      </div>

      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold mb-3">Import & Export Bookmarks</h3>
        
        <div className="mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mb-3">Import Bookmarks</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Import Bookmarks</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label htmlFor="importText">Paste your bookmarks data below</Label>
                  <textarea 
                    id="importText"
                    className="w-full h-40 p-2 border rounded-md font-mono text-sm"
                    placeholder="Paste JSON, CSV, or URLs (one per line)"
                    value={importContent}
                    onChange={e => setImportContent(e.target.value)}
                  ></textarea>
                </div>
                <p className="text-xs text-gray-500">
                  Supported formats: JSON array, CSV, or a list of URLs (one per line)
                </p>
                <Button 
                  onClick={handleImportBookmarks} 
                  disabled={isImporting || !importContent.trim()}
                  className="w-full"
                >
                  {isImporting ? "Importing..." : "Import Bookmarks"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3">
            <Label htmlFor="exportFormat" className="min-w-24">Export Format:</Label>
            <select
              id="exportFormat"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={exportFormat}
              onChange={e => setExportFormat(e.target.value as "json" | "csv" | "html")}
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="html">HTML</option>
            </select>
          </div>
          
          <Button 
            onClick={handleExportBookmarks} 
            disabled={isExporting} 
            className="w-full"
            variant="outline"
          >
            {isExporting ? "Exporting..." : "Export Bookmarks"}
          </Button>
        </div>
      </div>
      
      <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
    </div>
  );
};

export default Profile;
