// custom hook for reading data from supabase!!!!
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// to use read hook!! sample usage:
// const { data, loading, error } = useSupabaseRead('products', {
//   select: 'id, name, price',
//   filter: { category: 'electronics', available: true },
//   order: { column: 'price', ascending: true },
//   limit: 5,
//   random: false, // set to true for random ordering
//   single: false,
// });

export function useSupabaseRead(tableName, queryOptions = {}) {
  const [data, setData] = useState(queryOptions.single ? null : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(undefined);

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
        const wantsCount = !!queryOptions.withCount;
        let query = supabase
          .from(tableName)
          .select(queryOptions.select || '*', {
            count: wantsCount ? 'exact' : undefined,
          });

        // Apply advanced filters: eq, neq, ilike, or
        if (queryOptions.filter) {
          for (const key in queryOptions.filter) {
            const value = queryOptions.filter[key];
            if (typeof value === 'object') {
              if (value.neq !== undefined) {
                query = query.neq(key, value.neq);
              } else if (value.ilike !== undefined) {
                query = query.ilike(key, value.ilike);
              }
            } else if (key === 'or') {
              query = query.or(value);
            } else {
              query = query.eq(key, value);
            }
          }
        }

        // Apply normal ordering only (random will be done client-side)
        if (!queryOptions.random && queryOptions.order) {
          query = query.order(queryOptions.order.column, {
            ascending: queryOptions.order.ascending,
          });
        }

        // Pagination (server-side) has priority over simple limit
        if (
          Number.isInteger(queryOptions.page) &&
          Number.isInteger(queryOptions.pageSize)
        ) {
          const page = Math.max(1, Number(queryOptions.page)); // 1-based
          const size = Math.max(1, Number(queryOptions.pageSize));
          const from = (page - 1) * size;
          const to = from + size - 1;
          query = query.range(from, to);
        } else if (!queryOptions.random && queryOptions.limit) {
          // Don't apply limit here if random is true (limit after shuffle)
          query = query.limit(queryOptions.limit);
        }

        // Single row option
        if (queryOptions.single) {
          query = query.single();
        }

        const {
          data: fetchedData,
          error: fetchError,
          count: total,
        } = await query;

        if (fetchError) {
          if (queryOptions.single && fetchError.code === 'PGRST116') {
            setData(null);
          } else {
            throw fetchError;
          }
        } else {
          let finalData = fetchedData;

          // Shuffle client-side if random
          if (queryOptions.random && Array.isArray(finalData)) {
            finalData = [...finalData].sort(() => 0.5 - Math.random());
            if (queryOptions.limit) {
              finalData = finalData.slice(0, queryOptions.limit);
            }
          }

          setData(finalData);
          if (wantsCount) setCount(total ?? 0);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tableName, JSON.stringify(queryOptions), enabled]);

  return { data, loading, error, count };
}
