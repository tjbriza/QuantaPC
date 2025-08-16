import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSupabaseWrite } from './useSupabaseWrite';
import { supabase } from '../supabaseClient';

export function useWishlist() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Write operations
  const { insertData: addWishlistItem } = useSupabaseWrite('wishlist');
  const { deleteData: removeWishlistItem } = useSupabaseWrite('wishlist');

  // Fetch wishlist items manually
  const fetchWishlistItems = useCallback(async () => {
    if (!userId) {
      setWishlistItems([]);
      return;
    }

    setFetchLoading(true);
    setFetchError(null);

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(
          `
          id,
          product_id,
          added_at,
          products (
            id,
            name,
            price,
            image_url,
            brand,
            stock_quantity,
            description
          )
        `
        )
        .eq('user_id', userId);

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (err) {
      setFetchError(err);
      console.error('Error fetching wishlist:', err);
    } finally {
      setFetchLoading(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchWishlistItems();
  }, [fetchWishlistItems]);

  // Manual refetch function
  const refetch = useCallback(() => {
    fetchWishlistItems();
  }, [fetchWishlistItems]);

  // Check if product is in wishlist
  const isInWishlist = useCallback(
    (productId) => {
      if (!productId || !wishlistItems) return false;
      return wishlistItems.some((item) => item.product_id === productId);
    },
    [wishlistItems]
  );

  // Add to wishlist
  const addToWishlist = useCallback(
    async (productId) => {
      if (!userId || !productId) {
        return {
          error: { message: 'User not authenticated or invalid product' },
        };
      }

      // Check if already in wishlist
      if (isInWishlist(productId)) {
        return { error: { message: 'Product already in wishlist' } };
      }

      setIsLoading(true);

      const { error } = await addWishlistItem([
        {
          user_id: userId,
          product_id: productId,
        },
      ]);

      if (!error) {
        refetch(); // Refresh the wishlist
      }

      setIsLoading(false);
      return { error };
    },
    [userId, addWishlistItem, refetch, isInWishlist]
  );

  // Remove from wishlist
  const removeFromWishlist = useCallback(
    async (productId) => {
      if (!userId || !productId) {
        return {
          error: { message: 'User not authenticated or invalid product' },
        };
      }

      setIsLoading(true);

      const { error } = await removeWishlistItem({
        user_id: userId,
        product_id: productId,
      });

      if (!error) {
        refetch(); // Refresh the wishlist
      }

      setIsLoading(false);
      return { error };
    },
    [userId, removeWishlistItem, refetch]
  );

  // Toggle wishlist status
  const toggleWishlist = useCallback(
    async (productId) => {
      if (isInWishlist(productId)) {
        return await removeFromWishlist(productId);
      } else {
        return await addToWishlist(productId);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  );

  // Get wishlist count
  const wishlistCount = wishlistItems?.length || 0;

  return {
    wishlistItems: wishlistItems || [],
    wishlistCount,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    loading: fetchLoading || isLoading,
    error: fetchError,
    refetch,
  };
}
