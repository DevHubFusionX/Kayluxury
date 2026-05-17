import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '../common/ProductCard';
import { api, type ProductsResponse } from '../../lib/api';

export const ProductSection: React.FC = () => {
  const { data, isLoading } = useQuery<ProductsResponse, Error>({
    queryKey: ['featured-products'],
    queryFn: () => api.getProducts({ limit: 4 }),
    staleTime: 1000 * 60 * 2,
  });

  const products = data?.data ?? [];

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <Link to="/products" className="flex items-center gap-2 font-bold uppercase text-sm border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
              Filter
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-sm uppercase tracking-widest text-gray-400">Loading products...</div>
        ) : (
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-8 sm:gap-y-12">
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
        )}

        <div className="mt-16 text-center">
          <Link to="/products" className="inline-block text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all">
            Show more
          </Link>
        </div>
      </div>
    </section>
  );
};
