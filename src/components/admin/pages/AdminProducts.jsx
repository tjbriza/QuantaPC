import React from 'react';
import { Box } from '@mui/material';
import { useProductManagement } from '../../../hooks/useProductManagement';
import { usePaginatedProducts } from '../../../hooks/usePaginatedProducts';
import ConfirmDialog from '../../ui/ConfirmDialog';
import ProductFilters from '../ui/products/ProductFilters';
import ProductDataGrid from '../ui/products/ProductTable';
import CategorySection from '../ui/products/CategoryTable';
import ProductDialog from '../ui/products/ProductDialog';
import CategoryDialog from '../ui/products/CategoryDialog';

export default function AdminProducts() {
  const {
    // state
    page,
    pageSize,
    sortModel,
    filterModel,
    search,
    selectedCategories,
    disabledState,
    priceMin,
    priceMax,
    stockMin,
    stockMax,
    appliedAdvancedFilters,
    productsReloadKey,
    newCategoryName,
    editingProduct,
    editingCategory,
    // dialog state
    confirmOpen,
    toDeleteCategory,
    productConfirmOpen,
    toDeleteProduct,
    categoryEditOpen,
    addOpen,
    editOpen,
    // data
    categories,
    categoriesLoading,
    categoriesError,
    productWriteLoading,
    categoryWriteLoading,
    isDirty,
    // setters
    setPage,
    setPageSize,
    setSortModel,
    setFilterModel,
    setSearch,
    setSelectedCategories,
    setDisabledState,
    setPriceMin,
    setPriceMax,
    setStockMin,
    setStockMax,
    setNewCategoryName,
    setAddOpen,
    setEditOpen,
    setEditingProduct,
    setCategoryEditOpen,
    setEditingCategory,
    setConfirmOpen,
    setProductConfirmOpen,
    // handlers
    applyAdvancedFilters,
    resetAdvancedFilters,
    handleAddCategory,
    handleSaveCategoryEdit,
    handleCreateProduct,
    handleSaveEdit,
    handleToggleDisabled,
    openCategoryEditDialog,
    openEditDialog,
    handleConfirmDelete,
    handleConfirmProductDelete,
    openProductDeleteConfirm,
    openDeleteConfirm,
  } = useProductManagement();

  const { rows, rowCount, loading } = usePaginatedProducts(
    page,
    pageSize,
    sortModel,
    filterModel,
    productsReloadKey,
    {
      search: appliedAdvancedFilters.search || '',
      categories: appliedAdvancedFilters.categories || [],
      disabled: appliedAdvancedFilters.disabled || '',
      priceMin: appliedAdvancedFilters.priceMin || '',
      priceMax: appliedAdvancedFilters.priceMax || '',
      stockMin: appliedAdvancedFilters.stockMin || '',
      stockMax: appliedAdvancedFilters.stockMax || '',
    },
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 'calc(80vh - 150px)',
      }}
    >
      <Box sx={{ p: 3, pb: 1 }}>
        <ProductFilters
          title='Products'
          search={search}
          setSearch={setSearch}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          disabledState={disabledState}
          setDisabledState={setDisabledState}
          priceMin={priceMin}
          setPriceMin={setPriceMin}
          priceMax={priceMax}
          setPriceMax={setPriceMax}
          stockMin={stockMin}
          setStockMin={setStockMin}
          stockMax={stockMax}
          setStockMax={setStockMax}
          categories={categories || []}
          applyAdvancedFilters={applyAdvancedFilters}
          resetAdvancedFilters={resetAdvancedFilters}
          isDirty={isDirty}
          appliedAdvancedFilters={appliedAdvancedFilters}
          onAddProduct={() => setAddOpen(true)}
        />
      </Box>

      <ProductDataGrid
        rows={rows}
        rowCount={rowCount}
        loading={loading || productWriteLoading}
        page={page}
        pageSize={pageSize}
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
        onEditProduct={openEditDialog}
        onToggleDisabled={handleToggleDisabled}
      />

      <CategorySection
        categories={categories}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        categoryWriteLoading={categoryWriteLoading}
        onAddCategory={handleAddCategory}
        onEditCategory={openCategoryEditDialog}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete category ${toDeleteCategory?.name || ''}?`}
        description={`Are you sure you want to delete the category "${toDeleteCategory?.name || ''}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
        confirmText='Delete'
      />

      <ConfirmDialog
        open={productConfirmOpen}
        title={`Delete product ${toDeleteProduct?.name || ''}?`}
        description={`Are you sure you want to delete the product "${toDeleteProduct?.name || ''}"? This action cannot be undone and will permanently remove the product from your inventory.`}
        onConfirm={handleConfirmProductDelete}
        onClose={() => setProductConfirmOpen(false)}
        confirmText='Delete'
      />

      <ProductDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        mode='add'
        product={null}
        onSubmit={handleCreateProduct}
        categories={categories}
        loading={productWriteLoading}
      />

      <ProductDialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditingProduct(null);
        }}
        mode='edit'
        product={editingProduct}
        onSubmit={handleSaveEdit}
        onDelete={openProductDeleteConfirm}
        categories={categories}
        loading={productWriteLoading}
      />

      <CategoryDialog
        open={categoryEditOpen}
        onClose={() => {
          setCategoryEditOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSubmit={handleSaveCategoryEdit}
        onDelete={openDeleteConfirm}
        loading={categoryWriteLoading}
      />
    </Box>
  );
}
