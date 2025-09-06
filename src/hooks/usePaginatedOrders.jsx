import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Extended to support:
// - reloadKey: force refetch when external mutations happen
// - advancedFilters: { statuses:[], dateFrom, dateTo, paymentMethod, search }
export function usePaginatedOrders(
  page,
  pageSize,
  sortModel = [],
  filterModel = {},
  reloadKey,
  advancedFilters = {},
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

      let query = supabase.from('orders').select('*', { count: 'exact' });

      // apply filters if provided
      if (filterModel.items && filterModel.items.length > 0) {
        filterModel.items.forEach((filter) => {
          if (filter.value !== undefined && filter.value !== '') {
            const { field, operator, value } = filter;
            switch (operator) {
              case 'contains':
                query = query.ilike(field, `%${value}%`);
                break;
              case 'equals':
                query = query.eq(field, value);
                break;
              case 'doesNotContain':
                query = query.not(field, 'ilike', `%${value}%`);
                break;
              case 'doesNotEqual':
                query = query.neq(field, value);
                break;
              default:
                query = query.ilike(field, `%${value}%`);
            }
          }
        });
      }

      // Advanced filters (outside DataGrid model)
      if (advancedFilters) {
        const { statuses, dateFrom, dateTo, paymentMethod, search } =
          advancedFilters;

        if (Array.isArray(statuses) && statuses.length > 0) {
          // Only include valid non-empty statuses
          query = query.in('status', statuses.filter(Boolean));
        }
        if (dateFrom) {
          // start of day ISO
          try {
            const fromISO = new Date(dateFrom + 'T00:00:00').toISOString();
            query = query.gte('created_at', fromISO);
          } catch (_) {
            // ignore parse errors
          }
        }
        if (dateTo) {
          try {
            const toISO = new Date(dateTo + 'T23:59:59').toISOString();
            query = query.lte('created_at', toISO);
          } catch (_) {}
        }
        if (paymentMethod) {
          // This will error if column does not exist, so we catch and ignore gracefully later
          query = query.eq('payment_method', paymentMethod);
        }
        if (search && search.trim()) {
          const s = search.trim();
          const escaped = s.replace(/,/g, '');
          const orParts = [
            `order_number.ilike.%${escaped}%`,
            `customer_email.ilike.%${escaped}%`,
          ];
          // If looks like UUID add exact id match instead of ilike to avoid syntax errors
          if (/^[0-9a-fA-F-]{36}$/.test(escaped)) {
            orParts.push(`id.eq.${escaped}`);
          }
          query = query.or(orParts.join(','));
        }
      }

      // apply sorting if provided
      if (sortModel.length > 0) {
        const { field, sort } = sortModel[0];
        query = query.order(field, { ascending: sort === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

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
  }, [
    page,
    pageSize,
    sortModel,
    filterModel,
    reloadKey,
    JSON.stringify(advancedFilters),
  ]);

  return { rows, rowCount, loading };
}
