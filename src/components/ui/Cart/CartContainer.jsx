import { useState, useEffect } from 'react';
import { useSupabaseCart } from '../../../hooks/useSupabaseCart';
import CartHeader from './CartHeader';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';

export default function CartContainer({ userCart }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const { updateCartItemQuantity, removeCartItem } = useSupabaseCart();

  const selectAll =
    userCart.length > 0 && selectedItems.length === userCart.length;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(userCart.map((item) => item.cart_item_id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    setSelectedItems((prev) => {
      if (checked) {
        if (!prev.includes(itemId)) return [...prev, itemId];
        return prev;
      } else {
        return prev.filter((id) => id !== itemId);
      }
    });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach((itemId) => {
      const item = userCart.find(
        (cartItem) => cartItem.cart_item_id === itemId
      );
      if (item) {
        removeCartItem(item.product_id);
      }
    });
    setSelectedItems([]);
  };

  const totalPrice =
    userCart?.reduce(
      (sum, item) => sum + item.product_price * item.quantity,
      0
    ) || 0;

  const totalItems =
    userCart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className='w-full flex justify-center px-4'>
      <div className='w-full max-w-[45rem]'>
        <h2 className='text-3xl font-bold mb-8 text-center text-gray-800'>
          Your Cart
        </h2>

        {userCart.length > 0 ? (
          <div className='bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-b-4 border-gray-300'>
            <CartHeader
              selectAll={selectAll}
              onSelectAll={handleSelectAll}
              selectedCount={selectedItems.length}
              onDeleteSelected={handleDeleteSelected}
            />
            <div className='divide-y divide-gray-200'>
              {userCart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  selected={selectedItems.includes(item.id)}
                  onSelectChange={handleSelectItem}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
            <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>
    </div>
  );
}
