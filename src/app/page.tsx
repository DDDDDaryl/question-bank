'use client';

import { useEffect, useState } from 'react';

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
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-8">题库系统配置验证</h1>
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">系统状态</h2>
        <p className="text-gray-700">MongoDB 连接状态: {status}</p>
      </div>
    </main>
  );
} 