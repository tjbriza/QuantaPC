import { Heart } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useWishlist } from '../../../hooks/useWishlist';

export default function HeartButton({ productId, size = 'normal' }) {
  const { session } = useAuth();
  const { isInWishlist, toggleWishlist, loading } = useWishlist();

  // Don't show button if user not logged in
  if (!session) {
    return null;
  }

  const isWished = isInWishlist(productId);

  const handleClick = async (e) => {
    e.preventDefault(); // Prevent any parent click events
    e.stopPropagation();

    const { error } = await toggleWishlist(productId);
    if (error) {
      console.error('Wishlist error:', error.message);
    }
  };

  // Size variations
  const sizeClasses = {
    small: 'w-8 h-8',
    normal: 'w-[50px] h-[50px]',
    large: 'w-12 h-12',
  };

  const iconSizes = {
    small: 'w-4 h-4',
    normal: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${
        sizeClasses[size]
      } flex justify-center items-center cursor-pointer rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          ${
            isWished
              ? 'bg-red-400 hover:bg-red-500'
              : 'bg-white hover:bg-gray-100 border border-gray-300'
          }`}
      title={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`${iconSizes[size]} transition-colors
            ${isWished ? 'stroke-white fill-white' : 'stroke-red-400'}`}
      />
    </button>
  );
}
