'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('demo');
    setError('');
    setIsLoading(true);

    try {
      const result = await login(userEmail, 'demo');
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">MK</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">Mom's Kitchen</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
          <p className="text-gray-600">Sign in to share your latest cooking adventures</p>
        </div>

        {/* Login Form */}
        <Card className="border-orange-100 shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your email to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter any password (demo)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-orange-200 focus:border-orange-400"
                />
                <p className="text-xs text-gray-500">For demo: any password works</p>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Quick Login Options */}
            <div className="mt-6 pt-6 border-t border-orange-100">
              <p className="text-sm text-gray-600 mb-3 text-center">Quick Demo Login:</p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full text-left justify-start border-orange-200 hover:bg-orange-50"
                  onClick={() => handleQuickLogin('sarah@example.com')}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                      <span className="text-orange-800 text-sm font-medium">S</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Sarah Johnson</div>
                      <div className="text-xs text-gray-500">sarah@example.com</div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full text-left justify-start border-orange-200 hover:bg-orange-50"
                  onClick={() => handleQuickLogin('maria@example.com')}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                      <span className="text-orange-800 text-sm font-medium">M</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Maria Rodriguez</div>
                      <div className="text-xs text-gray-500">maria@example.com</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link 
                  href="/register" 
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Join the community
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-orange-600 text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}