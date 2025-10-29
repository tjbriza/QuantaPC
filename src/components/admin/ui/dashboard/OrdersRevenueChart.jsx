import { Card, CardContent, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

export function OrdersRevenueChart({ data = [], loading }) {
  const dates = data.map((d) => d.date.slice(5)); // MM-DD
  const orders = data.map((d) => d.orders);
  const revenue = data.map((d) => Number(d.revenue?.toFixed(2)));

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
          Orders & Revenue (Last 14 Days)
        </Typography>
        <LineChart
          loading={loading}
          slotProps={{ legend: { hidden: false } }}
          xAxis={[{ scaleType: 'point', data: dates }]}
          series={[
            { id: 'orders', data: orders, label: 'Orders', color: '#1976d2' },
            {
              id: 'revenue',
              data: revenue,
              label: 'Revenue',
              yAxisKey: 'right',
              color: '#9c27b0',
            },
          ]}
          yAxis={[{ id: 'left' }, { id: 'right', position: 'right' }]}
          height={280}
          margin={{ left: 40, right: 40, top: 20, bottom: 20 }}
        />
      </CardContent>
    </Card>
  );
}
