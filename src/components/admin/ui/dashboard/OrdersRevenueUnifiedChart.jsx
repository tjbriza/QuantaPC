import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  TextField,
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

// props: data [{date, orders, revenue}], loading
export function OrdersRevenueUnifiedChart({ data = [], loading }) {
  const [range, setRange] = useState('30d'); // 'today' | '7d' | '30d' | 'custom'
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const filtered = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const now = new Date();
    let fromDate = null;
    switch (range) {
      case 'today':
        fromDate = new Date();
        fromDate.setHours(0, 0, 0, 0);
        break;
      case '7d':
        fromDate = new Date(now);
        fromDate.setDate(fromDate.getDate() - 6);
        break;
      case '30d':
        fromDate = new Date(now);
        fromDate.setDate(fromDate.getDate() - 29);
        break;
      case 'custom':
        if (customFrom) fromDate = new Date(customFrom + 'T00:00:00');
        break;
      default:
        fromDate = null;
    }
    const toDate =
      range === 'custom' && customTo ? new Date(customTo + 'T23:59:59') : now;
    return data.filter((d) => {
      const dDate = new Date(d.date);
      if (fromDate && dDate < fromDate) return false;
      if (toDate && dDate > toDate) return false;
      return true;
    });
  }, [data, range, customFrom, customTo]);

  const xLabels = filtered.map((d) => d.date.slice(5));
  const orders = filtered.map((d) => d.orders);
  const revenue = filtered.map((d) => Number(d.revenue?.toFixed(2)));

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'nowrap',
            mb: 2,
            minHeight: 56,
          }}
        >
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: 600, flex: 1, minWidth: 160 }}
          >
            Orders & Revenue
          </Typography>
          {/* Date inputs: only visible in custom mode but width reserved */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              width: 310,
              visibility: range === 'custom' ? 'visible' : 'hidden',
              pointerEvents: range === 'custom' ? 'auto' : 'none',
            }}
          >
            <TextField
              size='small'
              type='date'
              label='From'
              InputLabelProps={{ shrink: true }}
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              sx={{ width: 150 }}
            />
            <TextField
              size='small'
              type='date'
              label='To'
              InputLabelProps={{ shrink: true }}
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              sx={{ width: 150 }}
            />
          </Box>
          <ToggleButtonGroup
            exclusive
            size='small'
            value={range}
            onChange={(_, val) => val && setRange(val)}
            color='primary'
            sx={{ flexShrink: 0 }}
          >
            <ToggleButton value='today'>Today</ToggleButton>
            <ToggleButton value='7d'>7d</ToggleButton>
            <ToggleButton value='30d'>30d</ToggleButton>
            <ToggleButton value='custom'>Custom</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <LineChart
          loading={loading}
          slotProps={{
            legend: {
              hidden: false,
              position: { vertical: 'bottom', horizontal: 'center' },
            },
          }}
          xAxis={[{ scaleType: 'point', data: xLabels }]}
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
          height={340}
          margin={{ left: 55, right: 55, top: 10, bottom: 70 }}
        />
      </CardContent>
    </Card>
  );
}
