'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { postStorage, userStorage } from '@/lib/storage';
import { Post } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { formatDate } from '@/lib/storage';
import { CreatePostModal } from '@/components/create/CreatePostModal';

export default function DashboardPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Categories for filtering
  const categories = [
    { id: '', name: 'All', color: '#6B7280' },
    { id: '1', name: 'Breakfast', color: '#FFA726' },
    { id: '2', name: 'Lunch', color: '#66BB6A' },
    { id: '3', name: 'Dinner', color: '#EF5350' },
    { id: '4', name: 'Snacks', color: '#FFCA28' },
    { id: '5', name: 'Desserts', color: '#AB47BC' },
    { id: '6', name: 'Beverages', color: '#42A5F5' },
    { id: '7', name: 'Healthy', color: '#8BC34A' },
    { id: '8', name: 'Kids Favorite', color: '#FF7043' }
  ];

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      // Load posts
      const allPosts = postStorage.getPosts();
      setPosts(allPosts);
      setIsLoaded(true);
    }
  }, [isAuthenticated, loading, router]);

  const handlePostCreated = () => {
    // Refresh posts after creating a new one
    const allPosts = postStorage.getPosts();
    setPosts(allPosts);
    setIsCreateModalOpen(false);
  };

  const handleLike = (postId: string) => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isLiked = post.likes.includes(user.id);
    let updatedLikes;

    if (isLiked) {
      updatedLikes = post.likes.filter(id => id !== user.id);
    } else {
      updatedLikes = [...post.likes, user.id];
    }

    // Update local state
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId ? { ...p, likes: updatedLikes } : p
      )
    );

    // Update storage
    postStorage.updatePost(postId, { likes: updatedLikes });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
                           post.categories.some(cat => cat.id === selectedCategory);

    return matchesSearch && matchesCategory;
  });

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
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
              >
                ✨ Share Creation
              </Button>
              <Link href="/profile">
                <Button variant="ghost" className="text-gray-600 hover:text-orange-600">
                  Profile
                </Button>
              </Link>
              <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-orange-200 text-orange-800 text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-orange-800">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-orange-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600 mb-4">
            What delicious creation are you sharing with the community today?
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
          >
            📸 Share Today's Creation
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-orange-100">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search for recipes, dishes, or community members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "secondary"}
                className={`cursor-pointer transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🍳</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No posts found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory
                  ? "Try adjusting your search or filter options"
                  : "Be the first to share your cooking creation!"}
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
              >
                Share Your First Post
              </Button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="w-10 h-10">
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
                  
                  <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{post.description}</CardDescription>
                </CardHeader>

                {/* Images */}
                {post.images.length > 0 && (
                  <div className="px-6">
                    <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
                      {post.images.slice(0, 4).map((image, index) => (
                        <div
                          key={index}
                          className={`relative aspect-square overflow-hidden ${
                            post.images.length === 1 ? 'col-span-2' : ''
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${post.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {index === 3 && post.images.length > 4 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white font-bold">+{post.images.length - 4}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <CardContent className="pt-4">
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant="secondary"
                        className="bg-orange-100 text-orange-800 text-xs"
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>

                  <Separator className="my-3" />

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`hover:bg-red-50 ${
                          post.likes.includes(user?.id || '')
                            ? 'text-red-600 hover:text-red-700'
                            : 'text-gray-600 hover:text-red-600'
                        }`}
                      >
                        ❤️ {post.likes.length}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-orange-600">
                        💬 {post.comments.length}
                      </Button>
                    </div>

                    <Link href={`/post/${post.id}`}>
                      <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                        View Recipe →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}