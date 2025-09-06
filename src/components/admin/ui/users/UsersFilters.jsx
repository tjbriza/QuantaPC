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
 * Props:
 *  - title
 *  - idFilter, setIdFilter
 *  - firstNameFilter, setFirstNameFilter
 *  - lastNameFilter, setLastNameFilter
 *  - usernameFilter, setUsernameFilter
 *  - emailFilter, setEmailFilter
 *  - roleFilter, setRoleFilter
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
  firstNameFilter,
  setFirstNameFilter,
  lastNameFilter,
  setLastNameFilter,
  usernameFilter,
  setUsernameFilter,
  emailFilter,
  setEmailFilter,
  roleFilter,
  setRoleFilter,
    ROLE_OPTIONS = [],
    applyFilters,
    resetFilters,
    isDirty,
  } = props;

  const roleValue = roleFilter || '';
  const clearDisabled =
    !idFilter &&
    !firstNameFilter &&
    !lastNameFilter &&
    !usernameFilter &&
    !emailFilter &&
    !roleValue &&
    !isDirty;

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
        <TextField
          size='small'
          label='First Name'
          value={firstNameFilter}
          onChange={(e) => setFirstNameFilter(e.target.value)}
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
          label='Last Name'
          value={lastNameFilter}
          onChange={(e) => setLastNameFilter(e.target.value)}
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
          label='Username'
          value={usernameFilter}
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
          value={emailFilter}
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
