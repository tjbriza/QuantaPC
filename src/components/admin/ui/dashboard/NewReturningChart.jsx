import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

export function NewReturningChart({
  newCount = 0,
  returningCount = 0,
  loading,
}) {
  const total = newCount + returningCount;
  const data = [
    { id: 'new', value: newCount, label: 'New', color: '#1976d2' },
    {
      id: 'returning',
      value: returningCount,
      label: 'Returning',
      color: '#9c27b0',
    },
  ];
  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        width: '80%',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{
          p: 2,
          '&:last-child': { pb: 2 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 1 }}>
          Customers (30d)
        </Typography>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PieChart
            height={340}
            series={[
              {
                data,
                innerRadius: 70,
                outerRadius: 130,
                paddingAngle: 2,
                cornerRadius: 4,
              },
            ]}
            slotProps={{
              legend: {
                hidden: false,
                position: { vertical: 'bottom', horizontal: 'middle' },
              },
            }}
            margin={{ top: 20, bottom: 70, left: 20, right: 20 }}
            loading={loading}
          />
        </Box>
        <Typography
          variant='caption'
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 1,
            color: 'text.secondary',
          }}
        >
          Total: {total}
        </Typography>
      </CardContent>
    </Card>
  );
}
