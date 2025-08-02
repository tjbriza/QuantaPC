import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export function useSupabaseCart() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('getUserCart', {
      p_user_id: session.user?.id,
    });
    if (error) {
      console.error('Error fetching cart items:', error);
      return;
    }
    setCartItems(data);
  };

  useEffect(() => {
    fetchCartItems();
  }, [session]);

  return {
    cartItems,
  };
}
