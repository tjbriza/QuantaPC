import React, { useMemo, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useAdminAuditLogs } from '../../../hooks/useAdminAuditLogs';
import { RefreshCw } from 'lucide-react';

function ValuePreview({ value }) {
  if (value == null)
    return (
      <Typography variant='caption' color='text.secondary'>
        —
      </Typography>
    );
  const json = JSON.stringify(value, null, 0);
  if (json.length > 60) {
    return (
      <Tooltip
        title={
          <pre style={{ margin: 0 }}>{JSON.stringify(value, null, 2)}</pre>
        }
      >
        <Typography variant='caption' sx={{ fontFamily: 'monospace' }}>
          {json.slice(0, 60)}…
        </Typography>
      </Tooltip>
    );
  }
  return (
    <Typography variant='caption' sx={{ fontFamily: 'monospace' }}>
      {json}
    </Typography>
  );
}

function formatTimestamp(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const m = raw.match(
    /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})\.(\d{3})(\d{0,3})([+-]\d{2})(:?\d{0,2})$/,
  );
  if (m) {
    const [, d, t, msFirst3, , tzHour, tzMin] = m;
    const tz = tzMin ? `${tzHour}${tzMin}` : `${tzHour}:00`;
    return `${d} ${t}.${msFirst3}${tz}`;
  }
  // fallback, just return original string
  return raw;
}

export default function AdminLogs() {
  const { logs, loading, error } = useAdminAuditLogs({ limit: 300 });
  const [tab, setTab] = useState('all');

  const filtered = useMemo(() => {
    if (tab === 'all') return logs;
    return logs.filter((l) => l.type === tab);
  }, [tab, logs]);

  const columns = useMemo(
    () => [
      {
        field: 'created_at',
        headerName: 'Time',
        width: 210,
        renderCell: (p) => (
          <Typography variant='caption' sx={{ fontFamily: 'monospace' }}>
            {formatTimestamp(p.value)}
          </Typography>
        ),
        sortComparator: (v1, v2) => (v1 === v2 ? 0 : v1 > v2 ? 1 : -1),
      },
      {
        field: 'type',
        headerName: 'Type',
        width: 130,
        renderCell: (p) => <Chip size='small' label={p.value} />,
      },
      { field: 'target_id', headerName: 'Target ID', width: 230 },
      { field: 'actor_user_id', headerName: 'Edited by', width: 230 },
      { field: 'summary', headerName: 'Summary', width: 320, flex: 1 },
      {
        field: 'changed_fields',
        headerName: 'Fields',
        width: 180,
        renderCell: (p) =>
          p.value?.length
            ? p.value.map((f) => (
                <Chip key={f} size='small' label={f} sx={{ mr: 0.5 }} />
              ))
            : '—',
      },
      {
        field: 'previous_values',
        headerName: 'Previous',
        width: 200,
        renderCell: (p) => <ValuePreview value={p.value} />,
      },
      {
        field: 'new_values',
        headerName: 'New',
        width: 200,
        renderCell: (p) => <ValuePreview value={p.value} />,
      },
    ],
    [],
  );

  return (
    <Box
      sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant='h5' sx={{ flex: 1 }}>
          Audit Logs
        </Typography>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ minHeight: 0, '& .MuiTab-root': { minHeight: 0 } }}
        >
          <Tab value='all' label={`All (${logs.length})`} />
          <Tab value='order_status' label='Orders' />
          <Tab value='product_edit' label='Products' />
          <Tab value='profile_edit' label='Profiles' />
        </Tabs>
        <Tooltip title='Refresh (auto on load)'>
          <span>
            <IconButton
              disabled={loading}
              onClick={() => window.location.reload()}
              size='small'
            >
              <RefreshCw size={18} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      {error && (
        <Typography color='error' variant='body2' sx={{ mb: 2 }}>
          Failed to load logs: {error.message}
        </Typography>
      )}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          getRowId={(r) => r.id}
          density='compact'
          initialState={{
            sorting: { sortModel: [{ field: 'created_at', sort: 'desc' }] },
            pagination: { paginationModel: { pageSize: 25, page: 0 } },
          }}
          pageSizeOptions={[25, 50, 100]}
        />
      </Box>
    </Box>
  );
}
