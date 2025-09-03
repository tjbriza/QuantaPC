import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
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

  const {
    data: products,
    error: productError,
    loading: productLoading,
  } = useSupabaseRead(
    'products',
    searchQuery
      ? {
          filter: {
            or: `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`,
          },
        }
      : {},
  );

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
              <ProductFilter />
            </div>

            {/* Product list */}
            <div className='flex-1 flex justify-center'>
              <div
                className='w-full overflow-y-auto pr-4 pb-8'
                style={{ height: '70vh' }}
              >
                {categorizedProducts.map((category) => (
                  <CategorySection
                    key={category.id}
                    title={searchQuery ? undefined : category.name}
                    products={category.products}
                  />
                ))}
                {searchQuery && products.length === 0 && (
                  <div className='text-center text-gray-500 mt-8'>
                    No products found for "{searchQuery}".
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
