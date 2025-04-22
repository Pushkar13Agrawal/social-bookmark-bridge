
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SocialPlatform } from "@/utils/bookmarks";

interface PlatformSelectProps {
  value: SocialPlatform;
  onChange: (value: SocialPlatform) => void;
  disabled?: boolean;
}

export const PlatformSelect: React.FC<PlatformSelectProps> = ({
  value,
  onChange,
  disabled
}) => {
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
