import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  LinearProgress,
} from '@mui/material';

export function TopProductsList({ products = [], loading }) {
  const maxUnits = products.reduce((m, p) => Math.max(m, p.units || 0), 0) || 1;
  return (
    <Card
      elevation={2}
      sx={{ display: 'flex', flexDirection: 'column', borderRadius: 3 }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 1 }}>
          Top Products (30d)
        </Typography>
        <Stack
          spacing={0.75}
          sx={{ maxHeight: 340, overflowY: 'auto', pr: 0.5 }}
        >
          {loading && (
            <Typography variant='body2' color='text.secondary'>
              Loading...
            </Typography>
          )}
          {!loading && products.length === 0 && (
            <Typography variant='body2' color='text.secondary'>
              No sales data
            </Typography>
          )}
          {products.map((p) => (
            <Box
              key={p.product_id}
              sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Typography
                  variant='body2'
                  sx={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.name}
                </Typography>
                <Typography variant='caption' sx={{ fontWeight: 600 }}>
                  {p.units}u / ₱{p.revenue.toFixed(0)}
                </Typography>
              </Box>
              <LinearProgress
                variant='determinate'
                value={(p.units / maxUnits) * 100}
                sx={{ height: 6, borderRadius: 2 }}
              />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
