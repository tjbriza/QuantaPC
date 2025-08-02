import CartCard from './CartCard';

export default function CardContainer({ userCart }) {
  return (
    <div className='cart-container'>
      <h2 className='text-2xl font-bold mb-4'>Your Cart</h2>
      <div className='cart-items grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {userCart?.length > 0 ? (
          userCart.map((item) => <CartCard key={item.id} item={item} />)
        ) : (
          <p className='text-gray-500'>Your cart is empty.</p>
        )}
      </div>
      <div className='cart-summary mt-6'>
        <h3 className='text-xl font-semibold'>Cart Summary</h3>
        {/* Add summary details here, like total price, etc. */}
      </div>
    </div>
  );
}
