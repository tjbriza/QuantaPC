import { useSupabaseCart } from '../../hooks/useSupabaseCart.jsx';
import CardContainer from '../ui/CartContainer.jsx';
export default function CartPage() {
  const { cartItems } = useSupabaseCart();

  const userCart = cartItems;

  return (
    <div className='min-h-screen flex items-center justify-center mt-16'>
      <CardContainer userCart={userCart} />
    </div>
  );
}
