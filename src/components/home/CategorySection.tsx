import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, type Category } from '../../lib/api';

export const CategorySection: React.FC = () => {
  const { data: categories = [], isLoading } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center text-sm uppercase tracking-widest text-gray-400">Loading categories...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-12 uppercase tracking-widest">Shop by Category</h2>
        <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} to={`/products?category=${cat.name}`} className="group cursor-pointer">
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
