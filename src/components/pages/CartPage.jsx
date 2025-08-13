import { useEffect } from 'react';
import { useSupabaseCart } from '../../hooks/useSupabaseCart.jsx';
import CartContainer from '../ui/Cart/CartContainer.jsx';

export default function CartPage() {
  const { cartItems, loadingCart, refreshCart } = useSupabaseCart();

  // Refresh cart when page loads to ensure we have the latest data
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  if (loadingCart) {
    return (
      <div className='min-h-screen flex items-center justify-center mt-16'>
        <div className='text-lg'>Loading cart...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center mt-16'>
      <CartContainer userCart={cartItems} refreshCart={refreshCart} />
    </div>
  );
}
