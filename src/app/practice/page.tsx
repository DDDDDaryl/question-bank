'use client';

import Link from 'next/link';
import { BookOpenIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function PracticePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">题目练习</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 主题题库 */}
        <Link href="/practice/topics" 
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <BookOpenIcon className="h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">主题题库</h2>
          <p className="text-gray-600 text-center">按照不同主题分类练习，系统掌握知识点</p>
        </Link>

        {/* 错题库 */}
        <Link href="/practice/mistakes" 
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">错题库</h2>
          <p className="text-gray-600 text-center">查看和练习做错的题目，强化薄弱环节</p>
        </Link>

        {/* 随机题库 */}
        <Link href="/practice/random" 
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <ArrowPathIcon className="h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">随机题库</h2>
          <p className="text-gray-600 text-center">随机抽取题目练习，适合碎片时间学习</p>
        </Link>
      </div>
    </main>
  );
} 