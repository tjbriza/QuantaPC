export default function CartHeader({
  selectAll,
  onSelectAll,
  selectedCount,
  onDeleteSelected,
}) {
  return (
    <div className='bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
      <label className='flex items-center space-x-2 cursor-pointer'>
        <input
          type='checkbox'
          checked={selectAll}
          onChange={(e) => onSelectAll(e.target.checked)}
          className='w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
        />
        <span className='font-semibold text-gray-700'>Select All</span>
      </label>
      {selectedCount > 0 && (
        <button
          onClick={onDeleteSelected}
          className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium'
        >
          Delete Selected ({selectedCount})
        </button>
      )}
    </div>
  );
}
