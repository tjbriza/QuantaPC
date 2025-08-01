import { useLocation } from 'react-router-dom';

export default function ProductPage() {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return (
      <div className='max-w-6xl mx-auto px-8 mt-16'>
        <h1 className='text-2xl font-semibold text-red-600 mb-4 flex justify-center'>
          Product Not Found
        </h1>
        <p className='text-center'>
          The product you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto px-8 mt-16'>
      <h1 className='text-2xl font-semibold text-black mb-4 flex justify-center'>
        Product Page
      </h1>
      <p className='text-center'>
        This is a placeholder for the product details.
      </p>
    </div>
  );
}
