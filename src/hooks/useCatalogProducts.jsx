import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useCatalogProducts(
  filters = {},
  searchQuery = '',
  page = 1,
  pageSize = 12,
) {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchProducts = async () => {
      try {
        console.log(
          'useCatalogProducts: Fetching with filters:',
          filters,
          'searchQuery:',
          searchQuery,
          'page:',
          page,
        );

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = supabase.from('products').select(
          `
            id,
            name,
            description,
            price,
            stock_quantity,
            category_id,
            brand,
            image_url,
            created_at,
            categories:category_id (
              id,
              name
            )
          `,
          { count: 'exact' },
        );

        // Apply search filter
        if (searchQuery && searchQuery.trim()) {
          const search = searchQuery.trim();
          console.log('useCatalogProducts: Applying search filter:', search);
          query = query.or(
            `name.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`,
          );
        }

        // Apply category filter
        if (
          filters.categories &&
          Array.isArray(filters.categories) &&
          filters.categories.length > 0
        ) {
          console.log(
            'useCatalogProducts: Applying category filter:',
            filters.categories,
          );
          query = query.in('category_id', filters.categories);
        }

        // Apply price range filters (pass as string to avoid JS number coercion/precision issues)
        const isDigits = (v) => typeof v === 'string' && /^\d+$/.test(v);
        if (filters.priceMin && isDigits(String(filters.priceMin))) {
          console.log(
            'useCatalogProducts: Applying price min filter:',
            filters.priceMin,
          );
          query = query.gte('price', String(filters.priceMin));
        }

        if (filters.priceMax && isDigits(String(filters.priceMax))) {
          console.log(
            'useCatalogProducts: Applying price max filter:',
            filters.priceMax,
          );
          query = query.lte('price', String(filters.priceMax));
        }

        // Apply default sorting
        query = query.order('created_at', { ascending: false });

        // Apply pagination
        const {
          data,
          error: fetchError,
          count: totalCount,
        } = await query.range(from, to);

        console.log('useCatalogProducts: Query result:', {
          data,
          error: fetchError,
          count: totalCount,
        });

        if (fetchError) {
          throw fetchError;
        }

        if (isMounted) {
          // Transform the data to flatten the category object
          const transformedData = (data || []).map((product) => ({
            ...product,
            category: product.categories?.name || 'No Category',
            category_id: product.category_id,
          }));

          setProducts(transformedData);
          setCount(totalCount || 0);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching catalog products:', err);
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(filters), searchQuery, page, pageSize]);

  return { products, count, loading, error };
}
