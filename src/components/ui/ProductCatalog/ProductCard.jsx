import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/product/${product.id}`, {
      state: { product },
    });
  }

  return (
    <a
      key={product.id}
      className='bg-white p-4 rounded-sm shadow-md'
      onClick={handleClick}
    >
      <img
        src={product.image_url || 'https://placehold.co/150'}
        alt={product.name}
        className='w-full h-48 object-cover rounded-sm mb-2'
      />
      <h3 className='text-lg font-semibold'>{product.name}</h3>
      <div className='flex justify-between items-center mt-2'>
        <p className='text-gray-600'>
          {product.price.toLocaleString('en-PH', {
            style: 'currency',
            currency: 'PHP',
          })}
        </p>
        <p>⭐({product.rating.toFixed(1)})</p>
      </div>
    </a>
  );
}
