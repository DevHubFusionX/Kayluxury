import React, { useState } from 'react';
import { ProductCard } from '../components/common/ProductCard';

const allProducts = [
  { id: 1, name: 'Kayluxury 911 T-shirt in white', price: '40,000.00', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=500&auto=format&fit=crop' },
  { id: 2, name: 'Kayluxury People + Faces T-shirt', price: '40,000.00', image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=500&auto=format&fit=crop' },
  { id: 3, name: 'Kayluxury Vintage Wash Tee', price: '35,000.00', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=500&auto=format&fit=crop' },
  { id: 4, name: 'Kayluxury Graphic Print Shirt', price: '45,000.00', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=500&auto=format&fit=crop' },
  { id: 5, name: 'Kayluxury Premium Linen Shirt', price: '55,000.00', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=500&auto=format&fit=crop' },
  { id: 6, name: 'Kayluxury Essential Bottoms', price: '48,000.00', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=500&auto=format&fit=crop' },
  { id: 7, name: 'Kayluxury Minimalist Trainers', price: '75,000.00', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500&auto=format&fit=crop' },
  { id: 8, name: 'Kayluxury Designer Headwear', price: '25,000.00', image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=500&auto=format&fit=crop' },
];

const Products: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Categories</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {['All Products (307)', 'T-shirts (124)', 'Shirts (86)', 'Bottoms (54)', 'Footwear (43)'].map((item) => (
            <li key={item} className="flex items-center justify-between cursor-pointer hover:text-black transition-colors">
              <span>{item.split(' (')[0]}</span>
              <span className="text-gray-400">({item.split(' (')[1]}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Price Range</h3>
        <div className="space-y-4">
          <input type="range" className="w-full accent-black" min="0" max="100000" />
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>₦0</span>
            <span>₦100,000+</span>
          </div>
        </div>
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
        <button 
          onClick={() => setIsFilterOpen(false)}
          className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-sm"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container-custom">
        {/* Mobile Filter Drawer Backdrop */}
        {isFilterOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden animate-fade-in"
            onClick={() => setIsFilterOpen(false)}
          />
        )}

        {/* Mobile Filter Drawer */}
        <div className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-[70] p-8 shadow-2xl transition-transform duration-500 lg:hidden ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold uppercase tracking-widest">Filters</h2>
            <button onClick={() => setIsFilterOpen(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <FilterContent />
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterContent />
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">All Products</h2>
                <p className="text-sm text-gray-500">Showing 8 of 307 results</p>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 font-bold uppercase text-sm border-2 border-black px-6 py-2.5 hover:bg-black hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  Filters
                </button>
                
                <select className="text-sm border-2 border-gray-100 rounded-sm px-4 py-2.5 focus:ring-black focus:border-black cursor-pointer font-bold uppercase tracking-wider bg-white">
                  <option>Sort by: Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Popularity</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 xl:grid-cols-3 gap-x-3 sm:gap-x-6 gap-y-8 sm:gap-y-12">
              {allProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-20 flex justify-center items-center gap-3">
              <button className="w-12 h-12 flex items-center justify-center border-2 border-black bg-black text-white font-bold transition-all">1</button>
              <button className="w-12 h-12 flex items-center justify-center border-2 border-gray-100 font-bold hover:border-black transition-all">2</button>
              <button className="w-12 h-12 flex items-center justify-center border-2 border-gray-100 font-bold hover:border-black transition-all">3</button>
              <span className="text-gray-400 px-2 font-bold">...</span>
              <button className="w-12 h-12 flex items-center justify-center border-2 border-gray-100 font-bold hover:border-black transition-all">10</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
