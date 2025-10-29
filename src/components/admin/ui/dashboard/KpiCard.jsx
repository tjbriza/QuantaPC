import { Card, CardContent, Stack, Typography, Box } from '@mui/material';

export function KpiCard({
  label,
  value,
  caption,
  icon: Icon,
  valuePrefix = '',
  color = 'primary',
}) {
  return (
    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 2.25, '&:last-child': { pb: 2.25 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {Icon && (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: (theme) => theme.palette.grey[100],
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={20} strokeWidth={2} />
            </Box>
          )}
          <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant='caption'
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {label}
            </Typography>
            <Typography
              variant='h5'
              sx={{
                fontWeight: 700,
                lineHeight: 1,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'baseline',
                gap: 0.5,
              }}
            >
              {valuePrefix && (
                <Box
                  component='span'
                  sx={{ fontSize: '0.75em', fontWeight: 600, opacity: 0.85 }}
                >
                  {valuePrefix}
                </Box>
              )}
              {Intl.NumberFormat(undefined, {
                maximumFractionDigits: 2,
              }).format(value || 0)}
            </Typography>
            {caption && (
              <Typography
                variant='body2'
                sx={{ color: 'text.secondary', lineHeight: 1.2 }}
                noWrap
              >
                {caption}
              </Typography>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
