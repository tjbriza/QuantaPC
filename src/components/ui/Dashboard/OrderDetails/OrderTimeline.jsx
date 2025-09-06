export default function OrderTimeline({ history }) {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className='space-y-4'>
      <h3 className='font-bold text-lg mb-4'>Order Timeline</h3>
      {history
        .slice()
        .reverse()
        .map((h, index) => (
          <div key={h.id} className='flex gap-3'>
            <div className='flex flex-col items-center'>
              <div className='w-3 h-3 bg-gray-900 rounded-full'></div>
              {index < history.length - 1 && (
                <div className='w-px h-8 bg-gray-300 mt-2'></div>
              )}
            </div>
            <div className='flex-1'>
              <div className='flex justify-between items-start'>
                <div className='text-sm font-medium'>{h.message}</div>
                <div className='text-xs text-gray-500'>
                  {new Date(h.created_at).toLocaleDateString()}
                  <br />
                  {new Date(h.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
