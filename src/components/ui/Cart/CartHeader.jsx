export default function CartHeader({
  selectAll,
  onSelectAll,
  selectedCount,
  onDeleteSelected,
  isDeleting = false,
}) {
  return (
    <div className='bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
      <label className='flex items-center space-x-2 cursor-pointer'>
        <input
          type='checkbox'
          checked={selectAll}
          onChange={(e) => onSelectAll(e.target.checked)}
          className='w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
          disabled={isDeleting}
        />
        <span className='font-semibold text-gray-700'>Select All</span>
      </label>
      {selectedCount > 0 && (
        <button
          onClick={onDeleteSelected}
          disabled={isDeleting}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            isDeleting
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {isDeleting ? 'Deleting...' : `Delete Selected (${selectedCount})`}
        </button>
      )}
    </div>
  );
}
