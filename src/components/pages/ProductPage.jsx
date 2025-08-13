import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useFullProductDetails } from '../../hooks/useFullProductDetails';
import { useSupabaseCart } from '../../hooks/useSupabaseCart';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import ProductCard from '../ui/ProductCatalog/ProductCard.jsx';
export default function ProductPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useSupabaseCart();
  const productFromState = location.state?.product;
  const shouldFetch = !productFromState;
  const {
    product: fetchedProduct,
    productLoading,
    productError,
    spec,
    specLoading,
    specError,
  } = useFullProductDetails(id, { enabled: shouldFetch });

  const {
    data: productRecommendations,
    error: RecommendationError,
    loading: RecommendationLoading,
  } = useSupabaseRead('products', {
    limit: 4,
    random: true,
    filter: { id: { neq: id } },
  });

  const product = productFromState || fetchedProduct;
  const [productQuantity, setProductQuantity] = useState(1);
  function handleAddToCart(quantity = 1) {
    if (product) {
      addToCart(product.id, quantity);
      navigate('/cart', { replace: true });
    }
  }

  if (productError) {
    navigate('/404', { replace: true });
  }
  //note: create universal loading state for whole pages and buttons (probably spinner).
  while (shouldFetch && productLoading) {
    return <div className='flex justify-center mt-[15vh]'>Loading...</div>;
  }

  return (
    <div className='max-w-6xl mx-auto px-8 mt-[15vh]'>
      <div className='flex flex-col md:flex-row items-center gap-8'>
        <img
          src={product.image || 'https://placehold.co/300'}
          alt={product.name}
          className='w-full md:w-1/2 rounded-lg shadow-lg'
        />
        <div className='flex flex-col gap-4 w-full md:w-1/2'>
          <h1 className='text-3xl font-bold'>{product.name}</h1>
          <p className='text-xl text-gray-700'>
            {product.price.toLocaleString('en-PH', {
              style: 'currency',
              currency: 'PHP',
            })}
          </p>
          <p className='text-gray-600'>Stocks Left: {product.stock_quantity}</p>
          <p className='text-gray-600'>{product.description}</p>
          <button
            onClick={() => handleAddToCart(productQuantity)}
            className='mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors'
          >
            Add to Cart
          </button>
          <div>
            <label className='text-gray-600'>Quantity:</label>
            <input
              type='number'
              min='1'
              max={product.stock_quantity}
              defaultValue='1'
              className='border border-gray-300 rounded-lg px-4 py-2 w-20'
              onChange={(e) => setProductQuantity(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {spec && (
        <div className='mt-8 mb-8'>
          <h2 className='text-2xl font-semibold mb-4'>Specifications</h2>
          <table className='min-w-full bg-white border border-gray-200'>
            <tbody>
              {Object.entries(spec)
                .filter(([key]) => key !== 'product_id' && key !== 'created_at') // exclude keys
                .map(([key, value]) => {
                  const formattedKey = key
                    .replace(/_/g, ' ') // replace underscores with spaces
                    .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize each word
                  return (
                    <tr key={key} className='border-b border-gray-200'>
                      <td className='px-6 py-4 font-medium'>{formattedKey}</td>
                      <td className='px-6 py-4'>{value}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
      <h2 className='text-2xl font-semibold text-center mb-4'>
        You may also like
      </h2>
      <div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8'>
          {productRecommendations?.map((recommendation) => (
            <ProductCard
              key={recommendation.id}
              product={recommendation}
              img={recommendation.image_url || 'https://placehold.co/150'}
              name={recommendation.name}
              price={recommendation.price}
              alt={recommendation.name || 'Product Image'}
              rating={recommendation.rating || 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
