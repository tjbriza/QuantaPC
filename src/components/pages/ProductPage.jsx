import { useNavigate, useParams } from 'react-router-dom';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import { useFullProductDetails } from '../../hooks/useFullProductDetails';
export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    product,
    productLoading,
    productError,
    spec,
    specLoading,
    specError,
  } = useFullProductDetails(id);

  if (productError) {
    navigate('/404', { replace: true });
  }

  while (productLoading) {
    return <div className='flex justify-center mt-[15vh]'>Loading...</div>;
  }

  if (product && spec) {
    console.log('Product details:', product);
    console.log('Specifications:', spec);
  }

  return (
    <div className='max-w-6xl mx-auto px-8 mt-[15vh]'>
      <h1 className='text-2xl font-semibold text-black mb-4 flex justify-center'>
        {product.name}
      </h1>
      <p className='text-center font-bold '>Specifications:</p>
    </div>
  );
}
