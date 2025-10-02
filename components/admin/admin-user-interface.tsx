"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Post, PostCategory } from "@/types/post";

interface PostCardProps {
  post: Post;
  onApprove: (postId: string) => void;
  onReject: (postId: string) => void;
}

export function PostCard({ post, onApprove, onReject }: PostCardProps) {
  const getCategoryColor = (category: PostCategory) => {
    const colors = {
      PREVENTION: "bg-blue-500/10 text-blue-700",
      TREATMENT: "bg-purple-500/10 text-purple-700",
      AWARENESS: "bg-orange-500/10 text-orange-700",
      RESEARCH: "bg-teal-500/10 text-teal-700",
    };
    return colors[category];
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <h3 className="font-semibold text-lg">{post.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {post.content}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">By {post.author.name}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{post.author.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>Language: {post.language.toUpperCase()}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge
              variant="secondary"
              className={`text-xs ${getCategoryColor(post.category)}`}
            >
              {post.category}
            </Badge>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {post.status}
        </Badge>
      </div>

      {post.status === "PENDING" && (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onApprove(post.id)}
            className="flex items-center gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onReject(post.id)}
            className="flex items-center gap-1"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}
