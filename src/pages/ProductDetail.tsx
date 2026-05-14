import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useCart } from '../context/CartContext';

// Mock data for a single product
const product = {
  id: 1,
  name: 'Kayluxury 911 T-shirt in white',
  price: '40,000.00',
  description: 'Premium heavyweight cotton t-shirt featuring the iconic 911 graphic. Handcrafted for maximum comfort and style. Part of our exclusive limited edition collection.',
  images: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=800&auto=format&fit=crop',
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  colors: [
    { name: 'White', hex: '#ffffff' },
    { name: 'Black', hex: '#000000' },
    { name: 'Sand', hex: '#d2b48c' },
  ],
  details: [
    '100% Premium Cotton',
    'Heavyweight 240 GSM',
    'Oversized Fit',
    'Made in Nigeria',
  ]
};

const ProductDetail: React.FC = () => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('White');
  const [activeImage, setActiveImage] = useState(0);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    }, selectedSize, selectedColor);
  };

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-gray-400">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-black">Shop</Link>
          <span>/</span>
          <span className="text-black">Product Details</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square overflow-hidden bg-gray-50 rounded-sm border-2 transition-all ${activeImage === idx ? 'border-black' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl lg:text-4xl font-bold uppercase tracking-tighter mb-4">{product.name}</h1>
            <p className="text-2xl font-bold mb-8">₦{product.price}</p>
            
            <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
              <p>{product.description}</p>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Color: <span className="text-gray-400 font-medium">{selectedColor}</span></h3>
              <div className="flex gap-4">
                {product.colors.map(color => (
                  <button 
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color.name ? 'border-black ring-4 ring-black/10' : 'border-gray-200 hover:border-black'}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest">Select Size</h3>
                <button className="text-xs font-bold uppercase tracking-widest border-b border-black">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 border-2 flex items-center justify-center text-sm font-bold transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-black'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                onClick={handleAddToCart}
                className="flex-grow py-5 text-sm uppercase tracking-widest font-bold"
              >
                Add to Cart
              </Button>
              <button className="p-5 border-2 border-gray-100 hover:border-black transition-all rounded-sm group">
                <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>

            {/* Details Accordion (Simple list for now) */}
            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Product Details</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 bg-black rounded-full" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
