"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from 'next-themes';
import confetti from 'canvas-confetti';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast } from 'sonner';
import { Sparkle } from 'lucide-react';
import { MarkdownTextarea } from './MarkdownTextarea';
import { marked } from 'marked';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy } from 'lucide-react'; // Assuming you're using Lucide icons

interface Comment {
  id: string;
  content: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  createdAt: string;
  likeCount: number;
  liked: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
}

type SortBy = 'newest' | 'oldest' | 'mostReplies' | 'mostLikes';

export default function CommentSection({ postId }: CommentSectionProps): JSX.Element {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(30);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [commentLimit, setCommentLimit] = useState<number>(10);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  const [parsedContents, setParsedContents] = useState<Record<string, string>>({});

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

  const fetchComments = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const response = await fetch(`/api/comments?postId=${postId}&sortBy=${sortBy}&limit=${commentLimit}`);
    if (response.ok) {
      const data: Comment[] = await response.json();
      setComments(data);
    }
    setIsLoading(false);
  }, [postId, sortBy, commentLimit]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchComments();
      }, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchComments]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId,
        content: newComment,
        parentId: replyingTo,
      }),
    });
    if (response.ok) {
      setNewComment('');
      setReplyingTo(null);
      await fetchComments();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    setIsLoading(false);
  };

  const handleEdit = async (commentId: string, newContent: string): Promise<void> => {
    setIsLoading(true);
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newContent }),
    });
    if (response.ok) {
      setEditingComment(null);
      await fetchComments();
    }
    setIsLoading(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete comment');
      }

      // Remove the deleted comment from the local state
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));

      // Optionally, show a success message to the user
      // For example: toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      // Handle error (e.g., show an error message to the user)
      // For example: toast.error('Failed to delete comment');
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to like comment');
      }

      const data = await response.json();

      // Update the comment's like count in the local state
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { ...comment, likeCount: data.likeCount, liked: data.liked }
            : comment
        )
      );

      // Trigger confetti effect only when liking
      if (data.liked) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const toggleReplies = (commentId: string): void => {
    setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };
  const renderComment = (comment: Comment, isReply: boolean = false): JSX.Element => {
    const userName = `${comment.user.firstName} ${comment.user.lastName}`.trim();
    const userInitial = userName ? userName.charAt(0) : '?';

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`p-4 ${isReply ? 'ml-6 mt-3' : 'mb-4'} bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={comment.user.profileImage} alt={userName} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{userName}</h3>
                <span className="text-gray-500 text-xs dark:text-gray-400">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              {editingComment === comment.id ? (
                <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); handleEdit(comment.id, (e.target as HTMLFormElement).content.value); }} className="space-y-2">
                  <MarkdownTextarea
                    name="content"
                    value={comment.content}
                    onChange={(value) => {
                      // You might need to add a state for editing content
                      // setEditingContent(value);
                    }}
                    className="w-full min-h-[80px] text-sm"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="submit" size="sm" variant="default">Save</Button>
                    <Button onClick={() => setEditingComment(null)} size="sm" variant="outline">Cancel</Button>
                  </div>
                </form>
              ) : (
                <div 
                  className="text-gray-700 text-sm dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: parsedContents[comment.id] || 'Loading...' }}
                />
              )}
              <div className="flex items-center space-x-3 text-xs">
                <Button onClick={() => setReplyingTo(comment.id)} size="sm" variant="ghost" className="text-blue-600 dark:text-blue-400">
                  Reply
                </Button>
                <Button onClick={() => handleLike(comment.id)} size="sm" variant="ghost" className="text-pink-600 dark:text-pink-400">
                  Like ({comment.likeCount})
                </Button>
                <Button onClick={() => setEditingComment(comment.id)} size="sm" variant="ghost" className="text-yellow-600 dark:text-yellow-400">
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-red-600 dark:text-red-400">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your comment.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteComment(comment.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              <Button onClick={() => toggleReplies(comment.id)} size="sm" variant="ghost" className="text-gray-600 dark:text-gray-400">
                {showReplies[comment.id] ? 'Hide Replies' : `Show ${comment.replies.length} Replies`}
              </Button>
              <AnimatePresence>
                {showReplies[comment.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 mt-2"
                  >
                    {comment.replies.map((reply: Comment) => renderComment(reply, true))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </Card>
      </motion.div>
    );
  };

  const handleImproveComment = async () => {
    if (!genAI) {
      toast.error('API key not set.');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment to improve.');
      return;
    }

    setIsAILoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await model.generateContent([
        `Improve the following comment by enhancing its grammar, structure, and professionalism while maintaining the original intent. Ensure the result is clear, concise, and natural-sounding without any AI-generated preambles:

        "${newComment}"

        Improved version:`,
      ]);
      const improvedComment = await result.response.text();
      setNewComment(improvedComment.trim());
      toast.success('Comment improved successfully!');
    } catch (error) {
      console.error('Error improving comment:', error);
      toast.error('Failed to improve comment. Please try again.');
    } finally {
      setIsAILoading(false);
    }
  };

  const handleGenerateComment = async () => {
    if (!genAI) {
      toast.error('API key not set.');
      return;
    }

    setIsAILoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await model.generateContent([
        `Generate a detailed, insightful comment that expands on the main ideas of the following user input. Provide additional information and perspectives while keeping the tone relevant and professional. Ensure the generated comment flows naturally without any AI-generated preambles:

        User input: "${newComment}"

        Generated comment:`,
      ]);
      const generatedComment = await result.response.text();
      setNewComment(generatedComment.trim());
      toast.success('Comment generated successfully!');
    } catch (error) {
      console.error('Error generating comment:', error);
      toast.error('Failed to generate comment. Please try again.');
    } finally {
      setIsAILoading(false);
    }
  };

  const handleCopy = (text: string, result: boolean) => {
    if (result) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6, x: 0.5 } // Center of the screen
      });
    }
  };

  const parseCommentContent = useCallback(async (commentId: string, content: string) => {
    try {
      const parsedContent = await marked.parse(content);
      setParsedContents(prev => ({ ...prev, [commentId]: parsedContent }));
    } catch (error) {
      console.error('Error parsing comment:', error);
      setParsedContents(prev => ({ ...prev, [commentId]: 'Error parsing comment' }));
    }
  }, []);

  useEffect(() => {
    comments.forEach(comment => {
      if (!parsedContents[comment.id]) {
        parseCommentContent(comment.id, comment.content);
      }
    });
  }, [comments, parseCommentContent, parsedContents]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 shadow-xl mx-auto p-6 rounded-2xl max-w-3xl transition-all duration-500">
      <h2 className="mb-6 font-bold text-3xl text-gray-900 dark:text-gray-100">
        Discussion
      </h2>
      
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Sort & Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <Tabs defaultValue="sort" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="sort">Sort</TabsTrigger>
                  <TabsTrigger value="filter">Filter</TabsTrigger>
                </TabsList>
                <TabsContent value="sort" className="space-y-2">
                  {['newest', 'oldest', 'mostReplies', 'mostLikes'].map((option) => (
                    <Button
                      key={option}
                      onClick={() => setSortBy(option as SortBy)}
                      variant={sortBy === option ? "default" : "ghost"}
                      size="sm"
                      className="justify-start w-full"
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Button>
                  ))}
                </TabsContent>
                <TabsContent value="filter" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="comment-limit">Number of Comments</Label>
                    <Slider
                      id="comment-limit"
                      min={5}
                      max={50}
                      step={5}
                      value={[commentLimit]}
                      onValueChange={(value) => setCommentLimit(value[0])}
                    />
                    <span className="text-gray-500 text-sm dark:text-gray-400">{commentLimit} comments</span>
                  </div>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
              <Label htmlFor="auto-refresh" className="text-sm">
                Auto Refresh
              </Label>
            </div>
            {autoRefresh && (
              <Input
                id="refresh-interval"
                type="number"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-16 text-center"
                min={5}
                max={300}
              />
            )}
            <Button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              size="icon"
              variant="ghost"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[50vh]">
          <AnimatePresence>
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-32"
              >
                <div className="border-4 border-t-blue-500 border-blue-200 rounded-full w-8 h-8 animate-spin"></div>
              </motion.div>
            ) : (
              comments.map((comment: Comment) => renderComment(comment))
            )}
          </AnimatePresence>
        </ScrollArea>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-4 bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyingTo ? "Write your reply..." : "Share your thoughts..."}
            className="w-full min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Formatting Tips
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enhance Your Comment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 mt-4">
                    {[
                      { label: '**bold**', description: 'for bold text' },
                      { label: '*italic*', description: 'for italic text' },
                      { label: '[link text](URL)', description: 'for links' },
                      { label: '- item', description: 'for bullet points' },
                      { label: '# Heading', description: 'for headings' },
                    ].map(({ label, description }) => (
                      <div key={label} className="flex items-center space-x-2">
                        <Badge variant="outline">{label}</Badge>
                        <span className="flex-grow text-sm">{description}</span>
                        <CopyToClipboard text={label} onCopy={handleCopy}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-1"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </CopyToClipboard>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                onClick={handleImproveComment}
                disabled={isAILoading || !newComment.trim()}
                variant="outline"
                size="sm"
                className="border-2 hover:border-white bg-gradient-to-r hover:bg-gradient-to-l from-purple-400 via-pink-500 to-red-500 ring-opacity-20 hover:ring-opacity-40 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 backdrop-blur-sm hover:backdrop-blur-md border-transparent ring-4 ring-white neon-glow-2 neon-glow-3 text-white transform transition-all hover:animate-none duration-300 ease-in-out hover:scale-105 motion-safe:hover:animate-bounce neon-glow"
              >
                Improve Comment⚡️
              </Button>
              <Button
                onClick={handleGenerateComment}
                disabled={isAILoading}
                variant="outline"
                size="sm"
                className="relative border-2 hover:border-white bg-gradient-to-r from-purple-600 via-pink-600 to-rose-800 shadow-lg hover:shadow-xl px-4 py-2 border-transparent rounded-lg focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 font-bold text-white transform transition hover:animate-none duration-300 overflow-hidden hover:scale-105 ease-in-out focus:outline-none"
              >
                <span className="absolute inset-0 bg-white opacity-25"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-300"></span>
                <span className="relative z-10 flex justify-center items-center">
                  <Sparkle className="mr-2 w-4 h-4" />
                  <span className="text-shadow-neon">Generate AI Comment</span>
                </span>
              </Button>
            </div>
            <Button
              type="submit"
              disabled={isLoading || isAILoading}
            >
              {isLoading || isAILoading ? (
                <div className="border-2 border-white/30 border-t-white rounded-full w-5 h-5 animate-spin"></div>
              ) : (
                <span>{replyingTo ? "Post Reply" : "Share Insight✨"}</span>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
