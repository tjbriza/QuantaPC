import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function usePaginatedProducts(
  page,
  pageSize,
  sortModel = [],
  filterModel = {},
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

      let query = supabase.from('products').select(
        `
          *,
          categories:category_id (
            id,
            name
          )
        `,
        { count: 'exact' },
      );
      // apply filters if provided
      if (filterModel.items && filterModel.items.length > 0) {
        filterModel.items.forEach((filter) => {
          if (filter.value !== undefined && filter.value !== '') {
            const { field, operator, value } = filter;

            // handle category filtering
            if (field === 'category') {
              // filter by category name instead of ID
              switch (operator) {
                case 'contains':
                  query = query.ilike('categories.name', `%${value}%`);
                  break;
                case 'doesNotContain':
                  query = query.not('categories.name', 'ilike', `%${value}%`);
                  break;
                case 'equals':
                  query = query.eq('categories.name', value);
                  break;
                case 'doesNotEqual':
                  query = query.neq('categories.name', value);
                  break;
                case 'startsWith':
                  query = query.ilike('categories.name', `${value}%`);
                  break;
                case 'endsWith':
                  query = query.ilike('categories.name', `%${value}`);
                  break;
                default:
                  query = query.ilike('categories.name', `%${value}%`);
              }
            } else {
              // handle other fields normally
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
                  query = query.ilike(field, `%${value}%`);
              }
            }
          }
        });
      }

      console.log(rows);

      // apply sorting if provided
      if (sortModel.length > 0) {
        const { field, sort } = sortModel[0];

        // handle category sorting
        if (field === 'category') {
          query = query.order('categories.name', { ascending: sort === 'asc' });
        } else {
          query = query.order(field, { ascending: sort === 'asc' });
        }
      } else {
        // default sorting
        query = query.order('created_at', { ascending: false });
      }

      // apply pagination
      const { data, error, count } = await query.range(from, to);

      if (error) {
        console.error(error);
      } else if (isMounted) {
        // transform the data to flatten the category object
        const transformedData = (data || []).map((product) => ({
          ...product,
          category: product.categories?.name || 'No Category',
          category_id: product.category_id,
        }));

        setRows(transformedData);
        setRowCount(count || 0);
      }

      setLoading(false);
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [page, pageSize, sortModel, filterModel]);

  return { rows, rowCount, loading };
}
