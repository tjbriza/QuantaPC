import { Card, CardContent, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

export function OrdersSummaryBarChart({ kpis, loading }) {
  const orderBars = [
    { label: 'Today', value: kpis.ordersToday || 0 },
    { label: '7d', value: kpis.orders7d || 0 },
    { label: '30d', value: kpis.orders30d || 0 },
  ];
  const revenueBars = [
    { label: 'Today', value: kpis.revenueToday || 0 },
    { label: '7d', value: kpis.revenue7d || 0 },
    { label: '30d', value: kpis.revenue30d || 0 },
  ];
  return (
    <Card elevation={2} sx={{ height: '100%', borderRadius: 3 }}>
      <CardContent>
        <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 1 }}>
          Orders & Revenue (Periods)
        </Typography>
        <BarChart
          loading={loading}
          height={280}
          series={[
            {
              id: 'orders',
              label: 'Orders',
              data: orderBars.map((b) => b.value),
              color: '#1976d2',
            },
            {
              id: 'revenue',
              label: 'Revenue',
              data: revenueBars.map((b) =>
                Number(b.value.toFixed ? b.value.toFixed(2) : b.value),
              ),
              color: '#9c27b0',
              yAxisKey: 'right',
            },
          ]}
          xAxis={[{ data: orderBars.map((b) => b.label), scaleType: 'band' }]}
          yAxis={[{ id: 'left' }, { id: 'right', position: 'right' }]}
          margin={{ left: 40, right: 50, top: 20, bottom: 30 }}
        />
      </CardContent>
    </Card>
  );
}
