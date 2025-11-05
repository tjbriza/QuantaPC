import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import { useCatalogProducts } from '../../hooks/useCatalogProducts';
import ProductGrid from '../ui/ProductCatalog/ProductGrid.jsx';
import CategorySection from '../ui/CategorySection.jsx';
import ProductFilter from '../ui/ProductCatalog/ProductFilter.jsx';
import ProductSearch from '../ui/ProductCatalog/ProductSearch.jsx';
import ProductSort from '../ui/ProductCatalog/ProductSort.jsx';

export default function Catalog() {
  const { session } = useAuth();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.trim() || '';

  // Filter state
  const [filters, setFilters] = useState({
    categories: [],
    priceMin: '',
    priceMax: '',
  });

  const title = searchQuery
    ? `Search results for: ${searchQuery}`
    : 'ALL BUILDS';
  const titleStyle = {
    fontSize: '5rem',
    color: '#282E41',
  };

  const {
    data: categories,
    error: categoryError,
    loading: categoryLoading,
  } = useSupabaseRead('categories');

  // Pagination state
  const initialPage =
    Number(new URLSearchParams(location.search).get('page')) || 1;
  const [page, setPage] = useState(initialPage); // 1-based
  const pageSize = 12;

  // Use the custom catalog products hook
  const {
    products,
    count: productsCount,
    loading: productLoading,
    error: productError,
  } = useCatalogProducts(filters, searchQuery, page, pageSize);

  const hasFilters =
    (filters.categories && filters.categories.length > 0) ||
    (filters.priceMin && String(filters.priceMin).trim() !== '') ||
    (filters.priceMax && String(filters.priceMax).trim() !== '');

  // Handle filter changes from ProductFilter component
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  let categorizedProducts = [];
  if (searchQuery) {
    categorizedProducts = [
      {
        id: 'search',
        name: '',
        products: products,
      },
    ];
  } else {
    categorizedProducts = categories.map((category) => ({
      ...category,
      products: products.filter((p) => p.category_id === category.id),
    }));
  }

  if (categoryLoading || productLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        Loading...
      </div>
    );
  }

  if (categoryError || productError) {
    return (
      <div className='min-h-screen flex items-center justify-center text-red-600'>
        Error loading data
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <div className='pt-32 pb-8 w-full flex justify-center items-center'>
        <h2
          className='text-xl md:text-2xl lg:text-5xl font-semibold text-black mb-6 text-center w-full'
          style={title === 'ALL BUILDS' ? titleStyle : {}}
        >
          {title}
        </h2>
      </div>

      <div className='p-2 md:p-4'>
        <div className='mx-auto max-w-[90rem]'>
          <div className='px-4 md:px-8 flex flex-col sm:flex-row-reverse sm:items-center gap-4 sm:gap-0 lg:ml-81'>
            <ProductSort />
          </div>

          <div className='flex px-4 md:px-8'>
            {/* Sidebar filter */}
            <div className='hidden lg:flex lg:flex-col lg:w-64 xl:w-72 lg:flex-shrink-0'>
              <ProductFilter
                onFiltersChange={handleFiltersChange}
                currentFilters={filters}
              />
            </div>

            {/* Product list */}
            <div className='flex-1 flex justify-center'>
              <div className='w-full pr-4 pb-8'>
                {searchQuery ? (
                  <ProductGrid
                    products={products}
                    page={page}
                    pageSize={pageSize}
                    total={productsCount || 0}
                    onPageChange={(p) => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ) : (
                  categorizedProducts.map((category) => (
                    <div key={category.id} className='mb-16'>
                      {/* Category title removed per original UI; keep grid per category with its own pagination if needed later */}
                      <ProductGrid
                        products={category.products}
                        page={page}
                        pageSize={pageSize}
                        total={productsCount || category.products?.length || 0}
                        onPageChange={(p) => {
                          setPage(p);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    </div>
                  ))
                )}
                {searchQuery && products.length === 0 && (
                  <div className='text-center text-gray-500 mt-8'>
                    No products found for "{searchQuery}".
                  </div>
                )}
                {!searchQuery && hasFilters && products.length === 0 && (
                  <div className='text-center text-gray-500 mt-8'>
                    No products found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
