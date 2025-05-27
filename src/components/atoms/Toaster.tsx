'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

interface ToasterProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export function Toaster({ position = 'top-center' }: ToasterProps) {
  return (
    <HotToaster
      position={position}
      toastOptions={{
        className: '!bg-white !text-gray-900 dark:!bg-gray-800 dark:!text-white',
        success: {
          className: '!bg-green-100 !text-green-800 dark:!bg-green-800 dark:!text-green-100',
        },
        error: {
          className: '!bg-red-100 !text-red-800 dark:!bg-red-800 dark:!text-red-100',
        },
      }}
    />
  );
}
