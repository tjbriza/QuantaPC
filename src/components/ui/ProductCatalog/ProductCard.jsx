import { useNavigate } from 'react-router-dom';
import { useSupabaseCart } from '../../../hooks/useSupabaseCart';
import HeartButton from '../ProductPage/HeartButton';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, cartItems, addingToCart } = useSupabaseCart();
  const { session } = useAuth();

  const imageSrc =
    product.image_url || product.image || 'https://placehold.co/600x600/png';
  const rating = Number(product.rating || 0);
  const price = Number(product.price || 0);
  const inCart = cartItems?.some((i) => i.product_id === product.id);

  function handleNavigate() {
    navigate(`/product/${product.id}`, { state: { product } });
  }

  async function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      navigate('/login');
      return;
    }
    if (!inCart && !addingToCart) {
      await addToCart(product.id, 1);
      // stay on catalog; no redirect
    }
  }

  function handleLoginRedirect(e) {
    e.preventDefault();
    e.stopPropagation();
    navigate('/login');
  }

  return (
    <div
      key={product.id}
      onClick={handleNavigate}
      className='relative bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer w-full max-w-xs sm:max-w-sm overflow-hidden'
    >
      {/* Image */}
      <div className='relative'>
        <img
          src={imageSrc}
          alt={product.name}
          className='w-full h-44 sm:h-56 object-cover'
        />
      </div>

      {/* Body */}
      <div className='p-4'>
        <h3 className='text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 min-h-[2.0rem]'>
          {product.name}
        </h3>
        {/* Price and rating row */}
        <div className='mt-1 mb-3 flex items-center justify-between'>
          <div className='text-gray-900 font-semibold'>
            {price.toLocaleString('en-PH', {
              style: 'currency',
              currency: 'PHP',
            })}
          </div>
          <div className='flex items-center gap-2 text-gray-900 font-medium'>
            <span className='text-sm'>{rating.toFixed(1)}</span>
            <span className='inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-400'>
              <Star className='w-4 h-4 text-white fill-white' />
            </span>
          </div>
        </div>

        {/* CTA row: Add to Cart + Wishlist */}
        <div className='flex items-center gap-3'>
          <button
            onClick={handleAddToCart}
            disabled={inCart || addingToCart}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${
              inCart
                ? 'bg-[#343A4F] text-white'
                : session
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
            }`}
          >
            {!inCart && <ShoppingCart className='w-5 h-5' />}
            <span className='text-sm font-semibold'>
              {session
                ? inCart
                  ? 'IN CART'
                  : 'ADD TO CART'
                : 'LOGIN TO ADD TO CART'}
            </span>
          </button>

          {/* Wishlist beside CTA */}
          {session ? (
            <HeartButton productId={product.id} size='normal' />
          ) : (
            <button
              onClick={handleLoginRedirect}
              className='w-[50px] h-[50px] flex justify-center items-center rounded-lg border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer'
              title='Login to use wishlist'
            >
              <Heart className='w-6 h-6 stroke-gray-500' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
