
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

const Profile = () => {
  const { user, setCurrentUser } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [profilePic, setProfilePic] = useState<string>("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
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
      <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
    </div>
  );
};

export default Profile;
