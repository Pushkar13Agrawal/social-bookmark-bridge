
import React, { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SocialPlatform } from "@/utils/bookmarks";

interface PlatformSelectProps {
  value: SocialPlatform;
  onChange: (value: SocialPlatform) => void;
  disabled?: boolean;
  url?: string; // Add URL prop to detect platform automatically
}

// Helper function to detect platform from URL
const detectPlatformFromUrl = (url: string): SocialPlatform => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return 'youtube';
    } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      return 'twitter';
    } else if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
      return 'facebook';
    } else if (hostname.includes('instagram.com')) {
      return 'instagram';
    } else if (hostname.includes('linkedin.com')) {
      return 'linkedin';
    } else if (hostname.includes('reddit.com')) {
      return 'reddit';
    } else if (hostname.includes('pinterest.com')) {
      return 'pinterest';
    } else if (hostname.includes('chat.openai.com')) {
      return 'chatgpt';
    } else {
      return 'others';
    }
  } catch (error) {
    console.error('Error parsing URL:', error);
    return 'others';
  }
};

export const PlatformSelect: React.FC<PlatformSelectProps> = ({
  value,
  onChange,
  disabled,
  url
}) => {
  // Effect to auto-detect platform when URL changes
  useEffect(() => {
    if (url && url.trim() !== '') {
      try {
        const detectedPlatform = detectPlatformFromUrl(url);
        onChange(detectedPlatform);
      } catch (error) {
        console.error('Error detecting platform:', error);
      }
    }
  }, [url, onChange]);

  return (
    <Select
      value={value}
      onValueChange={(value: SocialPlatform) => onChange(value)}
      disabled={disabled}
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
        <SelectItem value="chatgpt">ChatGPT</SelectItem>
        <SelectItem value="others">Others</SelectItem>
      </SelectContent>
    </Select>
  );
};
