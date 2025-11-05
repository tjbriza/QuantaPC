import React, { useMemo, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AdminGridToolbar from '../ui/common/AdminGridToolbar';
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
  const [tab, setTab] = useState('all');
  const [reloadKey, setReloadKey] = useState(Date.now());
  const { logs, loading, error } = useAdminAuditLogs({
    limit: 300,
    key: reloadKey,
  });
  const [changeOpen, setChangeOpen] = useState(false);
  const [changeRow, setChangeRow] = useState(null);

  const filtered = useMemo(() => {
    if (tab === 'all') return logs;
    if (tab === 'services')
      return logs.filter((l) => l.type === 'service_request_edit');
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
        field: 'changes',
        headerName: 'Changes',
        width: 180,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              size='small'
              variant='outlined'
              onClick={(e) => {
                e.stopPropagation();
                setChangeRow(params.row);
                setChangeOpen(true);
              }}
              sx={{ borderRadius: 3, textTransform: 'none' }}
            >
              View Changes
            </Button>
          </Box>
        ),
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
          <Tab value='order_edit' label='Orders' />
          <Tab value='product_edit' label='Products' />
          <Tab value='profile_edit' label='Profiles' />
          <Tab value='services' label='Services' />
        </Tabs>
        <Tooltip title='Refresh logs'>
          <span>
            <IconButton
              disabled={loading}
              onClick={() => setReloadKey(Date.now())}
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
          density='standard'
          rowHeight={56}
          initialState={{
            sorting: { sortModel: [{ field: 'created_at', sort: 'desc' }] },
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          pageSizeOptions={[10]}
          slots={{ toolbar: AdminGridToolbar }}
          sx={{
            flex: 1,
            '& .MuiDataGrid-toolbarContainer': { gap: 1, p: 1 },
            '& .MuiDataGrid-main': { minHeight: 80 },
          }}
        />
      </Box>

      <Dialog
        open={changeOpen}
        onClose={() => setChangeOpen(false)}
        fullWidth
        maxWidth='md'
        sx={{ '& .MuiPaper-root': { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1.5 }}>Change Details</DialogTitle>
        <DialogContent dividers>
          {changeRow ? (
            <Box>
              <Typography variant='body2' sx={{ mb: 1 }}>
                Target ID: <code>{changeRow.target_id}</code>
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Edited by: <code>{changeRow.actor_user_id || '—'}</code>
              </Typography>
              <Typography variant='subtitle2' sx={{ mb: 1 }}>
                Summary
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {changeRow.summary}
              </Typography>

              <Typography variant='subtitle2' sx={{ mb: 1 }}>
                Changed fields
              </Typography>
              {changeRow.changed_fields?.length ? (
                <Box sx={{ mb: 2 }}>
                  {changeRow.changed_fields.map((f) => (
                    <Chip key={f} size='small' label={f} sx={{ mr: 0.5 }} />
                  ))}
                </Box>
              ) : (
                <Typography variant='body2' sx={{ mb: 2 }}>
                  —
                </Typography>
              )}

              <Typography variant='subtitle2' sx={{ mb: 1 }}>
                Changes
              </Typography>
              <List>
                {(() => {
                  const fields = changeRow.changed_fields?.length
                    ? changeRow.changed_fields
                    : Object.keys(changeRow.new_values || {});
                  return fields.map((field) => {
                    const prev =
                      changeRow.previous_values?.[field] ??
                      changeRow.previous_values;
                    const next =
                      changeRow.new_values?.[field] ?? changeRow.new_values;
                    return (
                      <ListItem key={field} divider alignItems='flex-start'>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                              }}
                            >
                              <Chip label={field} size='small' />
                              <Typography
                                variant='caption'
                                color='text.secondary'
                              >
                                {formatTimestamp(changeRow.created_at)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant='caption'
                                color='text.secondary'
                              >
                                Previous
                              </Typography>
                              <Box sx={{ mb: 1 }}>
                                <ValuePreview value={prev} />
                              </Box>
                              <Typography
                                variant='caption'
                                color='text.secondary'
                              >
                                New
                              </Typography>
                              <Box>
                                <ValuePreview value={next} />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  });
                })()}
              </List>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setChangeOpen(false)} sx={{ borderRadius: 3 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
