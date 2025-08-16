import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../../hooks/useWishlist';
import { useSupabaseCart } from '../../../hooks/useSupabaseCart';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useSupabaseCart();

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product.id, 1);
    if (result.success) {
      // remove from wishlist after adding to cart
      // await removeFromWishlist(product.id);
      navigate('/cart');
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    const { error } = await removeFromWishlist(productId);
    if (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-lg'>Loading wishlist...</div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center text-center'>
        <Heart className='w-16 h-16 text-gray-300 mb-4' />
        <h2 className='text-2xl font-semibold text-gray-600 mb-2'>
          Your wishlist is empty
        </h2>
        <p className='text-gray-500 mb-6'>
          Save products you love by clicking the heart icon
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>My Wishlist</h1>
        <span className='text-gray-600'>
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className='flex flex-col gap-3'>
        {wishlistItems.map((item) => {
          const product = item.products;
          return (
            <div
              key={item.id}
              className='flex bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer'
              onClick={() => handleProductClick(product)}
            >
              <div className='flex justify-center items-center relative cursor-pointer w-72'>
                <img
                  src={product.image_url || 'https://placehold.co/300x200'}
                  alt={product.name}
                  className='w-48 h-48 rounded'
                />
                {product.stock_quantity <= 0 && (
                  <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                    <span className='text-white font-semibold'>
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <div className='p-4 flex w-full justify-between items-center'>
                <h3
                  className='text-lg font-semibold text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600'
                  onClick={() => handleProductClick(product)}
                >
                  {product.name}
                </h3>

                <p className='text-xl font-bold text-gray-900 mb-2'>
                  {product.price.toLocaleString('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                  })}
                </p>

                {product.brand && (
                  <p className='text-sm text-gray-600 mb-4'>{product.brand}</p>
                )}

                <p className='text-sm text-gray-500 mb-4'>
                  Added {new Date(item.added_at).toLocaleDateString()}
                </p>

                <div className='flex gap-2'>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock_quantity <= 0}
                    className='flex-1 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer'
                  >
                    <ShoppingCart className='w-4 h-4' />
                    {product.stock_quantity <= 0
                      ? 'Out of Stock'
                      : 'Add to Cart'}
                  </button>

                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className=' text-black px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center cursor-pointer'
                    title='Remove from wishlist'
                  >
                    <Trash2 className='w-5 h-5' />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
