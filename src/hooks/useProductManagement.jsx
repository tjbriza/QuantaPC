import { useState, useMemo } from 'react';
import { useSupabaseWrite } from './useSupabaseWrite';
import { useSupabaseRead } from './useSupabaseRead';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export function useProductManagement() {
  const { toast } = useToast();
  const { session } = useAuth();

  // State for pagination and filtering
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
    quickFilterValues: [],
  });

  // Filter state
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [disabledState, setDisabledState] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [stockMin, setStockMin] = useState('');
  const [stockMax, setStockMax] = useState('');
  const [appliedAdvancedFilters, setAppliedAdvancedFilters] = useState({});

  // Reload keys for data refresh
  const [productsReloadKey, setProductsReloadKey] = useState(Date.now());
  const [categoriesReloadKey, setCategoriesReloadKey] = useState(Date.now());

  // Category management
  const [newCategoryName, setNewCategoryName] = useState('');

  // Dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteCategory, setToDeleteCategory] = useState(null);
  const [productConfirmOpen, setProductConfirmOpen] = useState(false);
  const [toDeleteProduct, setToDeleteProduct] = useState(null);
  const [categoryEditOpen, setCategoryEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    brand: '',
    image_url: '',
  });

  // Supabase hooks
  const {
    insertData: insertProduct,
    updateData: updateProductData,
    deleteData: deleteProduct,
    loading: productWriteLoading,
  } = useSupabaseWrite('products');

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSupabaseRead('categories', { reloadKey: categoriesReloadKey });

  const {
    insertData: insertCategory,
    updateData: updateCategory,
    deleteData: deleteCategory,
    loading: categoryWriteLoading,
  } = useSupabaseWrite('categories');

  // Computed values
  const isDirty = useMemo(
    () =>
      JSON.stringify({
        search,
        selectedCategories,
        disabledState,
        priceMin,
        priceMax,
        stockMin,
        stockMax,
      }) !==
      JSON.stringify({
        search: appliedAdvancedFilters.search || '',
        selectedCategories: appliedAdvancedFilters.categories || [],
        disabledState: appliedAdvancedFilters.disabled || '',
        priceMin: appliedAdvancedFilters.priceMin || '',
        priceMax: appliedAdvancedFilters.priceMax || '',
        stockMin: appliedAdvancedFilters.stockMin || '',
        stockMax: appliedAdvancedFilters.stockMax || '',
      }),
    [
      search,
      selectedCategories,
      disabledState,
      priceMin,
      priceMax,
      stockMin,
      stockMax,
      appliedAdvancedFilters,
    ],
  );

  // Handlers
  const applyAdvancedFilters = () => {
    setAppliedAdvancedFilters({
      search,
      categories: [...selectedCategories],
      disabled: disabledState,
      priceMin,
      priceMax,
      stockMin,
      stockMax,
    });
    setPage(0);
  };

  const resetAdvancedFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setDisabledState('');
    setPriceMin('');
    setPriceMax('');
    setStockMin('');
    setStockMax('');
    setAppliedAdvancedFilters({});
    setPage(0);
  };

  const resetProductForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      category_id: '',
      brand: '',
      image_url: '',
    });
  };

  // Category operations
  const handleAddCategory = async () => {
    const name = (newCategoryName || '').trim();
    if (!name) return;

    const { error } = await insertCategory([{ name }]);
    if (error) {
      console.error('Add category error', error);
      toast.error('Failed to add category');
      return;
    }

    toast.success('Category added');
    setNewCategoryName('');
    setCategoriesReloadKey(Date.now());
  };

  const handleSaveCategoryEdit = async (data) => {
    if (!editingCategory) return;

    if (!data.name) {
      toast.error('Category name is required');
      return;
    }

    const { error } = await updateCategory({ id: editingCategory.id }, data);
    if (error) {
      console.error('Category update error', error);
      toast.error('Failed to update category');
      return;
    }

    setCategoryEditOpen(false);
    setEditingCategory(null);
    setCategoriesReloadKey(Date.now());
    setFilterModel((f) => ({ ...f }));
    toast.success('Category updated');
  };

  const handleDeleteCategory = async (id) => {
    if (!id) return;

    const { error } = await deleteCategory({ id });
    if (error) {
      console.error('Delete category error', error);
      toast.error('Failed to delete category');
      return;
    }

    setCategoriesReloadKey(Date.now());
    setFilterModel((f) => ({ ...f }));
    toast.success('Category deleted');
  };

  // Product operations
  const handleCreateProduct = async (data) => {
    const payload = {
      name: data.name,
      description: data.description,
      price: parseInt(data.price, 10) || 0,
      stock_quantity: parseInt(data.stock_quantity, 10) || 0,
      category_id: data.category_id,
      brand: data.brand,
      image_url: data.image_url,
    };

    const { error } = await insertProduct([payload]);
    if (error) {
      console.error('Add product error', error);
      toast.error('Failed to add product');
      return;
    }

    toast.success('Product added');
    setAddOpen(false);
    resetProductForm();
    setProductsReloadKey(Date.now());
    setPage(0);
  };

  const handleSaveEdit = async (data) => {
    if (!editingProduct) return;

    const updates = {
      name: data.name,
      description: data.description,
      price: parseInt(data.price, 10) || 0,
      stock_quantity: parseInt(data.stock_quantity, 10) || 0,
      category_id: data.category_id,
      brand: data.brand,
      image_url: data.image_url,
    };
    const before = {
      name: editingProduct.name,
      description: editingProduct.description,
      price: editingProduct.price,
      stock_quantity: editingProduct.stock_quantity,
      category_id: editingProduct.category_id,
      brand: editingProduct.brand,
      image_url: editingProduct.image_url,
      is_disabled: editingProduct.is_disabled, // in case present
    };

    const { error } = await updateProductData(
      { id: editingProduct.id },
      updates,
    );
    if (error) {
      console.error('Update product error', error);
      toast.error('Failed to update product');
      return;
    }

    // diff
    const changedFields = Object.keys(updates).filter(
      (k) => String(before[k]) !== String(updates[k]),
    );
    if (changedFields.length > 0 && session?.user?.id) {
      try {
        const logPayload = {
          product_id: editingProduct.id,
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
          .from('product_edit_logs')
          .insert(logPayload);
        if (logError)
          console.warn('Product audit log failed:', logError.message);
      } catch (e) {
        console.warn('Unexpected product audit log error:', e);
      }
    }

    toast.success('Product updated');
    setEditOpen(false);
    setEditingProduct(null);
    setProductsReloadKey(Date.now());
  };

  const handleDeleteProduct = async (id) => {
    if (!id) return;

    const { error } = await deleteProduct({ id });
    if (error) {
      console.error('Delete product error', error);
      toast.error('Failed to delete product');
      return;
    }

    if (editingProduct && editingProduct.id === id) {
      setEditOpen(false);
      setEditingProduct(null);
    }

    setProductsReloadKey(Date.now());
    setPage(0);
    toast.success('Product deleted');
  };

  const handleToggleDisabled = async (product) => {
    if (!product || !product.id) return;

    const beforeDisabled = product.is_disabled;
    const newVal = !beforeDisabled;
    product.is_disabled = newVal; // optimistic UI

    const { error } = await updateProductData(
      { id: product.id },
      { is_disabled: newVal },
    );
    if (error) {
      console.error('Toggle disable error', error);
      toast.error('Failed to update status');
      product.is_disabled = beforeDisabled; // revert
      return;
    }

    if (session?.user?.id && beforeDisabled !== newVal) {
      try {
        const logPayload = {
          product_id: product.id,
          actor_user_id: session.user.id,
          changed_fields: ['is_disabled'],
          previous_values: { is_disabled: beforeDisabled },
          new_values: { is_disabled: newVal },
        };
        const { error: logError } = await supabase
          .from('product_edit_logs')
          .insert(logPayload);
        if (logError)
          console.warn('Product disable audit log failed:', logError.message);
      } catch (e) {
        console.warn('Unexpected product disable audit log error:', e);
      }
    }

    toast.success(newVal ? 'Product disabled' : 'Product enabled');
    setProductsReloadKey(Date.now());
  };

  // Dialog handlers
  const openDeleteConfirm = (category) => {
    setToDeleteCategory(category);
    setConfirmOpen(true);
  };

  const openCategoryEditDialog = (category) => {
    setEditingCategory(category);
    setCategoryEditOpen(true);
  };

  const openProductDeleteConfirm = (product) => {
    setToDeleteProduct(product);
    setProductConfirmOpen(true);
  };

  const openEditDialog = (row) => {
    setEditingProduct(row);
    setEditOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDeleteCategory) return;
    await handleDeleteCategory(toDeleteCategory.id);
    setConfirmOpen(false);
    setToDeleteCategory(null);
  };

  const handleConfirmProductDelete = async () => {
    if (!toDeleteProduct) return;
    await handleDeleteProduct(toDeleteProduct.id);
    setProductConfirmOpen(false);
    setToDeleteProduct(null);
  };

  return {
    // State
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
    newProduct,
    editingProduct,
    editingCategory,

    // Dialog state
    confirmOpen,
    toDeleteCategory,
    productConfirmOpen,
    toDeleteProduct,
    categoryEditOpen,
    addOpen,
    editOpen,

    // Data
    categories,
    categoriesLoading,
    categoriesError,
    productWriteLoading,
    categoryWriteLoading,
    isDirty,

    // Setters
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
    setNewProduct,
    setAddOpen,
    setEditOpen,
    setEditingProduct,
    setCategoryEditOpen,
    setEditingCategory,
    setConfirmOpen,
    setProductConfirmOpen,

    // Handlers
    applyAdvancedFilters,
    resetAdvancedFilters,
    resetProductForm,
    handleAddCategory,
    handleSaveCategoryEdit,
    handleDeleteCategory,
    handleCreateProduct,
    handleSaveEdit,
    handleDeleteProduct,
    handleToggleDisabled,
    openDeleteConfirm,
    openCategoryEditDialog,
    openProductDeleteConfirm,
    openEditDialog,
    handleConfirmDelete,
    handleConfirmProductDelete,
  };
}
