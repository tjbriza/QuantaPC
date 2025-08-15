import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import Background from '../ui/Background.jsx';
import ProductGrid from '../ui/ProductCatalog/ProductGrid.jsx';
import CategorySection from '../ui/CategorySection.jsx';
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

  return (
    <div className='min-h-screen flex item-center mt-16'>
      {categorizedProducts.map((category) => (
        <CategorySection
          key={category.id} 
          title={category.name}
          products={category.products}
        />
      ))}
    </div>
  );
}
