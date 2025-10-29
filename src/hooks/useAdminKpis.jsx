import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// Utility to get start of period ISO strings
function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
function startOfNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return startOfDay(d);
}

// Fetch aggregate counts safely
async function countTable(table, filterCb) {
  let query = supabase.from(table).select('id', { count: 'exact', head: true });
  if (filterCb) query = filterCb(query);
  const { count, error } = await query;
  if (error) {
    console.error('KPI count error', table, error);
    return 0;
  }
  return count || 0;
}

// Fetch sum for orders total_amount
async function sumOrderRevenue({ fromISO, toISO }) {
  let query = supabase.from('orders').select('total_amount');
  if (fromISO) query = query.gte('created_at', fromISO);
  if (toISO) query = query.lte('created_at', toISO);
  const { data, error } = await query;
  if (error) {
    console.error('Revenue sum error', error);
    return 0;
  }
  return (data || []).reduce(
    (acc, r) => acc + (Number(r.total_amount) || 0),
    0,
  );
}

// Time series buckets (daily) for last N days
async function ordersDailySeries(days = 14) {
  const fromISO = startOfNDaysAgo(days - 1); // include today
  const { data, error } = await supabase
    .from('orders')
    .select('created_at,total_amount,status');
  if (error) {
    console.error('ordersDailySeries error', error);
    return [];
  }
  const map = new Map();
  // Initialize map for each day
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    map.set(key, { date: key, orders: 0, revenue: 0 });
  }
  (data || []).forEach((row) => {
    const dateKey = row.created_at?.slice(0, 10);
    if (!dateKey || !map.has(dateKey)) return;
    const bucket = map.get(dateKey);
    bucket.orders += 1;
    bucket.revenue += Number(row.total_amount) || 0;
  });
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function useAdminKpis(options = {}) {
  const { refreshKey } = options;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpis, setKpis] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    refundedOrders: 0,
    paidOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    lowStock: 0,
    revenueToday: 0,
    revenue7d: 0,
    revenue30d: 0,
    ordersToday: 0,
    orders7d: 0,
    orders30d: 0,
    averageOrderValue30d: 0,
    newCustomers30d: 0,
    returningCustomers30d: 0,
  });
  const [series, setSeries] = useState({ ordersDaily: [] });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]); // {product_id, name, units, revenue}

  useEffect(() => {
    let active = true;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const todayStart = startOfDay();
        const sevenDaysAgo = startOfNDaysAgo(6); // inclusive
        const thirtyDaysAgo = startOfNDaysAgo(29);

        // Additional order period counts
        const ordersTodayPromise = countTable('orders', (q) =>
          q.gte('created_at', todayStart),
        );
        const orders7dPromise = countTable('orders', (q) =>
          q.gte('created_at', sevenDaysAgo),
        );
        const orders30dPromise = countTable('orders', (q) =>
          q.gte('created_at', thirtyDaysAgo),
        );

        // Low stock products detail list
        const lowStockProductsPromise = supabase
          .from('products')
          .select('id,name,stock_quantity')
          .lte('stock_quantity', 5)
          .order('stock_quantity', { ascending: true })
          .limit(10);

        const [
          totalOrders,
          pendingOrders,
          shippedOrders,
          deliveredOrders,
          cancelledOrders,
          refundedOrders,
          paidOrders,
          totalUsers,
          totalProducts,
          lowStock,
          revenueToday,
          revenue7d,
          revenue30d,
          ordersDaily,
          ordersToday,
          orders7d,
          orders30d,
          lowStockProductsRes,
        ] = await Promise.all([
          countTable('orders'),
          countTable('orders', (q) => q.eq('status', 'pending')),
          countTable('orders', (q) => q.eq('status', 'shipped')),
          countTable('orders', (q) => q.eq('status', 'delivered')),
          countTable('orders', (q) => q.eq('status', 'cancelled')),
          countTable('orders', (q) => q.eq('status', 'refunded')),
          countTable('orders', (q) => q.eq('status', 'paid')),
          countTable('profiles'),
          countTable('products'),
          countTable('products', (q) => q.lte('stock_quantity', 5)),
          sumOrderRevenue({ fromISO: todayStart }),
          sumOrderRevenue({ fromISO: sevenDaysAgo }),
          sumOrderRevenue({ fromISO: thirtyDaysAgo }),
          ordersDailySeries(14),
          ordersTodayPromise,
          orders7dPromise,
          orders30dPromise,
          lowStockProductsPromise,
        ]);

        // Compute AOV & new vs returning & top products
        // Fetch last 30d paid/delivered/shipped orders for AOV + customer segmentation
        const statusForCompleted = ['paid', 'shipped', 'delivered'];
        const { data: recentOrders, error: recentOrdersError } = await supabase
          .from('orders')
          .select('id, created_at, customer_email, total_amount')
          .gte('created_at', thirtyDaysAgo)
          .in('status', statusForCompleted);
        let averageOrderValue30d = 0;
        let newCustomers30d = 0;
        let returningCustomers30d = 0;
        if (
          !recentOrdersError &&
          Array.isArray(recentOrders) &&
          recentOrders.length
        ) {
          const totalValue = recentOrders.reduce(
            (s, o) => s + (Number(o.total_amount) || 0),
            0,
          );
          averageOrderValue30d = recentOrders.length
            ? totalValue / recentOrders.length
            : 0;
          // Determine first order date per customer_email
          const emailFirstMap = new Map();
          recentOrders.forEach((o) => {
            if (!o.customer_email) return;
            const existing = emailFirstMap.get(o.customer_email);
            const created = new Date(o.created_at).getTime();
            if (!existing || created < existing)
              emailFirstMap.set(o.customer_email, created);
          });
          const thirtyDaysStartMs = new Date(thirtyDaysAgo).getTime();
          // Need historical earliest order before window -> fetch min created_at per email optional
          // Simpler: fetch distinct earlier orders for those emails to classify returning
          const emails = Array.from(emailFirstMap.keys());
          if (emails.length) {
            const { data: earlierOrders } = await supabase
              .from('orders')
              .select('customer_email, created_at')
              .lt('created_at', thirtyDaysAgo)
              .in('customer_email', emails)
              .limit(5000);
            const earlierSet = new Set(
              (earlierOrders || []).map((r) => r.customer_email),
            );
            emails.forEach((e) => {
              const firstInWindow = emailFirstMap.get(e) >= thirtyDaysStartMs;
              if (firstInWindow && !earlierSet.has(e)) newCustomers30d += 1;
              else returningCustomers30d += 1;
            });
          }
        }

        // Top selling products (last 30d) via order_items join
        const { data: orderItemsData, error: orderItemsError } = await supabase
          .from('order_items')
          .select('product_id, quantity, price_each, product:products(name)')
          .gte('created_at', thirtyDaysAgo)
          .limit(5000);
        let topProductsList = [];
        if (!orderItemsError && Array.isArray(orderItemsData)) {
          const agg = new Map();
          orderItemsData.forEach((row) => {
            const id = row.product_id;
            if (!id) return;
            const entry = agg.get(id) || {
              product_id: id,
              name: row.product?.name || 'Unknown',
              units: 0,
              revenue: 0,
            };
            entry.units += Number(row.quantity) || 0;
            entry.revenue +=
              (Number(row.quantity) || 0) * (Number(row.price_each) || 0);
            agg.set(id, entry);
          });
          topProductsList = Array.from(agg.values())
            .sort((a, b) => b.units - a.units)
            .slice(0, 10);
        }

        if (!active) return;
        setKpis({
          totalOrders,
          pendingOrders,
          shippedOrders,
          deliveredOrders,
          cancelledOrders,
          refundedOrders,
          paidOrders,
          totalUsers,
          totalProducts,
          lowStock,
          revenueToday,
          revenue7d,
          revenue30d,
          ordersToday,
          orders7d,
          orders30d,
          averageOrderValue30d,
          newCustomers30d,
          returningCustomers30d,
        });
        setSeries({ ordersDaily });
        setLowStockProducts(
          lowStockProductsRes.error ? [] : lowStockProductsRes.data || [],
        );
        setTopProducts(topProductsList);
      } catch (err) {
        console.error('KPI load failed', err);
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  return { loading, error, kpis, series, lowStockProducts, topProducts };
}
