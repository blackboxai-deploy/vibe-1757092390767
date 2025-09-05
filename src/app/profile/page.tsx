'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { postStorage } from '@/lib/storage';
import { Post } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { formatDate } from '@/lib/storage';

export default function ProfilePage() {
  const { isAuthenticated, user, loading, logout, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || ''
  });

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Load user's posts
      if (user) {
        const posts = postStorage.getPostsByAuthor(user.id);
        setUserPosts(posts);
        setProfileData({
          name: user.name,
          bio: user.bio || '',
          location: user.location || ''
        });
      }
      setIsLoaded(true);
    }
  }, [isAuthenticated, loading, router, user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsUpdating(true);

    try {
      const result = await updateUser(profileData);
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes.length, 0);
  const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0);

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
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-600 hover:text-orange-600">
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <Alert className="border-green-200 bg-green-50 mb-6">
            <AlertDescription className="text-green-600">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50 mb-6">
            <AlertDescription className="text-red-600">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Header */}
        <Card className="border-orange-100 shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <Avatar className="w-32 h-32 border-4 border-orange-200">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-orange-200 text-orange-800 text-4xl font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Badge className="mt-3 bg-orange-100 text-orange-800">
                  Member since {user ? formatDate(user.joinedDate) : ''}
                </Badge>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                {!isEditing ? (
                  <>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.name}</h1>
                    <p className="text-gray-600 mb-4">{user?.bio || 'No bio added yet'}</p>
                    {user?.location && (
                      <p className="text-gray-500 mb-4">📍 {user.location}</p>
                    )}
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      ✏️ Edit Profile
                    </Button>
                  </>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-4 text-left">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="border-orange-200 focus:border-orange-400"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell the community about yourself and your cooking journey..."
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        className="border-orange-200 focus:border-orange-400"
                        maxLength={200}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Sunny Valley Community"
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
                      >
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setProfileData({
                            name: user?.name || '',
                            bio: user?.bio || '',
                            location: user?.location || ''
                          });
                        }}
                        className="border-orange-200"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-orange-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{userPosts.length}</div>
                <div className="text-gray-600">Posts Shared</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{totalLikes}</div>
                <div className="text-gray-600">Total Likes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{totalComments}</div>
                <div className="text-gray-600">Comments Received</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Tab */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">My Posts ({userPosts.length})</TabsTrigger>
            <TabsTrigger value="saved">Saved Recipes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userPosts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No posts yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start sharing your cooking creations with the community!
                  </p>
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700">
                      Create Your First Post
                    </Button>
                  </Link>
                </div>
              ) : (
                userPosts.map((post) => (
                  <Card key={post.id} className="border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                        <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
                      </div>
                      <CardDescription className="line-clamp-2">{post.description}</CardDescription>
                    </CardHeader>

                    {/* Images */}
                    {post.images.length > 0 && (
                      <div className="px-6">
                        <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
                          {post.images.slice(0, 2).map((image, index) => (
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
                              {index === 1 && post.images.length > 2 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <span className="text-white font-bold">+{post.images.length - 2}</span>
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

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span>❤️ {post.likes.length} likes</span>
                          <span>💬 {post.comments.length} comments</span>
                        </div>
                        <Link href={`/post/${post.id}`}>
                          <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                            View Details →
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💾</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Saved Recipes</h3>
              <p className="text-gray-600 mb-4">
                Save your favorite recipes from the community to access them easily later.
              </p>
              <p className="text-sm text-gray-500">
                This feature is coming soon!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}