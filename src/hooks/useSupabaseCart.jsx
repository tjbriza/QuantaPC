//supabase cart hook, for managing user cart, view, update, delete add!!!!!!
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from './useDebounce';
export function useSupabaseCart() {
  const { session } = useAuth();
  const [loadingCart, setLoadingCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [removingCartItem, setRemovingCartItem] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [updatingQuantity, setupdatingQuantity] = useState(false);
  const [errors, setErrors] = useState({});

  const operationRef = useRef({
    addToCart: false,
    updateQuantity: false,
    removeCartItem: false,
  });

  const userId = session?.user?.id;

  //fetch cart items for the authenticated user
  const fetchCartItems = useCallback(async () => {
    if (!userId) {
      setErrors((prev) => ({
        ...prev,
        general: new Error('User not authenticated'),
      }));
      return;
    }

    setLoadingCart(true);
    setErrors((prev) => ({ ...prev, fetchCart: null }));

    try {
      const { data, error } = await supabase.rpc('getCartItems', {
        p_user_id: userId,
      });

      if (error) {
        throw error;
      }

      setCartItems(data || []);
    } catch (error) {
      setErrors((prev) => ({ ...prev, fetch: error }));
      console.error('Error fetching cart items:', error);
    } finally {
      setLoadingCart(false);
    }
  }, [userId]);

  const clearError = useCallback((errorType) => {
    setErrors((prev) => ({ ...prev, [errorType]: null }));
  }, []);

  //add item to cart
  const addToCart = useCallback(
    async (p_product_id, p_quantity = 1) => {
      console.log('Product ID:', p_product_id, 'Type:', typeof p_product_id);
      console.log('Quantity:', p_quantity, 'Type:', typeof p_quantity);
      console.log('User ID:', userId, 'Type:', typeof userId);
      if (!userId) {
        setErrors((prev) => ({
          ...prev,
          general: new Error('User not authenticated'),
        }));

        return;
      }

      if (operationRef.current.addToCart) {
        return { success: false, error: 'Operation in progress' };
      }

      operationRef.current.addToCart = true;
      setAddingToCart(true);
      clearError('addToCart');

      const tempId = `temp-${Date.now()}`;
      const optimisticItem = {
        id: tempId,
        product_id: p_product_id,
        quantity: p_quantity,
        isOptimistic: true,
      };

      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product_id === p_product_id
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + p_quantity,
            isOptimistic: true,
          };
          return updated;
        } else {
          return [...prev, optimisticItem];
        }
      });

      try {
        const { data, error } = await supabase.rpc('addToCart', {
          p_user_id: session.user?.id,
          p_product_id,
          p_quantity,
        });

        if (error) {
          throw error;
        }

        await fetchCartItems();
        return { success: true, data };
      } catch (error) {
        setCartItems((prev) => prev.filter((item) => item.id !== tempId));
        setErrors((prev) => ({ ...prev, addToCart: error }));
        console.error('Error adding item to cart:', error);
        return { success: false, error: error.message };
      } finally {
        setAddingToCart(false);
      }
    },
    [session?.user?.id, fetchCartItems, clearError]
  );

  //remove item from cart
  const removeCartItem = useCallback(
    async (p_product_id) => {
      if (!session) {
        setErrors((prev) => ({
          ...prev,
          removeCartItem: 'User not authenticated',
        }));
        console.error('User not authenticated');
        return;
      }

      if (operationRef.current.removeCartItem) {
        return { success: false, error: 'Operation in progress' };
      }

      operationRef.current.removeCartItem = true;
      setRemovingCartItem(true);
      clearError('removeCartItem');

      const previousItems = cartItems;
      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== p_product_id)
      );

      try {
        const { data, error } = await supabase.rpc('removeCartItem', {
          p_product_id: p_product_id,
          p_user_id: session.user?.id,
        });
        if (error) {
          throw error;
        }

        return { success: true, data };
      } catch (error) {
        setCartItems(previousItems);
        setErrors((prev) => ({ ...prev, removeCartItem: error }));
        console.error('Error removing cart item:', error);
        return { success: false, error: error.message };
      } finally {
        operationRef.current.removeCartItem = false;
        setRemovingCartItem(false);
      }
    },
    [session?.user?.id, cartItems, clearError]
  );

  //actual server cart update
  const updateQuantityOnDatabase = useCallback(
    async (p_product_id, p_quantity) => {
      if (operationRef.current.updateQuantity) {
        console.log('Operation already in progress');
        return { success: false, error: 'Operation in progress' };
      }
      operationRef.current.updateQuantity = true;
      setupdatingQuantity(true);
      clearError('updateQuantity');

      try {
        const { data, error } = await supabase.rpc('updateCartItemQuantity', {
          p_user_id: session.user?.id,
          p_product_id: p_product_id,
          p_quantity: p_quantity,
        });

        if (error) {
          console.log(error);
          throw error;
        }

        await fetchCartItems();
        return { success: true, data };
      } catch (error) {
        setErrors((prev) => ({ ...prev, updateQuantity: error }));
        return { success: false, error: error.message };
      } finally {
        setupdatingQuantity(false);
        operationRef.current.updateQuantity = false;
      }
    },
    [session?.user?.id, fetchCartItems, clearError]
  );

  const [debouncedUpdateQuantity] = useDebounce(updateQuantityOnDatabase, 800); // #ms

  //client side update cart item quantity
  const updateCartItemQuantity = useCallback(
    async (p_product_id, p_quantity) => {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product_id === p_product_id
            ? { ...item, quantity: p_quantity, isOptimistic: true }
            : item
        )
      );

      const result = await debouncedUpdateQuantity(p_product_id, p_quantity);
    },
    [debouncedUpdateQuantity]
  );

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {
    return () => {
      operationRef.current = {
        addToCart: false,
        updateQuantity: false,
        removeCartItem: false,
      };
    };
  }, []);

  return {
    cartItems,
    addToCart,
    fetchCartItems,
    updateCartItemQuantity,
    removeCartItem,
    updatingQuantity,
    loadingCart,
    addingToCart,
    removingCartItem,
    errors,
    clearError,
  };
}
