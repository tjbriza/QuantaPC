import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import Background from '../ui/Background.jsx';
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
      {/* Product Filter - Fixed position, hidden on mobile */}
      <div className="hidden lg:block">
        <ProductFilter />
      </div>
      
      {/* Main content centered */}
      <div className='flex justify-center mt-32'>
        <div className='w-full max-w-6xl px-4'>
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
  );
}
