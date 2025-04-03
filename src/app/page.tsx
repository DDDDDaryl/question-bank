'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [status, setStatus] = useState<string>('检查中...');

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setStatus(data.message);
      })
      .catch(err => {
        setStatus('连接错误: ' + err.message);
      });
  }, []);

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">题库系统</h1>
        <p className="text-xl text-gray-600 mb-12">
          在线练习系统，帮助您更好地准备考试
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/practice"
            className="p-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">开始练习</h2>
            <p>按主题练习或随机练习，提高学习效率</p>
          </Link>
          
          <Link
            href="/admin"
            className="p-6 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">题库管理</h2>
            <p>管理题目、查看统计数据</p>
          </Link>
        </div>
      </div>
    </main>
  );
} 