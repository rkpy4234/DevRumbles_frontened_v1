"use client";

import React, { useState, useEffect } from "react";
import UserLayout from "../UserLayou";
import { Button } from "@/components/ui/button";
import EventsPage from "../events/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  IconEdit,
  IconTrash,
  IconHeart,
  IconMessageCircle,
  IconUser,
} from "@tabler/icons-react";
import { Toaster, toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Comment {
  commentID: number;
  commentText: string;
  userId: string;
  userFullName?: string | null;
  commentedAt: string;
}

interface LikeItem {
  userID: string;
  userFullName?: string | null;
}

interface Post {
  postID: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdBy: string;
  fullName?: string | null;
  createdAt: string;
  comments?: Comment[];
  likes?: LikeItem[];
}

interface Event {
  eventID: number;
  title: string;
  description: string;
  date: string;
}

export default function PostPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>(
    {}
  );
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});

  const [currentUserId] = useState("USER-ID-HERE"); // Replace with actual user ID
  const API_URL = "https://localhost:7006/api/Post";

  useEffect(() => {
    fetchPosts();
    setEvents([
      {
        eventID: 1,
        title: "Event 1",
        description: "This is event 1",
        date: "2025-08-20",
      },
      {
        eventID: 2,
        title: "Event 2",
        description: "This is event 2",
        date: "2025-08-22",
      },
      {
        eventID: 3,
        title: "Event 3",
        description: "This is event 3",
        date: "2025-08-25",
      },
    ]);
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(API_URL, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching posts.");
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("createdBy", currentUserId);
    if (imageFile) formData.append("imageFile", imageFile);

    const url = editingPost
      ? `${API_URL}/${editingPost.postID}`
      : `${API_URL}/UploadPost`;
    const method = editingPost ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success(editingPost ? "Post updated!" : "Post created!");
      setTitle("");
      setContent("");
      setImageFile(null);
      setEditingPost(null);
      setIsDialogOpen(false);
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit post");
    }
  };

  const handleDelete = async (postID: number) => {
    try {
      const res = await fetch(`${API_URL}/${postID}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Post deleted!");
      setPosts((prev) => prev.filter((p) => p.postID !== postID));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
    setConfirmDeleteId(null);
  };

  const handleLike = async (post: Post) => {
    const hasLiked = post.likes?.some((l) => l.userID === currentUserId);

    setPosts((prev) =>
      prev.map((p) =>
        p.postID === post.postID
          ? {
              ...p,
              likes: hasLiked
                ? (p.likes || []).filter((l) => l.userID !== currentUserId)
                : [
                    ...(p.likes || []),
                    { userID: currentUserId, userFullName: "You" },
                  ],
            }
          : p
      )
    );

    try {
      const res = await fetch(`${API_URL}/${post.postID}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userID: currentUserId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to like/unlike");
      fetchPosts();
    }
  };

  const handleAddComment = async (postID: number) => {
    const text = (commentInputs[postID] || "").trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((p) =>
        p.postID === postID
          ? {
              ...p,
              comments: [
                ...(p.comments || []),
                {
                  commentID: Date.now(),
                  commentText: text,
                  userId: currentUserId,
                  userFullName: "You",
                  commentedAt: new Date().toISOString(),
                },
              ],
            }
          : p
      )
    );

    setCommentInputs((prev) => ({ ...prev, [postID]: "" }));

    try {
      const res = await fetch(`${API_URL}/${postID}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ commentText: text, userID: currentUserId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
      fetchPosts();
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setIsDialogOpen(true);
  };

  const toggleCommentSection = (postID: number) => {
    setOpenComments((prev) => ({ ...prev, [postID]: !prev[postID] }));
  };

  return (
    <UserLayout>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Feed</h1>
        <Button
          variant="outline"
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <IconEdit size={15} /> Create Post
        </Button>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-full">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Post" : "Create Post"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full border rounded p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Content"
              className="w-full border rounded p-2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImageFile(e.target.files ? e.target.files[0] : null)
              }
            />
            <div className="flex gap-2 justify-end">
              <Button onClick={handleSubmit}>
                {editingPost ? "Update" : "Submit"}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteId !== null}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent className="sm:max-w-[400px] w-full">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this post?
          </p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(confirmDeleteId!)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[80vh]">
        {/* Feed */}
        <div className="lg:col-span-6 overflow-y-auto pr-2 space-y-4 extra-thin-scrollbar">
          {posts.map((post) => {
            const hasLiked = post.likes?.some(
              (l) => l.userID === currentUserId
            );
            return (
              <Card
                key={post.postID}
                className="flex flex-col w-full bg-white shadow-sm hover:shadow-md rounded-md overflow-hidden"
              >
                <CardHeader className="flex flex-col gap-0.5 px-3 pt-2">
                  <span className="flex items-start gap-2">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      <h4 className="font-bold text-[16px] text-gray-900">
                        {post.fullName || "Anonymous User"}
                      </h4>
                      <span className="text-[12px] text-gray-500">
                        {new Date(post.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </span>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col py-1 px-3 text-md text-gray-900">
                  <h2 className="text-lg font-semibold truncate py-1">
                    {post.title}
                  </h2>
                  {post.imageUrl && (
                    <div className="flex-1">
                      <img
                        src={`${
                          post.imageUrl.startsWith("http")
                            ? ""
                            : "https://localhost:7006"
                        }${post.imageUrl}`}
                        alt={post.title}
                        className="w-full h-full object-cover rounded-md border"
                      />
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col gap-2 px-3 pb-2 pt-1">
                  <div className="flex items-center justify-start gap-4">
                    {/* Like */}
                    <Button
                      size="lg"
                      variant="ghost"
                      onClick={() => handleLike(post)}
                      className={`flex items-center gap-2 px-2 ${
                        hasLiked ? "text-red-500" : "text-gray-600"
                      }`}
                    >
                      <IconHeart size={30} />
                      <span className="text-sm">{post.likes?.length || 0}</span>
                    </Button>

                    {/* Comment Toggle */}
                    <Button
                      size="lg"
                      variant="ghost"
                      onClick={() => toggleCommentSection(post.postID)}
                      className="flex items-center gap-2 px-2 text-gray-600"
                    >
                      <IconMessageCircle size={30} />
                      <span className="text-sm">
                        {post.comments?.length || 0}
                      </span>
                    </Button>

                    {/* Edit/Delete */}
                    {post.createdBy === currentUserId && (
                      <div className="flex gap-2 ml-auto">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(post)}
                        >
                          <IconEdit size={20} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setConfirmDeleteId(post.postID)}
                        >
                          <IconTrash size={20} />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Comments */}
                  {openComments[post.postID] && (
                    <div className="w-full">
                      <div className="space-y-1 max-h-24 overflow-y-auto text-xs extra-thin-scrollbar">
                        {(post.comments || []).map((c) => (
                          <div
                            key={c.commentID}
                            className="break-words text-[10px]"
                          >
                            <strong>{c.userFullName || "John Doe"}:</strong>{" "}
                            {c.commentText}
                          </div>
                        ))}
                      </div>
                      <div className="flex mt-1 gap-1">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          className="border p-1 rounded flex-1 text-xs"
                          value={commentInputs[post.postID] || ""}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [post.postID]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleAddComment(post.postID)
                          }
                        />
                        <Button
                          size="icon"
                          variant="secondary"
                          className="p-1"
                          onClick={() => handleAddComment(post.postID)}
                        >
                          <IconMessageCircle size={18} />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Events */}
        <div className="lg:col-span-6 overflow-y-auto pl-2 extra-thin-scrollbar">
          <h2 className="text-lg font-bolder mb-2">Upcoming Events</h2>
          <EventsPage />
        </div>
      </div>
    </UserLayout>
  );
}
