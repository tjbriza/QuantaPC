import {
  Box,
  Stack,
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

/* Props:
  title
  search, setSearch
  selectedCategories, setSelectedCategories (array of category ids)
  disabledState, setDisabledState ('' | 'true' | 'false')
  priceMin, setPriceMin
  priceMax, setPriceMax
  stockMin, setStockMin
  stockMax, setStockMax
  categories (array of {id,name})
  applyAdvancedFilters
  resetAdvancedFilters
  isDirty
  appliedAdvancedFilters
*/
export default function ProductFilters({
  title = 'Products',
  search,
  setSearch,
  selectedCategories,
  setSelectedCategories,
  disabledState,
  setDisabledState,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  stockMin,
  setStockMin,
  stockMax,
  setStockMax,
  categories = [],
  applyAdvancedFilters,
  resetAdvancedFilters,
  isDirty,
  appliedAdvancedFilters,
  onAddProduct,
}) {
  const clearDisabled =
    !search &&
    !selectedCategories.length &&
    !disabledState &&
    !priceMin &&
    !priceMax &&
    !stockMin &&
    !stockMax &&
    !Object.values(appliedAdvancedFilters || {}).some((v) =>
      Array.isArray(v) ? v.length : v,
    ) &&
    !isDirty;

  // ensure numeric filter inputs never go negative; allow empty string for clearing.
  const handleNonNegative = (setter) => (e) => {
    let v = e.target.value;
    if (v === '') {
      setter('');
      return;
    }
    // strip leading minus signs
    if (v.startsWith('-')) v = v.replace(/^-+/, '');
    const num = Number(v);
    if (isNaN(num) || num < 0) {
      setter('');
    } else {
      setter(String(num));
    }
  };

  return (
    <Box
      sx={{
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'flex-start',
      }}
    >
      <Stack direction='row' spacing={1} alignItems='center'>
        <Typography variant='h5' fontWeight={600}>
          {title}
        </Typography>
      </Stack>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        sx={{ flexWrap: 'wrap', width: '100%', gap: 1 }}
      >
        {onAddProduct && (
          <Button
            variant='contained'
            size='small'
            color='primary'
            onClick={onAddProduct}
            sx={{ borderRadius: 4 }}
          >
            Add Product
          </Button>
        )}
        <TextField
          size='small'
          label='Search (name / desc / brand)'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            minWidth: 220,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          }}
        />
        <FormControl
          size='small'
          sx={{
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          }}
        >
          <InputLabel id='categories-label'>Categories</InputLabel>
          <Select
            labelId='categories-label'
            multiple
            value={selectedCategories}
            label='Categories'
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCategories(
                typeof value === 'string' ? value.split(',') : value,
              );
            }}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((id) => {
                  const cat = categories.find((c) => c.id === id);
                  return (
                    <Chip size='small' key={id} label={cat ? cat.name : id} />
                  );
                })}
              </Box>
            )}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          size='small'
          sx={{
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          }}
        >
          <InputLabel id='disabled-label'>Disabled</InputLabel>
          <Select
            labelId='disabled-label'
            value={disabledState}
            label='Disabled'
            onChange={(e) => setDisabledState(e.target.value)}
          >
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='false'>Enabled</MenuItem>
            <MenuItem value='true'>Disabled</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size='small'
          label='Price Min'
          type='number'
          value={priceMin}
          onChange={handleNonNegative(setPriceMin)}
          inputProps={{ min: 0 }}
          sx={{
            width: 110,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          }}
        />
        <TextField
          size='small'
          label='Price Max'
          type='number'
          value={priceMax}
          onChange={handleNonNegative(setPriceMax)}
          inputProps={{ min: 0 }}
          sx={{
            width: 110,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          }}
        />
        <TextField
          size='small'
          label='Stock Min'
          type='number'
          value={stockMin}
          onChange={handleNonNegative(setStockMin)}
          inputProps={{ min: 0 }}
          sx={{
            width: 110,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          }}
        />
        <TextField
          size='small'
          label='Stock Max'
          type='number'
          value={stockMax}
          onChange={handleNonNegative(setStockMax)}
          inputProps={{ min: 0 }}
          sx={{
            width: 110,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          }}
        />
        <Stack direction='row' spacing={1} alignItems='center'>
          <Button
            variant='contained'
            size='medium'
            onClick={applyAdvancedFilters}
            disabled={!isDirty}
            sx={{ borderRadius: 3 }}
          >
            Apply
          </Button>
          <Tooltip title='Clear filters'>
            <span>
              <IconButton
                size='small'
                onClick={resetAdvancedFilters}
                disabled={clearDisabled}
              >
                <ClearIcon fontSize='small' />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  );
}
