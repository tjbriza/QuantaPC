import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSupabaseRead } from './useSupabaseRead';
import { useSupabaseWrite } from './useSupabaseWrite';

export function useWishlist() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [isLoading, setIsLoading] = useState(false);

  // Get all wishlist items for this user with product details
  const {
    data: wishlistItems,
    loading: fetchLoading,
    refetch,
  } = useSupabaseRead('wishlist', {
    filter: { user_id: userId },
    select: `
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
    `,
    enabled: !!userId,
  });

  // Write operations
  const { insertData: addWishlistItem } = useSupabaseWrite('wishlist');
  const { deleteData: removeWishlistItem } = useSupabaseWrite('wishlist');

  console.log(wishlistItems);

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
        await refetch(); // Refresh the wishlist
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
        await refetch(); // Refresh the wishlist
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
    refetch,
  };
}
