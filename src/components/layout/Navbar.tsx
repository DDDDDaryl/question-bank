'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserProfile } from '@/types/user';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthRedirect, setIsAuthRedirect] = useState(false);

  const fetchUser = useCallback(async () => {
    // 如果在登录页面或正在跳转到登录页面，不获取用户信息
    if (pathname === '/auth' || isAuthRedirect) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching user profile...');
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      console.log('User profile response:', data);
      
      if (response.ok) {
        setUser(data.user);
        setError(null);
      } else {
        console.error('Failed to fetch user:', data.message);
        setUser(null);
        // 只在非401错误时显示错误信息
        if (response.status !== 401) {
          setError(data.message);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
      setError(error instanceof Error ? error.message : '获取用户信息失败');
    } finally {
      setLoading(false);
    }
  }, [pathname, isAuthRedirect]);

  useEffect(() => {
    // 如果是从登录页面返回，重置标记
    if (pathname !== '/auth' && isAuthRedirect) {
      setIsAuthRedirect(false);
    }
    fetchUser();
  }, [fetchUser, pathname, isAuthRedirect]);

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setUser(null);
        setError(null);
        setIsAuthRedirect(true);
        window.location.href = '/auth';
      } else {
        const data = await response.json();
        console.error('Logout failed:', data.message);
        setError(data.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
      setError(error instanceof Error ? error.message : '登出失败');
    }
  };

  const handleAuthClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Auth click: redirecting to auth page');
    setIsAuthRedirect(true);
    window.location.href = '/auth';
  };

  const isActive = (path: string) => pathname === path;

  if (loading) {
    return <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">题库系统</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                题库系统
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/questions"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/questions')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                题库
              </Link>
              <Link
                href="/practice"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/practice')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                练习
              </Link>
              {user?.role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/admin/dashboard')
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  管理
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {error && (
              <span className="text-red-500 text-sm mr-4">{error}</span>
            )}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className={`text-sm font-medium ${
                    isActive('/profile')
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {user.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  退出
                </button>
              </div>
            ) : (
              <a
                href="/auth"
                onClick={handleAuthClick}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                登录/注册
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 