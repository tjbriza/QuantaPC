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
      className='bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer'
      style={{ width: '22rem', height: '22rem' }}
      onClick={handleClick}
    >
      <img
        src={product.image_url || 'https://placehold.co/150'}
        alt={product.name}
        className='w-full h-40 object-cover rounded-md mb-3'
      />
      <h3 className='text-lg font-semibold text-gray-800 mb-2'>{product.name}</h3>
      <div className='flex justify-between items-center mt-2'>
        <p className='text-gray-600 font-medium'>
          {product.price.toLocaleString('en-PH', {
            style: 'currency',
            currency: 'PHP',
          })}
        </p>
        <p className='text-yellow-500'>⭐({product.rating.toFixed(1)})</p>
      </div>
    </a>
  );
}
