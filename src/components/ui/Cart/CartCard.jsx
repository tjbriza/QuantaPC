import { useNavigate } from 'react-router-dom';

export default function CartCard({ item }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/product/${item.product_id}`);
  }

  return (
    <div onClick={handleClick} className='cart-card'>
      <img
        src={item.image || 'https://placehold.co/150'}
        alt={item.name}
        className='cart-card-image'
      />
      <div className='cart-card-details'>
        <h3 className='cart-card-title'>{item.name}</h3>
        <p className='cart-card-price'>${item.product_price.toFixed(2)}</p>
        <p className='cart-card-quantity'>Quantity: {item.quantity}</p>
      </div>
    </div>
  );
}
