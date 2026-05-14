import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

interface ProductProps {
  id: number;
  name: string;
  price: string;
  image: string;
  category?: string;
}

export const ProductCard: React.FC<ProductProps> = ({ id, name, price, image }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative">
      <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-4 relative rounded-sm">
        <Link to={`/product/${id}`}>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        {/* Quick Add Button */}
        <button 
          onClick={() => addToCart({ id, name, price, image }, 'M', 'White')}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-black hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>
      <div className="space-y-1">
        <Link to={`/product/${id}`}>
          <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900 group-hover:underline transition-all cursor-pointer">{name}</h3>
        </Link>
        <p className="text-lg font-bold">₦{price}</p>
      </div>
    </div>
  );
};
