import { Dialog } from "@/components/atoms/Dialog";

type DetailItem = {
  label: string;
  value: React.ReactNode;
};

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  details: DetailItem[];
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  isLoading?: boolean;
}

export function DetailModal({
  isOpen,
  onClose,
  title,
  description,
  details,
  onEdit,
  onDelete,
  isLoading = false,
}: DetailModalProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      className="max-w-2xl"
    >
      <div className="mt-6 space-y-4">
        {details.map((item, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
            <h4 className="text-sm font-medium text-gray-500">{item.label}</h4>
            <p className="mt-1 text-sm text-gray-900">{item.value || 'Not specified'}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isLoading}
            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        )}
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            disabled={isLoading}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Edit'}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
        >
          Close
        </button>
      </div>
    </Dialog>
  );
}

export default DetailModal;