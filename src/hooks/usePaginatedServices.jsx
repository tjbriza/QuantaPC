import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// Server-side pagination for service_requests with joins to services and technicians
// advancedFilters: { statuses:[], dateFrom, dateTo, paymentMethod, search, serviceId, technicianId }
export function usePaginatedServices(
  page,
  pageSize,
  sortModel = [],
  filterModel = {},
  reloadKey,
  advancedFilters = {},
  selectExtra = '*',
) {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      const from = page * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('service_requests')
        .select(
          `${selectExtra}, service:services(id, key, name), technician:technicians(id, name)`,
          { count: 'exact' },
        );

      // DataGrid filter model (basic contains/equals)
      if (filterModel.items && filterModel.items.length > 0) {
        filterModel.items.forEach((f) => {
          if (f.value === undefined || f.value === '') return;
          const { field, operator, value } = f;
          switch (operator) {
            case 'equals':
              query = query.eq(field, value);
              break;
            case 'doesNotEqual':
              query = query.neq(field, value);
              break;
            case 'contains':
            default:
              query = query.ilike(field, `%${value}%`);
          }
        });
      }

      // Advanced filters
      const {
        statuses,
        dateFrom,
        dateTo,
        paymentMethod,
        search,
        serviceId,
        technicianId,
      } = advancedFilters || {};

      if (Array.isArray(statuses) && statuses.length > 0) {
        query = query.in('status', statuses.filter(Boolean));
      }
      if (dateFrom) {
        try {
          query = query.gte(
            'created_at',
            new Date(dateFrom + 'T00:00:00').toISOString(),
          );
        } catch {}
      }
      if (dateTo) {
        try {
          query = query.lte(
            'created_at',
            new Date(dateTo + 'T23:59:59').toISOString(),
          );
        } catch {}
      }
      if (paymentMethod) {
        query = query.eq('payment_method', paymentMethod);
      }
      if (serviceId) {
        query = query.eq('service_id', serviceId);
      }
      if (technicianId) {
        query = query.eq('technician_id', technicianId);
      }
      if (search && search.trim()) {
        const s = search.trim().replace(/,/g, '');
        const orParts = [
          `service_number.ilike.%${s}%`,
          `contact_email.ilike.%${s}%`,
          `contact_name.ilike.%${s}%`,
        ];
        if (/^[0-9a-fA-F-]{36}$/.test(s)) {
          orParts.push(`id.eq.${s}`);
        }
        query = query.or(orParts.join(','));
      }

      // Sorting
      if (sortModel.length > 0) {
        const { field, sort } = sortModel[0];
        query = query.order(field, { ascending: sort === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error, count } = await query.range(from, to);
      if (!mounted) return;
      if (error) {
        console.error('usePaginatedServices error', error);
        setRows([]);
        setRowCount(0);
      } else {
        setRows(data || []);
        setRowCount(count || 0);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [
    page,
    pageSize,
    sortModel,
    filterModel,
    reloadKey,
    JSON.stringify(advancedFilters),
    selectExtra,
  ]);

  return { rows, rowCount, loading };
}
