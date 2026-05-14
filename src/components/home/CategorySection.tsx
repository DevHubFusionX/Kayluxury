import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Linen', image: 'https://images.unsplash.com/photo-1594932224828-b4b05a832974?q=80&w=500&auto=format&fit=crop' },
  { name: 'T-shirts', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=500&auto=format&fit=crop' },
  { name: 'Bottoms', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=500&auto=format&fit=crop' },
  { name: 'Footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500&auto=format&fit=crop' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=500&auto=format&fit=crop' },
  { name: 'Shirts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=500&auto=format&fit=crop' },
];

export const CategorySection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-12 uppercase tracking-widest">Shop by Category</h2>
        <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} to="/products" className="group cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-sm">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <p className="text-center font-bold uppercase text-xs tracking-widest">{cat.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
