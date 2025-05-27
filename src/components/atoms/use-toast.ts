import { toast as hotToast } from 'react-hot-toast';

type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default' | 'destructive';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export function useToast() {
  const toast = ({
    title,
    description,
    variant = 'default',
    duration = 3000,
  }: ToastOptions) => {
    const baseClasses = '!bg-white !text-gray-900 dark:!bg-gray-800 dark:!text-white';
    const variantClasses: Record<ToastVariant, string> = {
      success: '!bg-green-100 !text-green-800 dark:!bg-green-800 dark:!text-green-100',
      error: '!bg-red-100 !text-red-800 dark:!bg-red-800 dark:!text-red-100',
      warning: '!bg-yellow-100 !text-yellow-800 dark:!bg-yellow-800 dark:!text-yellow-100',
      info: '!bg-blue-100 !text-blue-800 dark:!bg-blue-800 dark:!text-blue-100',
      destructive: '!bg-red-500 !text-white dark:!bg-red-700',
      default: baseClasses,
    };

    const className = `${variantClasses[variant]} px-4 py-2 rounded-md shadow-lg`;

    const message = [title, description].filter(Boolean).join(' - ');

    return hotToast(message, {
      duration,
      className,
    });
  };

  return { toast };
}
