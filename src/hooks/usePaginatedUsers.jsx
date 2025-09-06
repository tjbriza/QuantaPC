import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function usePaginatedUsers(
  page,
  pageSize,
  sortModel = [],
  filterModel = {},
  reloadKey,
) {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      const from = page * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('user_with_profile')
        .select('*', { count: 'exact' });

      // apply filters if provided
      if (filterModel.items && filterModel.items.length > 0) {
        filterModel.items.forEach((filter) => {
          if (filter.value !== undefined && filter.value !== '') {
            const { field, operator, value } = filter;

            switch (operator) {
              case 'contains':
                query = query.ilike(field, `%${value}%`);
                break;
              case 'doesNotContain':
                query = query.not(field, 'ilike', `%${value}%`);
                break;
              case 'equals':
                query = query.eq(field, value);
                break;
              case 'doesNotEqual':
                query = query.neq(field, value);
                break;
              case 'startsWith':
                query = query.ilike(field, `${value}%`);
                break;
              case 'endsWith':
                query = query.ilike(field, `%${value}`);
                break;
              case 'isEmpty':
                query = query.is(field, null);
                break;
              case 'isNotEmpty':
                query = query.not(field, 'is', null);
                break;
              case 'isAnyOf':
                if (Array.isArray(value)) {
                  query = query.in(field, value);
                }
                break;
              default:
                // default to contains for unknown operators
                query = query.ilike(field, `%${value}%`);
            }
          }
        });
      }

      // apply sorting if provided
      if (sortModel.length > 0) {
        const { field, sort } = sortModel[0];
        query = query.order(field, { ascending: sort === 'asc' });
      } else {
        // default sorting
        query = query.order('auth_created_at', { ascending: false });
      }

      // apply pagination
      const { data, error, count } = await query.range(from, to);

      if (error) {
        console.error(error);
      } else if (isMounted) {
        setRows(data || []);
        setRowCount(count || 0);
      }

      setLoading(false);
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [page, pageSize, sortModel, filterModel, reloadKey]);

  return { rows, rowCount, loading };
}
