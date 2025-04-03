'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
}

export default function BackButton({ href, onClick }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
    >
      <ArrowLeftIcon className="h-5 w-5 mr-1" />
      <span>返回</span>
    </button>
  );
} 