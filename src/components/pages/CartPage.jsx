import { useSupabaseCart } from '../../hooks/useSupabaseCart.jsx';
import CartContainer from '../ui/Cart/CartContainer.jsx';
export default function CartPage() {
  const { cartItems, loadingCart } = useSupabaseCart();

  if (loadingCart !== true) {
    console.log(cartItems);
  }

  return (
    <div className='min-h-screen flex items-center justify-center mt-16'>
      <CartContainer userCart={cartItems} />
    </div>
  );
}
