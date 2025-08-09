//custom hook for reading data from supabase!!!!
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// to use read hook!! sample usage:
// const { data, loading, error } = useSupabaseRead('products', {
//   select: 'id, name, price',
//   filter: { category: 'electronics', available: true },
//   order: { column: 'price', ascending: true },
//   limit: 5,
//   single: false,
// });
// covers most db read features/operations i need.

export function useSupabaseRead(tableName, queryOptions = {}) {
  const [data, setData] = useState(queryOptions.single ? null : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const enabled =
    queryOptions.enabled !== undefined ? queryOptions.enabled : true;

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        let query = supabase.from(tableName).select(queryOptions.select || '*');

        if (queryOptions.filter) {
          for (const key in queryOptions.filter) {
            query = query.eq(key, queryOptions.filter[key]);
          }
        }
        if (queryOptions.order) {
          query = query.order(queryOptions.order.column, {
            ascending: queryOptions.order.ascending,
          });
        }
        if (queryOptions.limit) {
          query = query.limit(queryOptions.limit);
        }
        if (queryOptions.single) {
          query = query.single();
        }

        const { data: fetchedData, error: fetchError } = await query;

        if (fetchError) {
          if (queryOptions.single && fetchError.code === 'PGRST116') {
            setData(null);
          } else {
            throw fetchError;
          }
        } else {
          setData(fetchedData);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [tableName, JSON.stringify(queryOptions), enabled]);
  return { data, loading, error };
}
