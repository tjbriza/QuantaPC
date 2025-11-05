import { DataGrid } from '@mui/x-data-grid';
import AdminGridToolbar from '../common/AdminGridToolbar';

/**
 * OrderTable
 * Props:
 *  - rows, columns, rowCount, loading
 *  - page, pageSize, setPage, setPageSize
 *  - sortModel, setSortModel
 *  - filterModel, setFilterModel
 */
export default function OrderTable({
  rows,
  columns,
  rowCount,
  loading,
  page,
  pageSize,
  setPage,
  setPageSize,
  sortModel,
  setSortModel,
  filterModel,
  setFilterModel,
  height,
}) {
  return (
    <div
      style={{
        height: height || '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        loading={loading}
        getRowId={(r) => r.id}
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
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        slots={{ toolbar: AdminGridToolbar }}
        slotProps={{ toolbar: { showQuickFilter: true } }}
        sx={{
          flex: 1,
          '& .MuiDataGrid-toolbarContainer': { gap: 1, p: 1 },
          '& .MuiDataGrid-main': { minHeight: 80 },
        }}
      />
    </div>
  );
}
