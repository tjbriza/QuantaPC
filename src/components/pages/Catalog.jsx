import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import ProductGrid from '../ui/ProductCatalog/ProductGrid.jsx';
import CategorySection from '../ui/CategorySection.jsx';
import ProductFilter from '../ui/ProductCatalog/ProductFilter.jsx';

export default function Catalog() {
  const { session } = useAuth();

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
      {/* Responsive layout container */}
      <div className='flex mt-32'>
        {/* Product Filter - Responsive sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 lg:flex-shrink-0 lg:pl-4 xl:pl-8">
          <ProductFilter />
        </div>
        
        {/* Main content with proper spacing */}
        {/* To move products: increase paddingLeft value to move right, decrease to move left */}
        {/* Current: 2rem = reduced gap between filter and products */}
        <div className='flex-1' style={{ paddingLeft: '4.2rem' }}>
          <div className='w-full max-w-6xl px-4 lg:px-0'>
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
  );
}
