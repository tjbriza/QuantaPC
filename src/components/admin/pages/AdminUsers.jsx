import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useToast } from '../../../context/ToastContext';
import { DataGrid } from '@mui/x-data-grid';
import { usePaginatedUsers } from '../../../hooks/usePaginatedUsers';
import { useSupabaseWrite } from '../../../hooks/useSupabaseWrite';

const columns = [
  { field: 'id', headerName: 'ID', width: 220, editable: false },
  {
    field: 'name_first',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'name_last',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'username',
    headerName: 'Username',
    width: 150,
    editable: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 220,
    editable: false,
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 120,
    editable: false,
  },
  {
    field: 'auth_created_at',
    headerName: 'Created At',
    width: 180,
    editable: false,
  },
  {
    field: 'last_sign_in_at',
    headerName: 'Last Sign In',
    width: 180,
    editable: false,
  },
];

export default function AdminUsers() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
    quickFilterValues: [],
  });

  const { rows, rowCount, loading } = usePaginatedUsers(
    page,
    pageSize,
    sortModel,
    filterModel,
  );

  const { updateData, loading: updateLoading } = useSupabaseWrite('profiles');
  const { toast } = useToast();

  const handleRowUpdate = async (newRow, oldRow) => {
    try {
      // only update the fields that are editable
      const updates = {
        name_first: newRow.name_first,
        name_last: newRow.name_last,
        username: newRow.username,
      };

      // filter out undefined values
      const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined),
      );

      const { data, error } = await updateData(
        { id: newRow.id }, // filter by user ID
        filteredUpdates,
      );

      if (error) {
        console.error('Update error:', error);
        toast.error('Failed to save user changes');
        // return the old row to revert the change in the grid
        return oldRow;
      }

      // return the updated row
      toast.success('User saved');
      return { ...oldRow, ...filteredUpdates };
    } catch (error) {
      console.error('Row update error:', error);
      // return the old row to revert the change in the grid
      return oldRow;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 'calc(80vh - 150px)',
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant='h5' fontWeight={600}>
          Users
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          height: '100%',
          minHeight: 0,
          px: 3,
          pb: 3,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={rowCount}
          loading={loading || updateLoading}
          paginationMode='server'
          sortingMode='server'
          filterMode='server'
          paginationModel={{ page, pageSize }}
          sortModel={sortModel}
          filterModel={filterModel}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          onSortModelChange={(model) => {
            setSortModel(model);
            setPage(0);
          }}
          onFilterModelChange={(model) => {
            setFilterModel(model);
            setPage(0);
          }}
          processRowUpdate={handleRowUpdate}
          getRowId={(row) => row.id}
          checkboxSelection={false}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #e0e0e0',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid #e0e0e0',
            },
          }}
        />
      </Box>
    </Box>
  );
}
