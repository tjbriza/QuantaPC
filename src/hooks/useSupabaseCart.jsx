import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from './useDebounce';

export function useSupabaseCart() {
  const { session } = useAuth();
  const userId = session?.user?.id;

  // State
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [removingCartItem, setRemovingCartItem] = useState(false);
  const [updatingQuantity, setUpdatingQuantity] = useState(false);
  const [errors, setErrors] = useState({});

  // Prevent concurrent operations per product
  const pendingOps = useRef(new Set());

  // Helpers
  const setOpError = (type, error) =>
    setErrors((prev) => ({ ...prev, [type]: error || null }));

  const requireAuth = (opType) => {
    if (!userId) {
      setOpError(opType, new Error('User not authenticated'));
      return false;
    }
    return true;
  };

  const runRPC = async (fnName, params) => {
    const { data, error } = await supabase.rpc(fnName, params);
    if (error) throw error;
    return data;
  };

  // Fetch cart items
  const fetchCartItems = useCallback(async () => {
    if (!requireAuth('general')) return;
    setLoadingCart(true);
    setOpError('fetchCart', null);

    try {
      const data = await runRPC('getCartItems', { p_user_id: userId });
      setCartItems(data || []);
    } catch (err) {
      setOpError('fetchCart', err);
      console.error('Fetch error:', err);
    } finally {
      setLoadingCart(false);
    }
  }, [userId]);

  // Add to cart (optimistic)
  const addToCart = useCallback(
    async (p_product_id, p_quantity = 1) => {
      if (!requireAuth('general')) return { success: false };
      const opKey = `add-${p_product_id}`;
      if (pendingOps.current.has(opKey))
        return { success: false, error: 'In progress' };
      pendingOps.current.add(opKey);
      setAddingToCart(true);
      setOpError('addToCart', null);

      setCartItems((prev) => {
        const idx = prev.findIndex((i) => i.product_id === p_product_id);
        if (idx >= 0) {
          return prev.map((i, k) =>
            k === idx
              ? { ...i, quantity: i.quantity + p_quantity, isOptimistic: true }
              : i
          );
        }
        return [
          ...prev,
          {
            cart_item_id: `temp-${opKey}-${Date.now()}`,
            product_id: p_product_id,
            quantity: p_quantity,
            product_name: 'Loading...',
            product_price: 0,
            image: null,
            stock_quantity: 999,
            isOptimistic: true,
          },
        ];
      });

      try {
        const data = await runRPC('addToCart', {
          p_user_id: userId,
          p_product_id,
          p_quantity,
        });
        await fetchCartItems();
        return { success: true, data };
      } catch (err) {
        setCartItems((prev) =>
          prev.some((i) => i.cart_item_id?.startsWith('temp-'))
            ? prev.filter((i) => i.product_id !== p_product_id)
            : prev.map((i) =>
                i.product_id === p_product_id
                  ? {
                      ...i,
                      quantity: i.quantity - p_quantity,
                      isOptimistic: false,
                    }
                  : i
              )
        );
        setOpError('addToCart', err);
        return { success: false, error: err.message };
      } finally {
        setAddingToCart(false);
        pendingOps.current.delete(opKey);
      }
    },
    [userId, fetchCartItems]
  );

  // Remove from cart (optimistic)
  const removeCartItem = useCallback(
    async (p_product_id) => {
      if (!requireAuth('removeCartItem')) return { success: false };
      const opKey = `remove-${p_product_id}`;
      if (pendingOps.current.has(opKey))
        return { success: false, error: 'In progress' };
      pendingOps.current.add(opKey);
      setRemovingCartItem(true);
      setOpError('removeCartItem', null);

      const itemToRestore = cartItems.find(
        (i) => i.product_id === p_product_id
      );
      setCartItems((prev) => prev.filter((i) => i.product_id !== p_product_id));

      try {
        const data = await runRPC('removeCartItem', {
          p_user_id: userId,
          p_product_id,
        });
        return { success: true, data };
      } catch (err) {
        if (itemToRestore) setCartItems((prev) => [...prev, itemToRestore]);
        setOpError('removeCartItem', err);
        return { success: false, error: err.message };
      } finally {
        setRemovingCartItem(false);
        pendingOps.current.delete(opKey);
      }
    },
    [userId, cartItems]
  );

  // Quantity update
  const updateQuantityOnDatabase = useCallback(
    async (p_product_id, p_quantity) => {
      const opKey = `update-${p_product_id}`;
      if (pendingOps.current.has(opKey))
        return { success: false, error: 'In progress' };
      pendingOps.current.add(opKey);
      setUpdatingQuantity(true);
      setOpError('updateQuantity', null);

      try {
        await runRPC('updateCartItemQuantity', {
          p_user_id: userId,
          p_product_id,
          p_quantity,
        });
        setCartItems((prev) =>
          prev.map((i) =>
            i.product_id === p_product_id
              ? { ...i, quantity: p_quantity, isOptimistic: false }
              : i
          )
        );
        return { success: true };
      } catch (err) {
        setOpError('updateQuantity', err);
        await fetchCartItems();
        return { success: false, error: err.message };
      } finally {
        setUpdatingQuantity(false);
        pendingOps.current.delete(opKey);
      }
    },
    [userId, fetchCartItems]
  );

  const [debouncedUpdateQuantity] = useDebounce(updateQuantityOnDatabase, 500);

  const updateCartItemQuantity = useCallback(
    (p_product_id, p_quantity) => {
      setCartItems((prev) =>
        prev.map((i) =>
          i.product_id === p_product_id
            ? { ...i, quantity: p_quantity, isOptimistic: true }
            : i
        )
      );
      debouncedUpdateQuantity(p_product_id, p_quantity);
    },
    [debouncedUpdateQuantity]
  );

  const refreshCart = useCallback(() => {
    if (userId) {
      setLoadingCart(true);
      setOpError('refreshCart', null);
      fetchCartItems();
      setLoadingCart(false);
    }
  }, [userId, fetchCartItems]);

  // Effects
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);
  useEffect(() => () => pendingOps.current.clear(), []);
  useEffect(() => {
    userId ? fetchCartItems() : setCartItems([]);
  }, [userId, fetchCartItems]);

  return {
    cartItems,
    addToCart,
    fetchCartItems,
    refreshCart,
    updateCartItemQuantity,
    removeCartItem,
    updatingQuantity,
    loadingCart,
    addingToCart,
    removingCartItem,
    errors,
    clearError: (type) => setOpError(type, null),
  };
}
