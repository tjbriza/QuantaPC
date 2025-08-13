import { useState, useEffect } from 'react';
import { useSupabaseCart } from '../../../hooks/useSupabaseCart';
import CartHeader from './CartHeader';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';

export default function CartContainer({ userCart, refreshCart }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const {
    updateCartItemQuantity,
    removeCartItem,
    updatingQuantity,
    removingCartItem,
  } = useSupabaseCart();

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

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;

    const selectedProductIds = userCart
      .filter((item) => selectedItems.includes(item.cart_item_id))
      .map((item) => item.product_id);

    const deletePromises = selectedProductIds.map((productId) =>
      removeCartItem(productId)
    );

    try {
      await Promise.all(deletePromises);
      setSelectedItems([]);
    } catch (error) {
      console.error('Error deleting selected items:', error);
    } finally {
      refreshCart();
    }
  };

  const handleDeleteItem = async (productId) => {
    try {
      await removeCartItem(productId);
      setSelectedItems((prev) => {
        const itemToRemove = userCart.find(
          (item) => item.product_id === productId
        );
        if (itemToRemove) {
          return prev.filter((id) => id !== itemToRemove.cart_item_id);
        }
        return prev;
      });
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      refreshCart();
    }
  };

  useEffect(() => {
    setSelectedItems((prev) =>
      prev.filter((selectedId) =>
        userCart.some((item) => item.cart_item_id === selectedId)
      )
    );
  }, [userCart]);

  const totalPrice =
    userCart?.reduce(
      (sum, item) => sum + item.product_price * item.quantity,
      0
    ) || 0;

  const totalItems =
    userCart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className='w-full flex justify-center px-4'>
      <div className='w-full max-w-[90rem]'>
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
              isDeleting={removingCartItem}
            />
            <div className='divide-y divide-gray-200'>
              {userCart.map((item) => (
                <CartItem
                  key={item.cart_item_id}
                  item={item}
                  selected={selectedItems.includes(item.cart_item_id)}
                  onSelectChange={handleSelectItem}
                  onQuantityChange={handleQuantityChange}
                  onDeleteItem={handleDeleteItem}
                  isDeleting={removingCartItem}
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
