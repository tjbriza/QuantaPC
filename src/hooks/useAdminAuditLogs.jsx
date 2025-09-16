import { useMemo } from 'react';
import { useSupabaseRead } from './useSupabaseRead';

export function useAdminAuditLogs(options = {}) {
  const limit = options.limit || 200;
  const key = options.key || undefined;

  // gathering of individual data sources
  const {
    data: orderEditData,
    loading: orderLoading,
    error: orderError,
  } = useSupabaseRead('order_edit_logs', {
    order: { column: 'created_at', ascending: false },
    limit,
    key,
  });

  const {
    data: productLogData,
    loading: productLoading,
    error: productError,
  } = useSupabaseRead('product_edit_logs', {
    order: { column: 'created_at', ascending: false },
    limit,
    key,
  });

  const {
    data: profileLogData,
    loading: profileLoading,
    error: profileError,
  } = useSupabaseRead('profile_edit_logs', {
    order: { column: 'created_at', ascending: false },
    limit,
    key,
  });

  const {
    data: serviceEditData,
    loading: serviceEditLoading,
    error: serviceEditError,
  } = useSupabaseRead('service_request_edit_logs', {
    order: { column: 'created_at', ascending: false },
    limit,
    key,
  });

  const loading =
    orderLoading || productLoading || profileLoading || serviceEditLoading;
  const error =
    orderError || productError || profileError || serviceEditError || null;

  const logs = useMemo(() => {
    if (loading) return [];
    const unified = [];

    if (Array.isArray(orderEditData)) {
      for (const r of orderEditData) {
        const fields = r.changed_fields || [];
        let summary = `Order fields changed: ${fields.join(', ')}`;
        let prev = r.previous_values;
        let next = r.new_values;

        if (fields.includes('status')) {
          const nextStatus = typeof next === 'object' ? next?.status : next;
          const nextMsg =
            typeof next === 'object' ? next?.status_message : undefined;
          const parts = [`Order status → ${nextStatus}`];
          if (typeof nextMsg === 'string' && nextMsg.length)
            parts.push(`: ${nextMsg}`);
          summary = parts.join('');
        }

        // If only status_message changed, clarify summary
        if (!fields.includes('status') && fields.includes('status_message')) {
          const nextMsg =
            typeof next === 'object' ? next?.status_message : undefined;
          summary = `Order status message updated: ${nextMsg || ''}`;
        }

        // Shape prev/new to only include changed relevant fields
        if (fields.includes('status') || fields.includes('status_message')) {
          const shapedPrev = {};
          const shapedNext = {};
          if (fields.includes('status')) {
            shapedPrev.status = r.previous_values?.status;
            shapedNext.status = r.new_values?.status;
          }
          if (fields.includes('status_message')) {
            shapedPrev.status_message = r.previous_values?.status_message;
            shapedNext.status_message = r.new_values?.status_message;
          }
          prev = shapedPrev;
          next = shapedNext;
        }

        unified.push({
          id: `order-edit-${r.id}`,
          type: 'order_edit',
          target_id: r.order_id,
          actor_user_id: r.actor_user_id,
          created_at: r.created_at,
          summary,
          changed_fields: fields,
          previous_values: prev,
          new_values: next,
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

    if (Array.isArray(serviceEditData)) {
      for (const r of serviceEditData) {
        unified.push({
          id: `svc-edit-${r.id}`,
          type: 'service_request_edit',
          target_id: r.service_request_id,
          actor_user_id: r.actor_user_id,
          created_at: r.created_at,
          summary: `Service fields changed: ${(r.changed_fields || []).join(', ')}`,
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
  }, [
    orderEditData,
    productLogData,
    profileLogData,
    serviceEditData,
    loading,
    limit,
  ]);

  return { logs, loading, error };
}
