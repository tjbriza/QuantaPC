import { Card, CardContent, Typography, Box, Stack } from '@mui/material';

export function LowStockProductsChart({ products = [], loading }) {
  const list = products.slice(0, 30);
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
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          '&:last-child': { pb: 2 },
          flex: 1,
          minHeight: 0,
        }}
      >
        <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 1 }}>
          Low Stock Products (&lt;=5)
        </Typography>
        <Stack spacing={0.6} sx={{ overflowY: 'auto', pr: 0.5, flex: 1 }}>
          {list.map((p) => (
            <Box
              key={p.id}
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                fontSize: 14,
                lineHeight: 1.3,
              }}
            >
              {p.stock_quantity === 0 && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'error.main',
                    boxShadow: '0 0 0 2px rgba(255,255,255,0.6)',
                    flexShrink: 0,
                  }}
                />
              )}
              <Box
                sx={{
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                }}
                title={p.name}
              >
                {p.name}
              </Box>
              <Box
                sx={{
                  minWidth: 38,
                  textAlign: 'right',
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {p.stock_quantity}
              </Box>
            </Box>
          ))}
          {!products.length && !loading && (
            <Typography variant='body2' color='text.secondary'>
              No low stock items 🎉
            </Typography>
          )}
          {loading && (
            <Typography variant='body2' color='text.secondary'>
              Loading...
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
