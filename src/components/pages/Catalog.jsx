import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import ProductGrid from '../ui/ProductCatalog/ProductGrid.jsx';
import CategorySection from '../ui/CategorySection.jsx';
import ProductFilter from '../ui/ProductCatalog/ProductFilter.jsx';

export default function Catalog() {
  const { session } = useAuth();

  // Define title and titleStyle for the catalog
  const title = 'ALL BUILDS';
  const titleStyle = {
    fontSize: '5rem',
    color: '#282E41'
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
  } = useSupabaseRead('products');

  const categorizedProducts = categories.map((category) => ({
    ...category,
    products: products.filter((p) => p.category_id === category.id),
  }));

  if (categoryLoading || productLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (categoryError || productError) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error loading data</div>;
  }

  return (
    <div className='min-h-screen'>
      <div className='pt-32 pb-8 w-full flex justify-center items-center'>
        <h2 
          className='text-2xl font-semibold text-black mb-6 text-center w-full'
          style={title === 'ALL BUILDS' ? titleStyle : {}}
        >
          {title}
        </h2>
      </div>
      
      <div className='p-2 md:p-4'>
        <div className='mx-auto max-w-[90rem]'>
          <div className='flex px-4 md:px-8'>
            <div className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 lg:flex-shrink-0">
              <ProductFilter />
            </div>
            
            <div className='flex-1 flex justify-center'>
              <div className='w-full overflow-y-auto pr-4 pb-8' style={{ height: '70vh' }}>
                {categorizedProducts.map((category) => (
                  <CategorySection
                    key={category.id} 
                    title={category.name}
                    products={category.products}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
