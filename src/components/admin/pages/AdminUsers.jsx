import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useToast } from '../../../context/ToastContext';
import { usePaginatedUsers } from '../../../hooks/usePaginatedUsers';
import { useSupabaseWrite } from '../../../hooks/useSupabaseWrite';
import { supabase } from '../../../supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { useUsernameCheck } from '../../../hooks/useCheckUsername';
import UsersFilters from '../ui/users/UsersFilters';

const ROLE_OPTIONS = ['admin', 'user'];

export default function AdminUsers() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  // Refetch key (now only for edits if needed)
  const [reloadKey, setReloadKey] = useState(0);

  // Filter state (draft)
  const [idFilter, setIdFilter] = useState('');
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [lastNameFilter, setLastNameFilter] = useState('');
  const [usernameFilter, setUsernameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    id: '',
    first: '',
    last: '',
    username: '',
    email: '',
    role: '',
  });

  const isDirty = useMemo(
    () =>
      JSON.stringify(appliedFilters) !==
      JSON.stringify({
        id: idFilter,
        first: firstNameFilter,
        last: lastNameFilter,
        username: usernameFilter,
        email: emailFilter,
        role: roleFilter,
      }),
    [
      appliedFilters,
      idFilter,
      firstNameFilter,
      lastNameFilter,
      usernameFilter,
      emailFilter,
      roleFilter,
    ],
  );

  const applyFilters = () => {
    setAppliedFilters({
      id: idFilter,
      first: firstNameFilter,
      last: lastNameFilter,
      username: usernameFilter,
      email: emailFilter,
      role: roleFilter,
    });
    const items = [];
    if (idFilter)
      items.push({ field: 'id', operator: 'contains', value: idFilter });
    if (firstNameFilter)
      items.push({
        field: 'name_first',
        operator: 'contains',
        value: firstNameFilter,
      });
    if (lastNameFilter)
      items.push({
        field: 'name_last',
        operator: 'contains',
        value: lastNameFilter,
      });
    if (usernameFilter)
      items.push({
        field: 'username',
        operator: 'contains',
        value: usernameFilter,
      });
    if (emailFilter)
      items.push({ field: 'email', operator: 'contains', value: emailFilter });
    if (roleFilter)
      items.push({ field: 'role', operator: 'equals', value: roleFilter });
    setFilterModel({ items });
    setPage(0);
  };

  const resetFilters = () => {
    setIdFilter('');
    setFirstNameFilter('');
    setLastNameFilter('');
    setUsernameFilter('');
    setEmailFilter('');
    setRoleFilter('');
    setAppliedFilters({
      id: '',
      first: '',
      last: '',
      username: '',
      email: '',
      role: '',
    });
    setFilterModel({ items: [] });
    setPage(0);
  };

  const { rows, rowCount, loading, error, refresh } = usePaginatedUsers(
    page,
    pageSize,
    sortModel,
    filterModel,
    reloadKey,
  );

  const { updateData, loading: updateLoading } = useSupabaseWrite('profiles');
  const { toast } = useToast();
  const { session } = useAuth();

  // edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [firstNameEdit, setFirstNameEdit] = useState('');
  const [lastNameEdit, setLastNameEdit] = useState('');
  const [usernameEditOriginal, setUsernameEditOriginal] = useState('');
  const [roleEdit, setRoleEdit] = useState('user');
  const {
    username: usernameInput,
    status: usernameStatus,
    isChecking: usernameChecking,
    checkUsername,
    clearStatus: clearUsernameStatus,
  } = useUsernameCheck();
  const usernameTaken = usernameStatus === 'taken';

  const openEdit = (row) => {
    setActiveUser(row);
    setFirstNameEdit(row.name_first || '');
    setLastNameEdit(row.name_last || '');
    setRoleEdit(row.role || 'user');
    setUsernameEditOriginal(row.username || '');
    checkUsername(row.username || '', row.username || '');
    setDialogOpen(true);
  };
  const closeDialog = () => {
    if (updateLoading) return;
    setDialogOpen(false);
    setActiveUser(null);
    clearUsernameStatus();
  };
  const handleSave = async () => {
    if (!activeUser) return;
    const trimmedUser = (usernameInput || '').trim();
    if (!trimmedUser || usernameChecking || usernameTaken) return;
    const updates = {
      name_first: firstNameEdit.trim(),
      name_last: lastNameEdit.trim(),
      username: trimmedUser,
      role: roleEdit,
    };
    const before = {
      name_first: activeUser.name_first || '',
      name_last: activeUser.name_last || '',
      username: activeUser.username || '',
      role: activeUser.role || 'user',
    };
    const { error, data } = await updateData({ id: activeUser.id }, updates);
    if (error) {
      toast.error('Save failed');
      return;
    }

    // compute fields that changed
    const changedFields = Object.keys(updates).filter(
      (key) => String(before[key]) !== String(updates[key]),
    );

    // Only log if at least one field changed & we have actor session
    if (changedFields.length > 0 && session?.user?.id) {
      try {
        const logPayload = {
          edited_user_id: activeUser.id,
          // actor is the currently authenticated admin
          actor_user_id: session.user.id,
          changed_fields: changedFields,
          previous_values: changedFields.reduce((acc, k) => {
            acc[k] = before[k];
            return acc;
          }, {}),
          new_values: changedFields.reduce((acc, k) => {
            acc[k] = updates[k];
            return acc;
          }, {}),
        };
        const { error: logError } = await supabase
          .from('profile_edit_logs')
          .insert(logPayload);
        if (logError) {
          console.warn('Audit log failed:', logError.message);
        }
      } catch (e) {
        console.warn('Unexpected audit log error:', e);
      }
    }

    toast.success('User updated');
    closeDialog();
    // trigger refetch by reapplying filters
    setFilterModel((fm) => ({ ...fm }));
  };

  // build columns with actions
  const columns = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 220 },
      { field: 'name_first', headerName: 'First name', width: 150 },
      { field: 'name_last', headerName: 'Last name', width: 150 },
      { field: 'username', headerName: 'Username', width: 150 },
      { field: 'email', headerName: 'Email', width: 220 },
      { field: 'role', headerName: 'Role', width: 120 },
      { field: 'auth_created_at', headerName: 'Created At', width: 180 },
      { field: 'last_sign_in_at', headerName: 'Last Sign In', width: 180 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 140,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Button
              size='small'
              variant='contained'
              onClick={(e) => {
                e.stopPropagation();
                openEdit(params.row);
              }}
              sx={{ borderRadius: 3 }}
            >
              Edit
            </Button>
          </Box>
        ),
      },
    ],
    [],
  );

  const displayRows = rows;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 'calc(80vh - 150px)',
      }}
    >
      <Box sx={{ p: 3, pb: 0 }}>
        <UsersFilters
          title='Users'
          idFilter={idFilter}
          setIdFilter={setIdFilter}
          firstNameFilter={firstNameFilter}
          setFirstNameFilter={setFirstNameFilter}
          lastNameFilter={lastNameFilter}
          setLastNameFilter={setLastNameFilter}
          usernameFilter={usernameFilter}
          setUsernameFilter={setUsernameFilter}
          emailFilter={emailFilter}
          setEmailFilter={setEmailFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          ROLE_OPTIONS={ROLE_OPTIONS}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
          isDirty={isDirty}
        />
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
          rows={displayRows}
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
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth='xs'
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, p: 1.5 } } }}
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label='First Name'
              value={firstNameEdit}
              onChange={(e) => setFirstNameEdit(e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                },
              }}
            />
            <TextField
              label='Last Name'
              value={lastNameEdit}
              onChange={(e) => setLastNameEdit(e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                },
              }}
            />
            <TextField
              label='Username'
              value={usernameInput}
              onChange={(e) =>
                checkUsername(e.target.value, usernameEditOriginal)
              }
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                },
              }}
              error={usernameTaken}
              helperText={
                usernameChecking
                  ? 'Checking...'
                  : usernameTaken
                    ? 'Username already taken'
                    : !usernameInput.trim()
                      ? 'Enter a username'
                      : usernameStatus === 'available'
                        ? 'Available'
                        : ' '
              }
            />
            <FormControl
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                },
              }}
            >
              <InputLabel id='role-label'>Role</InputLabel>
              <Select
                labelId='role-label'
                label='Role'
                value={roleEdit}
                onChange={(e) => setRoleEdit(e.target.value)}
              >
                {ROLE_OPTIONS.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeDialog}
            disabled={updateLoading}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleSave}
            sx={{ borderRadius: 2 }}
            disabled={
              updateLoading ||
              usernameChecking ||
              usernameTaken ||
              !usernameInput.trim()
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
