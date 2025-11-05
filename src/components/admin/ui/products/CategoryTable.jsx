import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AdminGridToolbar from '../common/AdminGridToolbar';

export default function CategorySection({
  categories,
  categoriesLoading,
  categoriesError,
  newCategoryName,
  setNewCategoryName,
  categoryWriteLoading,
  onAddCategory,
  onEditCategory,
}) {
  const categoryColumns = [
    { field: 'id', headerName: 'ID', width: 200 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: false,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
      editable: false,
      renderCell: (params) => (
        <Box
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {params.value || '—'}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          size='small'
          variant='outlined'
          onClick={() => onEditCategory(params.row)}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Edit Category
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ px: 3 }}>
      <Typography variant='h6' fontWeight={600} sx={{ mb: 2 }}>
        Categories
      </Typography>
      <Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 2 }}>
        <TextField
          size='small'
          label='New category'
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <Button
          variant='contained'
          onClick={onAddCategory}
          disabled={categoryWriteLoading || !newCategoryName.trim()}
        >
          Add Category
        </Button>
      </Stack>
      {categoriesLoading ? (
        <CircularProgress size={20} />
      ) : categoriesError ? (
        <Typography color='error'>Error loading categories</Typography>
      ) : (
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid
            rows={categories || []}
            columns={categoryColumns}
            pageSizeOptions={[]}
            checkboxSelection={false}
            getRowId={(r) => r.id}
            slots={{ toolbar: AdminGridToolbar }}
            slotProps={{ toolbar: { showQuickFilter: true } }}
            sx={{
              '& .MuiDataGrid-toolbarContainer': { gap: 1, p: 1 },
              '& .MuiDataGrid-main': { minHeight: 80 },
            }}
          />
        </div>
      )}
    </Box>
  );
}
