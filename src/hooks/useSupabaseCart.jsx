//supabase cart hook, for managing user cart, view, update, delete add!!!!!!
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export function useSupabaseCart() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  //fetch cart items for the authenticated user
  const fetchCartItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('getUserCart', {
      p_user_id: session.user?.id,
    });
    if (error) {
      console.error('Error fetching cart items:', error);
      setLoading(false);
      return;
    }
    setCartItems(data);
    setLoading(false);
  };

  const addToCart = async (p_product_id, p_quantity = 1) => {
    const { data, error } = await supabase.rpc('addToCart', {
      p_user_id: session.user?.id,
      p_product_id,
      p_quantity,
    });

    if (error) {
      return error;
    }

    await fetchCartItems();

    return data;
  };

  useEffect(() => {
    fetchCartItems();
  }, [session]);

  return {
    cartItems,
    addToCart,
    loading,
    fetchCartItems,
  };
}
