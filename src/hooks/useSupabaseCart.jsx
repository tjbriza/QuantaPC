//supabase cart hook, for managing user cart, view, update, delete add!!!!!!
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export function useSupabaseCart() {
  const { session } = useAuth();
  const [loadingCart, setLoadingCart] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);

  //fetch cart items for the authenticated user
  const fetchCartItems = async () => {
    setLoadingCart(true);
    const { data, error } = await supabase.rpc('getUserCart', {
      p_user_id: session.user?.id,
    });
    if (error) {
      setError(error);
      setLoadingCart(false);
      return;
    }
    setCartItems(data);
    setLoadingCart(false);
  };

  //add item to cart
  const addToCart = async (p_product_id, p_quantity = 1) => {
    if (!session) {
      console.error('User not authenticated');
      setError('User not authenticated');
      return;
    }

    setAddingToCart(true);
    const { data, error } = await supabase.rpc('addToCart', {
      p_user_id: session.user?.id,
      p_product_id,
      p_quantity,
    });

    if (error) {
      setAddingToCart(false);
      setError(error);
      console.error('Error adding to cart:', error);
      return;
    }

    await fetchCartItems();
    setAddingToCart(false);
    return data;
  };

  useEffect(() => {
    fetchCartItems();
  }, [session]);

  return {
    cartItems,
    addToCart,
    fetchCartItems,
    loadingCart,
    addingToCart,
    error,
  };
}
