import ProductGrid from './ProductCatalog/ProductGrid.jsx';

export default function CategorySection({ title, products }) {
  if (products.length === 0) return null;

  // Special styling for CPU title
  const titleStyle = title === 'CPU' ? {
    fontSize: '80px',
    color: '#282E41'
  } : {};

  return (
    
    <section className='mb-16'>
      
      <ProductGrid products={products} />
    </section>
  );
}
