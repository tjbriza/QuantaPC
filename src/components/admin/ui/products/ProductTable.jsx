import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AdminGridToolbar from '../common/AdminGridToolbar';

const baseColumns = [
  { field: 'id', headerName: 'ID', width: 220, editable: false },
  {
    field: 'name',
    headerName: 'Product Name',
    width: 200,
    editable: false,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 150,
    editable: false,
  },
  {
    field: 'price',
    headerName: 'Price',
    width: 120,
    editable: false,
    type: 'number',
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 180,
    editable: false,
  },
  {
    field: 'stock_quantity',
    headerName: 'Stock',
    width: 100,
    editable: false,
    type: 'number',
  },
  {
    field: 'image_url',
    headerName: 'Image URL',
    width: 200,
    editable: false,
  },
  {
    field: 'is_disabled',
    headerName: 'Disabled',
    width: 110,
    align: 'center',
    headerAlign: 'center',
    sortable: false,
    renderCell: (params) => (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 500,
          color: params?.row?.is_disabled ? 'error.main' : 'success.main',
        }}
      >
        {params?.row?.is_disabled ? 'Yes' : 'No'}
      </Box>
    ),
  },
  {
    field: 'created_at',
    headerName: 'Created At',
    width: 180,
    editable: false,
  },
];

export default function ProductDataGrid({
  rows,
  rowCount,
  loading,
  page,
  pageSize,
  sortModel,
  filterModel,
  onPaginationModelChange,
  onSortModelChange,
  onFilterModelChange,
  onEditProduct,
  onToggleDisabled,
}) {
  const actionsColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 230,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Stack
        direction='row'
        alignItems='center'
        width='100%'
        height='100%'
        spacing={1}
      >
        <Button
          size='small'
          variant='outlined'
          onClick={(e) => {
            e.stopPropagation();
            if (params?.row) onEditProduct(params.row);
          }}
          sx={{ borderRadius: 3 }}
        >
          Edit
        </Button>
        <Button
          size='small'
          variant='outlined'
          color={params?.row?.is_disabled ? 'success' : 'warning'}
          onClick={(e) => {
            e.stopPropagation();
            if (params?.row) onToggleDisabled(params.row);
          }}
          sx={{ borderRadius: 3 }}
        >
          {params?.row?.is_disabled ? 'Enable' : 'Disable'}
        </Button>
      </Stack>
    ),
  };

  return (
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
        rows={rows || []}
        columns={[...baseColumns, actionsColumn]}
        rowCount={rowCount || 0}
        loading={loading}
        paginationMode='server'
        sortingMode='server'
        filterMode='server'
        paginationModel={{ page, pageSize }}
        sortModel={sortModel}
        filterModel={filterModel}
        onPaginationModelChange={onPaginationModelChange}
        onSortModelChange={onSortModelChange}
        onFilterModelChange={onFilterModelChange}
        getRowId={(row) => row.id}
        checkboxSelection={false}
        disableRowSelectionOnClick
        getRowClassName={(params) =>
          params.row.is_disabled ? 'product-disabled' : ''
        }
        slots={{ toolbar: AdminGridToolbar }}
        slotProps={{ toolbar: { showQuickFilter: true } }}
        sx={{
          flex: 1,
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-toolbarContainer': { gap: 1, p: 1 },
          '& .MuiDataGrid-main': { minHeight: 80 },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #e0e0e0',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            borderBottom: '2px solid #e0e0e0',
          },
          '& .product-disabled': {
            opacity: 0.55,
            backgroundColor: '#fafafa',
          },
        }}
      />
    </Box>
  );
}
