import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProductDialog({
  open,
  onClose,
  mode, // 'add' or 'edit'
  product,
  onSubmit,
  onDelete,
  categories,
  loading,
}) {
  const isEdit = mode === 'edit';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    brand: '',
    image_url: '',
  });

  // update form data when product changes
  useEffect(() => {
    if (product && isEdit) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock_quantity: product.stock_quantity || '',
        category_id: product.category_id || '',
        brand: product.brand || '',
        image_url: product.image_url || '',
      });
    } else if (!isEdit) {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category_id: '',
        brand: '',
        image_url: '',
      });
    }
  }, [product, isEdit, open]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const requiredFieldsFilled =
    formData.name.trim() &&
    formData.description.trim() &&
    formData.price !== '' &&
    formData.stock_quantity !== '' &&
    formData.category_id;

  //ensure price & stock are non-negative numbers
  const priceError = formData.price !== '' && Number(formData.price) < 0;
  const stockError =
    formData.stock_quantity !== '' && Number(formData.stock_quantity) < 0;
  const formInvalid = priceError || stockError;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      slotProps={{ paper: { sx: { borderRadius: 4, p: 1.5 } } }}
    >
      <DialogTitle>{isEdit ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label='Name'
              value={formData.name}
              onChange={handleChange('name')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                },
              }}
            />
            <TextField
              label='Description'
              multiline
              minRows={3}
              value={formData.description}
              onChange={handleChange('description')}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                },
              }}
            />
            <Stack direction='row' spacing={2}>
              <TextField
                label='Price (₱)'
                type='number'
                value={formData.price}
                onChange={handleChange('price')}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                  },
                }}
                inputProps={{ min: 0 }}
                error={priceError}
                helperText={priceError ? 'Price must be 0 or greater' : ' '}
              />
              <TextField
                label='Stock Qty'
                type='number'
                value={formData.stock_quantity}
                onChange={handleChange('stock_quantity')}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                  },
                }}
                inputProps={{ min: 0 }}
                error={stockError}
                helperText={stockError ? 'Stock must be 0 or greater' : ' '}
              />
            </Stack>
            <TextField
              select
              label='Category'
              value={formData.category_id}
              onChange={handleChange('category_id')}
              SelectProps={{ native: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                },
              }}
              required
            >
              <option value=''>{isEdit ? 'Select category' : ''}</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </TextField>
            <TextField
              label='Brand'
              value={formData.brand}
              onChange={handleChange('brand')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                },
              }}
            />
            <TextField
              label='Image URL'
              value={formData.image_url}
              onChange={handleChange('image_url')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          {isEdit && onDelete && (
            <Button
              variant='outlined'
              color='error'
              onClick={() => onDelete(product)}
              startIcon={<DeleteIcon />}
              sx={{ borderRadius: 3 }}
            >
              Delete
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type='submit'
            variant='contained'
            disabled={!requiredFieldsFilled || formInvalid || loading}
            sx={{ borderRadius: 3 }}
          >
            {loading ? 'Saving...' : isEdit ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
