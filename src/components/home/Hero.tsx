import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';

export const Hero: React.FC = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-brand-gray">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-black/10 z-10" />
      <img 
        src="/assets/hero.png" // Placeholder, we will use the generated image
        alt="Vintage Collection" 
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Content */}
      <div className="container-custom relative z-20 h-full flex flex-col justify-center items-start pt-20">
        <div className="max-w-2xl animate-fade-in-up">
          <h2 className="text-orange-400 text-5xl lg:text-7xl font-bold italic mb-2 tracking-tighter uppercase leading-none">
            VINTAGE
          </h2>
          <h3 className="text-white text-4xl lg:text-6xl font-serif mb-8 italic">
            Shirts
          </h3>
          <p className="text-white/90 text-lg lg:text-xl mb-8 max-w-md font-light">
            Perfectly Handpicked for you. Discover our unique collection of premium vintage apparel.
          </p>
          <Link to="/products">
            <Button variant="secondary" className="px-12 py-4 text-lg">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-10 right-10 z-20 flex gap-4">
        <button className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </section>
  );
};
