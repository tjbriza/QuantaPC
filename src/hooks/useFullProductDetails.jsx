import { useEffect, useState } from 'react';
import { useSupabaseRead } from './useSupabaseRead';

export function useFullProductDetails(productId) {
  const id = productId;

  const {
    data: product,
    loading: productLoading,
    error: productError,
  } = useSupabaseRead('products', {
    filter: { id: id },
    single: true,
    select: '*, category:categories(id, name)',
  });

  const categoryName = product?.category?.name;

  const [specTable, setSpecTable] = useState(null);
  const [specEnabled, setSpecEnabled] = useState(false);

  useEffect(() => {
    if (categoryName) {
      setSpecTable(categoryName.toLowerCase());
      setSpecEnabled(true);
    }
  }, [categoryName]);

  const {
    data: spec,
    loading: specLoading,
    error: specError,
  } = useSupabaseRead(
    specTable,
    {
      filter: { product_id: productId },
      single: true,
    },
    {
      enabled: specEnabled,
    }
  );

  return {
    product,
    productLoading,
    productError,
    spec,
    specLoading,
    specError,
  };
}
