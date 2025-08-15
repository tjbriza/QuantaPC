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
      <h2 
        className='text-2xl font-semibold text-black mb-6 text-center'
        style={title === 'CPU' ? titleStyle : {}}
      >
        {title}
      </h2>
      <ProductGrid products={products} />
    </section>
  );
}
