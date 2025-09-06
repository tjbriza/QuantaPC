import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * UsersFilters
 * Simple filter bar for AdminUsers similar to OrderFilters.
 * Props:
 *  - title
 *  - idFilter, setIdFilter
 *  - name, setNameFilter (matches first OR last name)
 *  - username, setUsernameFilter
 *  - email, setEmailFilter
 *  - role, setRoleFilter
 *  - ROLE_OPTIONS
 *  - applyFilters()
 *  - resetFilters()
 *  - isDirty
 */
export default function UsersFilters(props) {
  const {
    title = 'Users',
    idFilter,
    setIdFilter,
    // combined name form
    name,
    setNameFilter,
    // optional separate first/last provided by parent legacy API
    firstNameFilter,
    setFirstNameFilter,
    lastNameFilter,
    setLastNameFilter,
    username,
    setUsernameFilter,
    email,
    setEmailFilter,
    role, // new prop name
    roleFilter, // legacy prop name
    setRoleFilter,
    ROLE_OPTIONS = [],
    applyFilters,
    resetFilters,
    isDirty,
  } = props;

  const roleValue = role !== undefined ? role : roleFilter || '';
  // Determine name display precedence: combined name if provided, else concatenate first/last (for UX only)
  const nameValue =
    name !== undefined
      ? name
      : firstNameFilter || lastNameFilter
        ? `${firstNameFilter || ''}`.trim()
        : '';

  const clearDisabled =
    !idFilter && !nameValue && !username && !email && !roleValue && !isDirty;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
      <Typography variant='h5' fontWeight={600} sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        sx={{ flexWrap: 'wrap', width: '100%' }}
      >
        <TextField
          size='small'
          label='ID'
          value={idFilter}
          onChange={(e) => setIdFilter(e.target.value)}
          sx={{
            minWidth: 200,
            width: 110,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          }}
        />
        {setNameFilter && (
          <TextField
            size='small'
            label='Name (First or Last)'
            value={nameValue}
            onChange={(e) => setNameFilter(e.target.value)}
            sx={{
              minWidth: 200,
              width: 110,
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
              },
            }}
          />
        )}
        <TextField
          size='small'
          label='Username'
          value={username}
          onChange={(e) => setUsernameFilter(e.target.value)}
          sx={{
            minWidth: 160,
            width: 110,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          }}
        />
        <TextField
          size='small'
          label='Email'
          value={email}
          onChange={(e) => setEmailFilter(e.target.value)}
          sx={{
            minWidth: 200,
            width: 110,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          }}
        />
        <FormControl
          size='small'
          sx={{
            minWidth: 140,
            width: 110,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          }}
        >
          <InputLabel id='role-filter-label'>Role</InputLabel>
          <Select
            labelId='role-filter-label'
            label='Role'
            value={roleValue}
            onChange={(e) => setRoleFilter && setRoleFilter(e.target.value)}
          >
            <MenuItem value=''>All</MenuItem>
            {ROLE_OPTIONS.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction='row' spacing={1} alignItems='center'>
          <Button
            variant='contained'
            size='medium'
            onClick={applyFilters}
            disabled={!isDirty}
            sx={{ borderRadius: 3 }}
          >
            Apply
          </Button>
          <Tooltip title='Clear filters'>
            <span>
              <IconButton
                size='small'
                onClick={resetFilters}
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
