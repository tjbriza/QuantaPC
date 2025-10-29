import { Card, CardContent, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

export function OrdersKpiBarChart({ kpis, loading }) {
  const orderData = [
    { label: 'Today', orders: kpis.ordersToday || 0 },
    { label: '7d', orders: kpis.orders7d || 0 },
    { label: '30d', orders: kpis.orders30d || 0 },
  ];
  const revenueData = [
    { label: 'Today', revenue: kpis.revenueToday || 0 },
    { label: '7d', revenue: kpis.revenue7d || 0 },
    { label: '30d', revenue: kpis.revenue30d || 0 },
  ];
  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ flex: 1, minHeight: 0 }}>
        <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
          Orders (Counts)
        </Typography>
        <BarChart
          loading={loading}
          height={180}
          xAxis={[{ scaleType: 'band', data: orderData.map((d) => d.label) }]}
          series={[
            {
              data: orderData.map((d) => d.orders),
              label: 'Orders',
              color: '#1976d2',
            },
          ]}
          margin={{ left: 40, right: 10, top: 10, bottom: 20 }}
        />
        <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
          Revenue
        </Typography>
        <BarChart
          loading={loading}
          height={180}
          xAxis={[{ scaleType: 'band', data: revenueData.map((d) => d.label) }]}
          series={[
            {
              data: revenueData.map((d) =>
                Number(d.revenue.toFixed ? d.revenue.toFixed(2) : d.revenue),
              ),
              label: 'Revenue',
              color: '#9c27b0',
            },
          ]}
          margin={{ left: 40, right: 10, top: 10, bottom: 20 }}
        />
      </CardContent>
    </Card>
  );
}
