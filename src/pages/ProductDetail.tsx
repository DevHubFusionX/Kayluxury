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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (idx: number) => { setLightboxIndex(idx); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImage = () => setLightboxIndex(i => (i - 1 + product.images.length) % product.images.length);
  const nextImage = () => setLightboxIndex(i => (i + 1) % product.images.length);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    }, selectedSize, selectedColor);
  };

  return (
    <div className="pt-24 sm:pt-32 pb-16 bg-white min-h-screen">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <nav className="mb-5 text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-gray-400">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-black">Shop</Link>
          <span>/</span>
          <span className="text-black truncate max-w-[140px] sm:max-w-none">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-2 sm:space-y-4">
            <div className="relative aspect-square sm:aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm group/img cursor-zoom-in" onClick={() => openLightbox(activeImage)}>
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
              />
              {/* View Large button */}
              <button
                className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 flex items-center gap-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity shadow-sm"
                onClick={e => { e.stopPropagation(); openLightbox(activeImage); }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                View Large
              </button>
              {/* Image counter */}
              <span className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] font-bold px-2 py-1 tracking-widest">
                {activeImage + 1} / {product.images.length}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square overflow-hidden bg-gray-50 rounded-sm border-2 transition-all ${activeImage === idx ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tighter mb-2 sm:mb-4 leading-tight">{product.name}</h1>
            <p className="text-xl sm:text-2xl font-bold mb-5 sm:mb-8">₦{product.price}</p>

            <p className="text-sm text-gray-500 leading-relaxed mb-5 sm:mb-8">{product.description}</p>

            {/* Color Selection */}
            <div className="mb-5 sm:mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Color: <span className="text-gray-400 font-medium">{selectedColor}</span></h3>
              <div className="flex gap-3">
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all ${selectedColor === color.name ? 'border-black ring-4 ring-black/10' : 'border-gray-200 hover:border-black'}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-5 sm:mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest">Select Size</h3>
                <button className="text-[10px] font-bold uppercase tracking-widest border-b border-black">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-11 h-11 sm:w-14 sm:h-14 border-2 flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-black'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8 sm:mb-12">
              <Button
                onClick={handleAddToCart}
                className="flex-grow py-4 sm:py-5 text-xs sm:text-sm uppercase tracking-widest font-bold"
              >
                Add to Cart
              </Button>
              <button className="px-4 sm:p-5 border-2 border-gray-100 hover:border-black transition-all rounded-sm group">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Product Details</h3>
              <ul className="grid grid-cols-2 gap-2 sm:gap-4">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          {/* Close */}
          <button className="absolute top-5 right-5 text-white p-2 hover:text-gray-300 transition-colors" onClick={closeLightbox}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Prev */}
          {product.images.length > 1 && (
            <button className="absolute left-4 text-white p-3 hover:text-gray-300 transition-colors" onClick={e => { e.stopPropagation(); prevImage(); }}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}

          {/* Image */}
          <img
            src={product.images[lightboxIndex]}
            alt={product.name}
            className="max-h-[90vh] max-w-[90vw] object-contain select-none"
            onClick={e => e.stopPropagation()}
          />

          {/* Next */}
          {product.images.length > 1 && (
            <button className="absolute right-4 text-white p-3 hover:text-gray-300 transition-colors" onClick={e => { e.stopPropagation(); nextImage(); }}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          )}

          {/* Dots */}
          <div className="absolute bottom-6 flex gap-2">
            {product.images.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setLightboxIndex(i); }} className={`w-2 h-2 rounded-full transition-all ${i === lightboxIndex ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
