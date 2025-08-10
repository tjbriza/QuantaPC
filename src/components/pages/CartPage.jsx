import { useSupabaseCart } from '../../hooks/useSupabaseCart.jsx';
import CartContainer from '../ui/Cart/CartContainer.jsx';
export default function CartPage() {
  const { cartItems } = useSupabaseCart();

  const userCart = cartItems;

  console.log(userCart);
  return (
    <div className='min-h-screen flex items-center justify-center mt-16'>
      <CartContainer userCart={userCart} />
    </div>
  );
}
