
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, SocialPlatform } from "@/utils/bookmarks";
import { 
  Bookmark as BookmarkIcon, 
  BookmarkMinus, 
  Edit, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube, 
  MessageSquareHeart, 
  MessageSquare,
  Reddit // updated to use lucide-react's Reddit icon
} from "lucide-react";
import BookmarkFormModal from "./BookmarkFormModal";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onRemove?: (id: string) => void;
  onEdit?: () => void;
}

// Added icons for new platforms
const PlatformIcon: React.FC<{ platform: SocialPlatform }> = ({ platform }) => {
  const iconProps = { className: "h-4 w-4 mr-1" };
  
  switch (platform) {
    case "twitter":
      return <Twitter {...iconProps} />;
    case "facebook":
      return <Facebook {...iconProps} />;
    case "instagram":
      return <Instagram {...iconProps} />;
    case "linkedin":
      return <Linkedin {...iconProps} />;
    case "youtube":
      return <Youtube {...iconProps} />;
    case "reddit":
      return <Reddit {...iconProps} />;
    case "chatgpt":
      return <MessageSquareHeart {...iconProps} />;
    case "others":
      return <MessageSquare {...iconProps} />;
    default:
      return <BookmarkIcon {...iconProps} />;
  }
};

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, onRemove, onEdit }) => {
  const { id, title, url, description, thumbnail, source, tags, createdAt } = bookmark;

  const handleVisit = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200">
      {thumbnail && (
        <div className="relative w-full h-36 overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          />
          <Badge 
            className={`absolute top-2 right-2 ${
              source === "twitter" ? "bg-bookmark-twitter" :
              source === "facebook" ? "bg-bookmark-facebook" :
              source === "instagram" ? "bg-bookmark-instagram" :
              source === "linkedin" ? "bg-bookmark-linkedin" :
              source === "youtube" ? "bg-bookmark-youtube" :
              source === "reddit" ? "bg-bookmark-reddit" :
              source === "chatgpt" ? "bg-green-500" :
              source === "others" ? "bg-neutral-400" :
              ""
            }`}
          >
            <PlatformIcon platform={source} />
            {source}
          </Badge>
        </div>
      )}
      <CardHeader className={thumbnail ? "pt-3" : "pt-5"}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-1 break-words">{title}</CardTitle>
          {!thumbnail && (
            <Badge 
              className={`${
                source === "twitter" ? "bg-bookmark-twitter" :
                source === "facebook" ? "bg-bookmark-facebook" :
                source === "instagram" ? "bg-bookmark-instagram" :
                source === "linkedin" ? "bg-bookmark-linkedin" :
                source === "youtube" ? "bg-bookmark-youtube" :
                source === "reddit" ? "bg-bookmark-reddit" :
                source === "chatgpt" ? "bg-green-500" :
                source === "others" ? "bg-neutral-400" :
                ""
              }`}
            >
              <PlatformIcon platform={source} />
              {source}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2 mt-1 break-words">
          {description || "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-1 mt-2">
          {tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2 pb-4 border-t">
        <span className="text-xs text-muted-foreground">
          Saved on {formatDate(createdAt)}
        </span>
        <div className="flex space-x-2">
          {onRemove && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onRemove(id)}
              className="text-destructive hover:text-destructive"
            >
              <BookmarkMinus className="h-4 w-4" />
            </Button>
          )}
          <BookmarkFormModal
            bookmark={bookmark}
            onSuccess={onEdit}
            trigger={
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            }
          />
          <Button size="sm" onClick={handleVisit}>
            Visit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookmarkCard;
