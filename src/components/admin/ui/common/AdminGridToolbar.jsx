import React from 'react';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { Box } from '@mui/material';

/**
 * AdminGridToolbar
 * A consistent toolbar for admin DataGrids that always provides
 * a Columns manager so users can recover when all columns are hidden.
 */
export default function AdminGridToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Box sx={{ flex: 1 }} />
      <GridToolbarQuickFilter debounceMs={300} />
    </GridToolbarContainer>
  );
}
