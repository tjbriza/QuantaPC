import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseCart } from '../../hooks/useSupabaseCart';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import { useToast } from '../../context/ToastContext';

export default function CheckoutPage() {
  const { session } = useAuth();
  const { cartItems, loadingCart } = useSupabaseCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // use environment variable or detect API base URL
  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
      ? 'http://localhost:3000'
      : 'https://quanta-pc.vercel.app/');

  // fetch user addresses
  const { data: addresses } = useSupabaseRead('shipping_address', {
    filter: { user_id: session?.user?.id },
    order: { column: 'is_default', ascending: false },
  });

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddr = addresses.find((addr) => addr.is_default);
      setSelectedAddress(defaultAddr || addresses[0]);
    }
  }, [addresses]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0,
  );
  const shippingFee = 50;
  const total = subtotal + shippingFee;

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/createOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(API_BASE_URL.includes('ngrok') && {
            'ngrok-skip-browser-warning': 'true',
          }),
        },
        body: JSON.stringify({
          userId: session.user.id,
          items: cartItems,
          shippingAddress: selectedAddress,
          subtotal,
          shippingFee,
          total,
          customerEmail: session.user.email,
        }),
      });

      const result = await response.json();

      if (result.success && result.invoiceUrl) {
        // store order info in session storage for success page
        sessionStorage.setItem(
          'lastOrder',
          JSON.stringify({
            orderNumber: result.orderNumber,
            total: total,
          }),
        );

        // redirect to payment page
        window.location.href = result.invoiceUrl;
      } else {
        toast.error(result.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An error occurred during checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loadingCart) {
    return <div className='text-center py-8'>Loading checkout...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className='max-w-2xl mx-auto text-center py-64'>
        <h1 className='text-3xl font-bold mb-4'>Your cart is empty</h1>
        <button
          onClick={() => navigate('/products')}
          className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700'
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto text-center py-32'>
      <h1 className='text-3xl font-bold mb-8'>Checkout</h1>

      {/* Order Summary */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='space-y-6'>
          <div className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-xl font-semibold mb-4'>Order Items</h2>
            {cartItems.map((item) => (
              <div
                key={item.cart_item_id}
                className='flex items-center space-x-4 py-3 border-b last:border-b-0'
              >
                <img
                  src={item.image || 'https://placehold.co/60x60'}
                  alt={item.product_name}
                  className='w-15 h-15 object-cover rounded'
                />
                <div className='flex-1'>
                  <h3 className='font-medium'>{item.product_name}</h3>
                  <p className='text-gray-600'>Qty: {item.quantity}</p>
                  <p className='text-sm text-gray-500'>
                    ₱{item.product_price.toLocaleString()} each
                  </p>
                </div>
                <div className='text-right'>
                  <p className='font-semibold'>
                    ₱{(item.product_price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-xl font-semibold mb-4'>Shipping Address</h2>
            {addresses && addresses.length > 0 ? (
              <div className='space-y-3'>
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`flex items-start space-x-3 cursor-pointer p-3 border rounded transition-colors
                      ${
                        selectedAddress?.id === address.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    <input
                      type='radio'
                      name='address'
                      checked={selectedAddress?.id === address.id}
                      onChange={() => setSelectedAddress(address)}
                      className='mt-1'
                    />
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium'>
                          {address.address_label}
                        </span>
                        {address.is_default && (
                          <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>
                            Default
                          </span>
                        )}
                      </div>
                      <div className='text-sm text-gray-600 mt-1'>
                        {address.full_name} - {address.phone_number}
                      </div>
                      <div className='text-sm text-gray-600'>
                        {address.house_number} {address.street_name},{' '}
                        {address.barangay}, {address.city}
                      </div>
                    </div>
                  </label>
                ))}
                <button
                  onClick={() => navigate('/dashboard/addresses')}
                  className='text-blue-600 hover:text-blue-700 text-sm'
                >
                  + Add new address
                </button>
              </div>
            ) : (
              <div className='text-center py-4'>
                <p className='text-gray-600 mb-4'>
                  No shipping addresses found
                </p>
                <button
                  onClick={() => navigate('/dashboard/addresses')}
                  className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
                >
                  Add Address
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className='bg-white rounded-lg shadow p-6 h-fit'>
          <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
          <div className='space-y-3'>
            <div className='flex justify-between text-gray-600'>
              <span>Items ({cartItems.length}):</span>
              <span>₱{subtotal.toLocaleString()}</span>
            </div>
            <div className='flex justify-between text-gray-600'>
              <span>Shipping:</span>
              <span>₱{shippingFee.toLocaleString()}</span>
            </div>
            <hr />
            <div className='flex justify-between font-semibold text-lg'>
              <span>Total:</span>
              <span className='text-green-600'>₱{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={
              isProcessing || !selectedAddress || cartItems.length === 0
            }
            className='w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-6 
              disabled:bg-gray-400 disabled:cursor-not-allowed 
              hover:bg-green-700 transition-colors
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
          >
            {isProcessing ? (
              <div className='flex items-center justify-center'>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                Processing...
              </div>
            ) : (
              'Proceed to Payment'
            )}
          </button>

          <div className='mt-4 text-xs text-gray-500 text-center'>
            Secure payment powered by Xendit
          </div>
        </div>
      </div>
    </div>
  );
}
