import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAdminKpis } from '../../../hooks/useAdminKpis';
import { KpiCard } from '../ui/dashboard/KpiCard';
import { OrdersRevenueUnifiedChart } from '../ui/dashboard/OrdersRevenueUnifiedChart';
import { LowStockProductsChart } from '../ui/dashboard/LowStockProductsChart';
import { TopProductsList } from '../ui/dashboard/TopProductsList';
import { NewReturningChart } from '../ui/dashboard/NewReturningChart';
import {
  ShoppingCart,
  Hourglass,
  Users as UsersIcon,
  Boxes,
  PackageMinus,
  PiggyBank,
  CalendarRange,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  RotateCcw,
} from 'lucide-react';

export default function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const { loading, error, kpis, series, lowStockProducts, topProducts } =
    useAdminKpis({
      refreshKey,
    });

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant='h5' fontWeight={700} sx={{ flex: 1 }}>
          Admin Dashboard
        </Typography>
        <Tooltip title='Refresh KPIs'>
          <span>
            <IconButton
              size='small'
              disabled={loading}
              onClick={() => setRefreshKey(Date.now())}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <RefreshIcon fontSize='small' />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      {error && (
        <Box sx={{ color: 'error.main', fontSize: 14 }}>
          Failed to load metrics. Please try again.
        </Box>
      )}
      <Grid container spacing={2} columns={12}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label='Total Orders'
            value={kpis.totalOrders}
            caption='All time'
            icon={ShoppingCart}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label='Pending Orders'
            value={kpis.pendingOrders}
            caption='Awaiting processing'
            icon={Hourglass}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label='Users'
            value={kpis.totalUsers}
            caption='Registered profiles'
            icon={UsersIcon}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label='Products'
            value={kpis.totalProducts}
            caption='Catalog size'
            icon={Boxes}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label='Low Stock'
            value={kpis.lowStock}
            caption={'\u2264 5 units'}
            icon={PackageMinus}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label='Revenue Today'
            value={kpis.revenueToday}
            caption='Since 00:00'
            valuePrefix='₱'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label='Revenue 7d'
            value={kpis.revenue7d}
            caption='Last 7 days'
            icon={PiggyBank}
            valuePrefix='₱'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label='Revenue 30d'
            value={kpis.revenue30d}
            caption='Last 30 days'
            icon={CalendarRange}
            valuePrefix='₱'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label='AOV 30d'
            value={kpis.averageOrderValue30d}
            caption='Avg order value'
            valuePrefix='₱'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <KpiCard
            label='Paid'
            value={kpis.paidOrders}
            caption='Paid'
            icon={CheckCircle2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <KpiCard
            label='Shipped'
            value={kpis.shippedOrders}
            caption='Shipped'
            icon={Truck}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <KpiCard
            label='Delivered'
            value={kpis.deliveredOrders}
            caption='Delivered'
            icon={PackageCheck}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <KpiCard
            label='Cancelled'
            value={kpis.cancelledOrders}
            caption='Cancelled'
            icon={XCircle}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <KpiCard
            label='Refunded'
            value={kpis.refundedOrders}
            caption='Refunded'
            icon={RotateCcw}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} alignItems='stretch'>
        <Grid item xs={12} md={7}>
          <OrdersRevenueUnifiedChart
            data={series.ordersDaily}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <NewReturningChart
            newCount={kpis.newCustomers30d}
            returningCount={kpis.returningCustomers30d}
            loading={loading}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} alignItems='stretch'>
        <Grid item xs={12} md={6}>
          <TopProductsList products={topProducts} loading={loading} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LowStockProductsChart
            products={lowStockProducts}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
