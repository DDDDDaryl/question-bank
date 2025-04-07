'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  lastLoginAt: Date | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface SystemSettings {
  allowNewRegistrations: boolean;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  averageTagsPerUser: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAdminAccess = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/auth');
      if (!response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('管理员验证失败:', error);
      router.push('/login');
    }
  }, [router]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('获取用户列表失败');
      }
      const data = await response.json();
      setUsers(data.users);
      setStats(data.stats);
    } catch (error) {
      setError('获取用户数据失败');
      console.error(error);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (!response.ok) {
        throw new Error('获取系统设置失败');
      }
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      setError('获取系统设置失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAdminAccess();
    fetchUsers();
    fetchSettings();
  }, [checkAdminAccess, fetchUsers, fetchSettings]);

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error('更新用户状态失败');
      }

      // 更新本地用户列表
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive } : user
      ));
    } catch (error) {
      console.error('更新用户状态失败:', error);
    }
  };

  const toggleRegistration = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          allowNewRegistrations: !settings?.allowNewRegistrations
        }),
      });

      if (!response.ok) {
        throw new Error('更新系统设置失败');
      }

      setSettings(prev => ({
        ...prev,
        allowNewRegistrations: !prev?.allowNewRegistrations
      }));
    } catch (error) {
      console.error('更新系统设置失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">管理员仪表板</h1>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">总用户数</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats?.totalUsers}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">活跃用户数</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats?.activeUsers}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">平均订阅标签数</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats?.averageTagsPerUser.toFixed(1)}
              </dd>
            </div>
          </div>
        </div>

        {/* 系统设置 */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">系统设置</h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-gray-700">新用户注册</h4>
                <p className="text-sm text-gray-500">控制是否允许新用户注册系统</p>
              </div>
              <button
                onClick={toggleRegistration}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  settings?.allowNewRegistrations ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span className="sr-only">切换新用户注册</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    settings?.allowNewRegistrations ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">用户管理</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用户名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      邮箱
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      注册时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最近活跃
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '从未登录'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? '正常' : '已禁用'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => toggleUserStatus(user._id, !user.isActive)}
                          className={`text-sm font-medium ${
                            user.isActive
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {user.isActive ? '禁用' : '启用'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 