"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [postType, setPostType] = useState<"win" | "tip" | "story">("win");
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      const url = filter
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/community/posts?type=${filter}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/community/posts`;
      
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setPosts(data.data.posts);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/community/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newPost,
          postType,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewPost("");
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      const method = isLiked ? "DELETE" : "POST";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/community/posts/${postId}/like`,
        { method }
      );

      const data = await response.json();
      if (data.success) {
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "win": return "🎉";
      case "tip": return "💡";
      case "story": return "📖";
      default: return "💬";
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "win": return "bg-green-100 text-green-800";
      case "tip": return "bg-blue-100 text-blue-800";
      case "story": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-600">🌍 Carbon Tracker</h1>
            <nav className="flex gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/tracking">
                <Button variant="ghost">Track</Button>
              </Link>
              <Link href="/challenges">
                <Button variant="ghost">Challenges</Button>
              </Link>
              <Link href="/community">
                <Button variant="ghost">Community</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Community Feed</h2>

          {/* Create Post */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Share with the Community</CardTitle>
              <CardDescription>Share your wins, tips, or stories</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="flex gap-2">
                  {["win", "tip", "story"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPostType(type as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        postType === type
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {getPostTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
                <Input
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind?"
                  className="min-h-[80px]"
                />
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!newPost.trim()}
                >
                  Post
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Filter */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={filter === "" ? "default" : "outline"}
              onClick={() => setFilter("")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === "win" ? "default" : "outline"}
              onClick={() => setFilter("win")}
              size="sm"
            >
              🎉 Wins
            </Button>
            <Button
              variant={filter === "tip" ? "default" : "outline"}
              onClick={() => setFilter("tip")}
              size="sm"
            >
              💡 Tips
            </Button>
            <Button
              variant={filter === "story" ? "default" : "outline"}
              onClick={() => setFilter("story")}
              size="sm"
            >
              📖 Stories
            </Button>
          </div>

          {/* Posts */}
          {loading ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
                          {post.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-semibold">{post.user?.name || "Anonymous"}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.postType)}`}>
                        {getPostTypeIcon(post.postType)} {post.postType}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{post.content}</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id, post.isLiked)}
                        className={`flex items-center gap-1 text-sm ${
                          post.isLiked ? "text-red-600" : "text-gray-600"
                        } hover:text-red-600 transition-colors`}
                      >
                        <span>{post.isLiked ? "❤️" : "🤍"}</span>
                        <span>{post.likesCount}</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {posts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No posts yet. Be the first to share!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Made with Bob
