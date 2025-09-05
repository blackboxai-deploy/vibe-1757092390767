'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-orange-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-orange-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MK</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800">Mom's Kitchen</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-gray-600 hover:text-orange-600">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" className="text-gray-600 hover:text-orange-600">
                    Profile
                  </Button>
                </Link>
                <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full">
                  <div className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-orange-800">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm text-orange-800">Welcome, {user?.name || 'User'}!</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome Back to Your Kitchen Community! 
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to share what you're cooking today? Your community is excited to see your latest creations!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">📸</span>
                  <span>Share Today's Creation</span>
                </CardTitle>
                <CardDescription>
                  Show your community what delicious meal you made today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700">
                    Create New Post
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">👩‍🍳</span>
                  <span>Discover Recipes</span>
                </CardTitle>
                <CardDescription>
                  Browse amazing recipes from your neighbors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50">
                    View Community Feed
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">💝</span>
                  <span>Connect & Share</span>
                </CardTitle>
                <CardDescription>
                  Like, comment, and save your favorite recipes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/profile">
                  <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50">
                    My Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Community Highlights</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">50+</div>
                <div className="text-gray-600">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">200+</div>
                <div className="text-gray-600">Shared Recipes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">500+</div>
                <div className="text-gray-600">Photos Shared</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">1000+</div>
                <div className="text-gray-600">Happy Comments</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MK</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Mom's Kitchen Community</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-orange-600">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700">
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Share Your Kitchen 
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              {" "}Stories
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join a warm community of housewives sharing daily cooking adventures, family recipes, 
            and the joy of creating delicious meals for loved ones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 px-8 py-4 text-lg">
                Join Our Community
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📸</span>
              </div>
              <CardTitle>Share Your Creations</CardTitle>
              <CardDescription>
                Upload photos of your daily cooking adventures and share what you made for your family
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📖</span>
              </div>
              <CardTitle>Recipe Exchange</CardTitle>
              <CardDescription>
                Share family recipes and discover new favorites from your neighborhood community
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💝</span>
              </div>
              <CardTitle>Warm Community</CardTitle>
              <CardDescription>
                Connect with like-minded moms, share cooking tips, and celebrate each other's culinary wins
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Sample Categories */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100 mb-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">What Our Community Shares</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-4 py-2 text-sm">
              🌅 Breakfast Ideas
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-4 py-2 text-sm">
              ☀️ Lunch Boxes
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-4 py-2 text-sm">
              🌙 Family Dinners
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-4 py-2 text-sm">
              🍰 Sweet Treats
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-4 py-2 text-sm">
              🥗 Healthy Options
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-4 py-2 text-sm">
              👶 Kids Favorites
            </Badge>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Join Our Kitchen Family?</h3>
          <p className="text-lg mb-8 opacity-90">
            Start sharing your cooking journey today and discover amazing recipes from your neighbors!
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}