import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../common/ProductCard';

const products = [
  { id: 1, name: 'Kayluxury 911 T-shirt in white', price: '40,000.00', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=500&auto=format&fit=crop' },
  { id: 2, name: 'Kayluxury People + Faces T-shirt', price: '40,000.00', image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=500&auto=format&fit=crop' },
  { id: 3, name: 'Kayluxury Vintage Wash Tee', price: '35,000.00', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=500&auto=format&fit=crop' },
  { id: 4, name: 'Kayluxury Graphic Print Shirt', price: '45,000.00', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=500&auto=format&fit=crop' },
];

export const ProductSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container-custom">
        {/* Filters Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm">307 products</span>
            <Link to="/products" className="flex items-center gap-2 font-bold uppercase text-sm border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
              Filter
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-sm">
              <button className="p-1.5 hover:bg-white rounded-sm transition-all"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" /></svg></button>
              <button className="p-1.5 bg-white shadow-sm rounded-sm"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" /></svg></button>
              <button className="p-1.5 hover:bg-white rounded-sm transition-all"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 4h18v4H3V4zm0 6h18v4H3v-4zm0 6h18v4H3v-4z" /></svg></button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-8 sm:gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        
        {/* Load More */}
        <div className="mt-16 text-center">
          <Link to="/products" className="inline-block text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all">
            Show more
          </Link>
        </div>
      </div>
    </section>
  );
};
