import { useMemo } from 'react';
import { useSupabaseRead } from './useSupabaseRead';

export function useAdminAuditLogs(options = {}) {
  const limit = options.limit || 200;

  // gathering of individual data sources
  const {
    data: orderStatusData,
    loading: orderLoading,
    error: orderError,
  } = useSupabaseRead('order_status_history', {
    select: 'id, order_id, status, message, created_at, created_by',
    order: { column: 'created_at', ascending: false },
    limit,
  });

  const {
    data: productLogData,
    loading: productLoading,
    error: productError,
  } = useSupabaseRead('product_edit_logs', {
    order: { column: 'created_at', ascending: false },
    limit,
  });

  const {
    data: profileLogData,
    loading: profileLoading,
    error: profileError,
  } = useSupabaseRead('profile_edit_logs', {
    order: { column: 'created_at', ascending: false },
    limit,
  });

  const loading = orderLoading || productLoading || profileLoading;
  const error = orderError || productError || profileError || null;

  const logs = useMemo(() => {
    if (loading) return [];
    const unified = [];

    if (Array.isArray(orderStatusData)) {
      for (const r of orderStatusData) {
        unified.push({
          id: `order-${r.id}`,
          type: 'order_status',
          target_id: r.order_id,
          actor_user_id: r.created_by || null,
          created_at: r.created_at,
          summary: `Order status → ${r.status}: ${r.message}`,
          changed_fields: ['status'],
          previous_values: null,
          new_values: { status: r.status },
          raw: r,
        });
      }
    }

    if (Array.isArray(productLogData)) {
      for (const r of productLogData) {
        unified.push({
          id: `product-${r.id}`,
          type: 'product_edit',
          target_id: r.product_id,
          actor_user_id: r.actor_user_id,
          created_at: r.created_at,
          summary: `Product fields changed: ${(r.changed_fields || []).join(', ')}`,
          changed_fields: r.changed_fields || [],
          previous_values: r.previous_values,
          new_values: r.new_values,
          raw: r,
        });
      }
    }

    if (Array.isArray(profileLogData)) {
      for (const r of profileLogData) {
        unified.push({
          id: `profile-${r.id}`,
          type: 'profile_edit',
          target_id: r.edited_user_id,
          actor_user_id: r.actor_user_id,
          created_at: r.created_at,
          summary: `Profile fields changed: ${(r.changed_fields || []).join(', ')}`,
          changed_fields: r.changed_fields || [],
          previous_values: r.previous_values,
          new_values: r.new_values,
          raw: r,
        });
      }
    }

    // Sort descending by raw timestamp string
    unified.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    return unified.slice(0, limit);
  }, [orderStatusData, productLogData, profileLogData, loading, limit]);

  return { logs, loading, error };
}
