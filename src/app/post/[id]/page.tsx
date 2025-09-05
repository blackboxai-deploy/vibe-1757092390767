'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useParams } from 'next/navigation';
import { postStorage, generateId } from '@/lib/storage';
import { Post, Comment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { formatDate } from '@/lib/storage';

export default function PostDetailPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const postId = params?.id as string;

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (postId) {
        const foundPost = postStorage.getPostById(postId);
        if (foundPost) {
          setPost(foundPost);
        } else {
          router.push('/dashboard');
          return;
        }
      }
      setIsLoaded(true);
    }
  }, [isAuthenticated, loading, router, postId]);

  const handleLike = () => {
    if (!user || !post) return;

    const isLiked = post.likes.includes(user.id);
    let updatedLikes;

    if (isLiked) {
      updatedLikes = post.likes.filter(id => id !== user.id);
    } else {
      updatedLikes = [...post.likes, user.id];
    }

    // Update local state
    const updatedPost = { ...post, likes: updatedLikes };
    setPost(updatedPost);

    // Update storage
    postStorage.updatePost(post.id, { likes: updatedLikes });
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !post || !newComment.trim()) return;

    setIsSubmittingComment(true);

    try {
      const comment: Comment = {
        id: generateId(),
        authorId: user.id,
        author: user,
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
        likes: []
      };

      const updatedComments = [...post.comments, comment];
      const updatedPost = { ...post, comments: updatedComments };
      
      setPost(updatedPost);
      postStorage.updatePost(post.id, { comments: updatedComments });
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentLike = (commentId: string) => {
    if (!user || !post) return;

    const updatedComments = post.comments.map(comment => {
      if (comment.id === commentId) {
        const isLiked = comment.likes.includes(user.id);
        const updatedLikes = isLiked
          ? comment.likes.filter(id => id !== user.id)
          : [...comment.likes, user.id];
        
        return { ...comment, likes: updatedLikes };
      }
      return comment;
    });

    const updatedPost = { ...post, comments: updatedComments };
    setPost(updatedPost);
    postStorage.updatePost(post.id, { comments: updatedComments });
  };

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-orange-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-orange-200 rounded w-32 mx-auto mb-2"></div>
          <div className="h-3 bg-orange-200 rounded w-24 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Alert className="max-w-md">
          <AlertDescription>
            Post not found. <Link href="/dashboard" className="text-orange-600 hover:text-orange-700">Return to dashboard</Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MK</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800">Mom's Kitchen</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-600 hover:text-orange-600">
                  ← Back to Feed
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="text-gray-600 hover:text-orange-600">
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Card */}
        <Card className="border-orange-100 shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback className="bg-orange-200 text-orange-800">
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-800">{post.author.name}</p>
                <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            
            <CardTitle className="text-2xl">{post.title}</CardTitle>
            <CardDescription className="text-base leading-relaxed">{post.description}</CardDescription>
          </CardHeader>

          {/* Images */}
          {post.images.length > 0 && (
            <div className="px-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg overflow-hidden">
                {post.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square overflow-hidden ${
                      post.images.length === 1 ? 'md:col-span-2' : ''
                    } ${
                      post.images.length === 3 && index === 0 ? 'md:col-span-2' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${post.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <CardContent>
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category) => (
                <Badge
                  key={category.id}
                  variant="secondary"
                  className="bg-orange-100 text-orange-800"
                >
                  {category.name}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-6 mb-6">
              <Button
                variant="ghost"
                size="lg"
                onClick={handleLike}
                className={`hover:bg-red-50 ${
                  post.likes.includes(user?.id || '')
                    ? 'text-red-600 hover:text-red-700'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                ❤️ {post.likes.length}
              </Button>
              
              <span className="text-gray-600">💬 {post.comments.length} comments</span>
            </div>

            <Separator className="my-6" />

            {/* Recipe Section */}
            {post.recipe && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recipe</h3>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {post.recipe.prepTime && (
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{post.recipe.prepTime}</div>
                      <div className="text-sm text-gray-600">Prep Time (min)</div>
                    </div>
                  )}
                  {post.recipe.cookTime && (
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{post.recipe.cookTime}</div>
                      <div className="text-sm text-gray-600">Cook Time (min)</div>
                    </div>
                  )}
                  {post.recipe.servings && (
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{post.recipe.servings}</div>
                      <div className="text-sm text-gray-600">Servings</div>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Ingredients */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">Ingredients</h4>
                    <ul className="space-y-2">
                      {post.recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="text-orange-600 mt-1">•</span>
                          <span>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">Instructions</h4>
                    <ol className="space-y-3">
                      {post.recipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2 py-1 rounded-full min-w-[24px] text-center">
                            {index + 1}
                          </span>
                          <span className="flex-1">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="border-orange-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>💬</span>
              <span>Comments ({post.comments.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex space-x-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-orange-200 text-orange-800 text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    placeholder="Share your thoughts or ask a question..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="border-orange-200 focus:border-orange-400 mb-2"
                    maxLength={500}
                  />
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || isSubmittingComment}
                    size="sm"
                    className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
                  >
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {post.comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">💭</div>
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3 p-4 bg-orange-50 rounded-lg">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                      <AvatarFallback className="bg-orange-200 text-orange-800 text-xs">
                        {comment.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-800">{comment.author.name}</span>
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{comment.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCommentLike(comment.id)}
                        className={`text-xs ${
                          comment.likes.includes(user?.id || '')
                            ? 'text-red-600 hover:text-red-700'
                            : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        ❤️ {comment.likes.length}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}