import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '../components/common/ProductCard';
import { api, type ProductsResponse } from '../lib/api';

const LIMIT = 8;

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page') || 1);

  const { data, isLoading, isError } = useQuery<ProductsResponse, Error>({
    queryKey: ['products', category, sort, page],
    queryFn: () => {
      const params: Record<string, string | number> = { page, limit: LIMIT };
      if (category) params.category = category;
      if (sort) params.sort = sort;
      return api.getProducts(params);
    },
    staleTime: 1000 * 60 * 2,
  });

  const products = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Categories</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {['', 'T-shirts', 'Shirts', 'Linen', 'Bottoms', 'Footwear', 'Accessories'].map((cat) => (
            <li
              key={cat}
              onClick={() => { setParam('category', cat); setIsFilterOpen(false); }}
              className={`cursor-pointer hover:text-black transition-colors ${category === cat ? 'font-bold text-black' : ''}`}
            >
              {cat || 'All Products'}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Size</h3>
        <div className="flex flex-wrap gap-2">
          {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <button key={size} className="w-10 h-10 border border-gray-200 flex items-center justify-center text-xs font-bold hover:border-black hover:bg-black hover:text-white transition-all">{size}</button>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t lg:hidden">
        <button onClick={() => setIsFilterOpen(false)} className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-sm">
          Apply Filters
        </button>
      </div>
    </div>
  );

  if (isError) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center text-sm uppercase tracking-widest text-gray-400">
        Unable to load products. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container-custom">
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden animate-fade-in" onClick={() => setIsFilterOpen(false)} />
        )}

        <div className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-[70] p-8 shadow-2xl transition-transform duration-500 lg:hidden ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold uppercase tracking-widest">Filters</h2>
            <button onClick={() => setIsFilterOpen(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <FilterContent />
        </div>

        {isLoading && (
          <div className="mb-8 text-sm uppercase tracking-widest text-gray-400">Loading products...</div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterContent />
          </aside>

          <main className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">
                  {category || 'All Products'}
                </h2>
                <p className="text-sm text-gray-500">Showing {products.length} of {total} results</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 font-bold uppercase text-sm border-2 border-black px-6 py-2.5 hover:bg-black hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  Filters
                </button>

                <select
                  value={sort}
                  onChange={e => setParam('sort', e.target.value)}
                  className="text-sm border-2 border-gray-100 rounded-sm px-4 py-2.5 focus:ring-black focus:border-black cursor-pointer font-bold uppercase tracking-wider bg-white"
                >
                  <option value="">Sort by: Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 xl:grid-cols-3 gap-x-3 sm:gap-x-6 gap-y-8 sm:gap-y-12">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  image={product.images[0]}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-3">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setParam('page', String(p))}
                    className={`w-12 h-12 flex items-center justify-center border-2 font-bold transition-all ${page === p ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-black'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
