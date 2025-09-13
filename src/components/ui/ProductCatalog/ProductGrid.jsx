import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products,
  pageSize = 12,
  page: controlledPage,
  total, // total rows when server-side
  onPageChange,
}) {
  if (!products || products.length === 0) return null;

  // Determine mode
  const serverSide =
    Number.isInteger(total) &&
    typeof onPageChange === 'function' &&
    Number.isInteger(controlledPage);

  // Local pagination state for client-side mode
  const [localPage, setLocalPage] = useState(1);
  const page = serverSide ? controlledPage : localPage;
  const totalPages = serverSide
    ? Math.max(1, Math.ceil(total / pageSize))
    : Math.max(1, Math.ceil(products.length / pageSize));

  // Clamp page in client mode when data shrinks
  if (!serverSide && page > totalPages) setLocalPage(totalPages);

  const paged = useMemo(() => {
    if (serverSide) return products; // Already sliced by server
    const start = (page - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, page, pageSize, serverSide]);

  return (
    <div className='w-full'>
      <div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center ml-8'
        style={{ gap: '1rem' }}
      >
        {paged.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            img={product.image_url || 'https://placehold.co/150'}
            name={product.name}
            price={product.price}
            alt={product.name || 'Product Image'}
            rating={product.rating || 0}
          />
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-2 mt-6'>
          <button
            onClick={() =>
              serverSide
                ? onPageChange(Math.max(1, page - 1))
                : setLocalPage((p) => Math.max(1, p - 1))
            }
            disabled={page === 1}
            className='px-3 py-2 rounded-md border border-gray-300 disabled:opacity-50'
          >
            Prev
          </button>

          {/* Simple page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => (serverSide ? onPageChange(n) : setLocalPage(n))}
              className={`w-9 h-9 rounded-md border text-sm font-medium transition-colors ${
                n === page
                  ? 'text-[#0C65FF] border-[#0C65FF]'
                  : 'text-gray-800 border-gray-300 hover:border-gray-400'
              }`}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() =>
              serverSide
                ? onPageChange(Math.min(totalPages, page + 1))
                : setLocalPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={page === totalPages}
            className='px-3 py-2 rounded-md border border-gray-300 disabled:opacity-50'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
