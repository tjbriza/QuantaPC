import ProductCard from './ProductCard';
export default function ProductGrid({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
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
