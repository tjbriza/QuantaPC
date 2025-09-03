import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { usePaginatedProducts } from '../../../hooks/usePaginatedProducts';
import { useSupabaseWrite } from '../../../hooks/useSupabaseWrite';
import { useSupabaseRead } from '../../../hooks/useSupabaseRead';
import { useToast } from '../../../context/ToastContext';
import ConfirmDialog from '../../ui/ConfirmDialog';

const columns = [
  { field: 'id', headerName: 'ID', width: 220, editable: false },
  {
    field: 'name',
    headerName: 'Product Name',
    width: 200,
    editable: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 150,
    editable: true,
  },
  {
    field: 'price',
    headerName: 'Price',
    width: 120,
    editable: true,
    type: 'number',
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 180,
    editable: true, // editable via singleSelect by name, we'll translate to category_id on save
    type: 'singleSelect',
    // valueOptions will be set dynamically in the component
  },
  {
    field: 'stock_quantity',
    headerName: 'Stock',
    width: 100,
    editable: true,
    type: 'number',
  },
  {
    field: 'image_url',
    headerName: 'Image URL',
    width: 200,
    editable: true,
  },
  {
    field: 'created_at',
    headerName: 'Created At',
    width: 180,
    editable: false,
  },
  {
    field: 'updated_at',
    headerName: 'Updated At',
    width: 180,
    editable: false,
  },
];

export default function AdminProducts() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
    quickFilterValues: [],
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const { rows, rowCount, loading } = usePaginatedProducts(
    page,
    pageSize,
    sortModel,
    filterModel,
  );

  const { updateData, loading: updateLoading } = useSupabaseWrite('products');
  const [categoriesReloadKey, setCategoriesReloadKey] = useState(Date.now());

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSupabaseRead('categories', { reloadKey: categoriesReloadKey });

  const { toast } = useToast();

  const {
    insertData: insertCategory,
    updateData: updateCategory,
    deleteData: deleteCategory,
    loading: categoryWriteLoading,
  } = useSupabaseWrite('categories');

  const handleRowUpdate = async (newRow, oldRow) => {
    try {
      // only update the fields that are editable
      const updates = {
        name: newRow.name,
        description: newRow.description,
        price: newRow.price,
        stock_quantity: newRow.stock_quantity,
        image_url: newRow.image_url,
      };

      // if category name changed, map to category_id and include it in updates
      if (
        newRow.category !== oldRow.category &&
        categories &&
        Array.isArray(categories)
      ) {
        const matched = categories.find((c) => c.name === newRow.category);
        if (matched) {
          updates.category_id = matched.id;
        } else {
          // if somehow no match, don't change category
        }
      }

      // filter out undefined values
      const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined),
      );

      const { data, error } = await updateData(
        { id: newRow.id }, // Filter by product ID
        filteredUpdates,
      );

      if (error) {
        console.error('Update error:', error);
        // notify and return the old row to revert the change in the grid
        toast.error('Failed to save product changes');
        return oldRow;
      }

      // return the updated row
      toast.success('Product saved');
      return { ...oldRow, ...filteredUpdates };
    } catch (error) {
      console.error('Row update error:', error);
      // return the old row to revert the change in the grid
      return oldRow;
    }
  };

  // confirm dialog state for category deletion
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteCategory, setToDeleteCategory] = useState(null);

  const openDeleteConfirm = (category) => {
    setToDeleteCategory(category);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDeleteCategory) return;
    await handleDeleteCategory(toDeleteCategory.id);
    setConfirmOpen(false);
    setToDeleteCategory(null);
  };

  // add new category
  const handleAddCategory = async () => {
    const name = (newCategoryName || '').trim();
    if (!name) return;
    const { data, error } = await insertCategory([{ name }]);
    if (error) {
      console.error('Add category error', error);
      toast.error('Failed to add category');
      return;
    }
    setNewCategoryName('');
    // trigger a refresh of products and categories by bumping reload key and refreshing filters
    setCategoriesReloadKey(Date.now());
    setFilterModel((f) => ({ ...f }));
    toast.success('Category added');
  };

  const handleCategoryRowUpdate = async (newRow, oldRow) => {
    try {
      const updates = { name: newRow.name };
      const { data, error } = await updateCategory({ id: newRow.id }, updates);
      if (error) {
        console.error('Category update error', error);
        toast.error('Failed to update category');
        return oldRow;
      }
      // refresh products so their displayed category names update
      setCategoriesReloadKey(Date.now());
      setFilterModel((f) => ({ ...f }));
      toast.success('Category updated');
      return { ...oldRow, ...updates };
    } catch (err) {
      console.error(err);
      return oldRow;
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!id) return;
    const { data, error } = await deleteCategory({ id });
    if (error) {
      console.error('Delete category error', error);
      toast.error('Failed to delete category');
      return;
    }
    setCategoriesReloadKey(Date.now());
    setFilterModel((f) => ({ ...f }));
    toast.success('Category deleted');
  };

  // Category options for DataGrid singleSelect
  const categoryOptions = useMemo(() => {
    if (!categories) return [];
    return categories.map((c) => c.name);
  }, [categories]);

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
          Products
        </Typography>
        <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 2 }}>
          <TextField
            size='small'
            label='New category'
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button
            variant='contained'
            onClick={handleAddCategory}
            disabled={categoryWriteLoading || !newCategoryName.trim()}
          >
            Add Category
          </Button>

          <TextField
            select
            size='small'
            label='Filter category'
            SelectProps={{ native: true }}
            value={categoryFilter}
            onChange={(e) => {
              const val = e.target.value;
              setCategoryFilter(val);
              if (val === 'All') {
                setFilterModel({ items: [], quickFilterValues: [] });
              } else {
                setFilterModel({
                  items: [
                    { field: 'category', operator: 'equals', value: val },
                  ],
                  quickFilterValues: [],
                });
              }
              setPage(0);
            }}
            sx={{ minWidth: 200 }}
          >
            <option key='all' value='All'>
              All
            </option>
            {categories &&
              categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
          </TextField>
        </Stack>
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
          columns={columns.map((col) =>
            col.field === 'category'
              ? { ...col, valueOptions: categoryOptions }
              : col,
          )}
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

      <Box sx={{ px: 3 }}>
        <Typography variant='h6' fontWeight={600} sx={{ mb: 2 }}>
          Categories
        </Typography>
        {categoriesLoading ? (
          <CircularProgress size={20} />
        ) : categoriesError ? (
          <Typography color='error'>Error loading categories</Typography>
        ) : (
          <div style={{ height: 300, width: '100%' }}>
            <DataGrid
              rows={categories || []}
              pageSizeOptions={[]}
              checkboxSelection={false}
              columns={[
                { field: 'id', headerName: 'ID', width: 220 },
                {
                  field: 'name',
                  headerName: 'Name',
                  width: 300,
                  editable: true,
                },
                {
                  field: 'actions',
                  headerName: 'Actions',
                  width: 120,
                  sortable: false,
                  filterable: false,
                  renderCell: (params) => (
                    <IconButton
                      onClick={() => openDeleteConfirm(params.row)}
                      size='small'
                    >
                      <DeleteIcon />
                    </IconButton>
                  ),
                },
              ]}
              getRowId={(r) => r.id}
              processRowUpdate={handleCategoryRowUpdate}
            />
          </div>
        )}
      </Box>
      <ConfirmDialog
        open={confirmOpen}
        title={`Delete category ${toDeleteCategory?.name || ''}?`}
        description={`Are you sure you want to delete the category "${toDeleteCategory?.name || ''}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
        confirmText='Delete'
      />
    </Box>
  );
}
