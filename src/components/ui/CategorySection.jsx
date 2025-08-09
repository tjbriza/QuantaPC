import ProductGrid from './ProductCatalog/ProductGrid.jsx';

export default function CategorySection({ title, products }) {
  if (products.length === 0) return null;

  return (
    <section className='class="max-w-6xl mx-auto px-8 mt-16'>
      <h2 className='text-2xl font-semibold text-black mb-4 flex justify-center'>
        {title}
      </h2>
      <ProductGrid products={products} />
    </section>
  );
}
