import ProductCard from './ProductCard';
export default function ProductGrid({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center ml-8' style={{ gap: '1rem' }}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          img={product.image_url || 'https://placehold.co/150'}
          name={product.name}
          price={product.price}
          alt={product.name || 'Product Image'}
          rating={product.rating || 0}
        />
      ))}
    </div>
  );
}
