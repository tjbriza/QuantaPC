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

export default function CategoryDialog({
  open,
  onClose,
  category,
  onSubmit,
  onDelete,
  loading,
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // update form data when category changes
  useEffect(() => {
    if (category && open) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
      });
    }
  }, [category, open]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
    };
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Edit Category</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label='Category Name'
              value={formData.name}
              onChange={handleChange('name')}
              required
              fullWidth
            />
            <TextField
              label='Description'
              multiline
              minRows={3}
              value={formData.description}
              onChange={handleChange('description')}
              placeholder='Optional category description'
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant='outlined'
            color='error'
            onClick={() => {
              onClose();
              onDelete(category);
            }}
            startIcon={<DeleteIcon />}
          >
            Delete Category
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type='submit'
            variant='contained'
            disabled={!formData.name.trim() || loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
