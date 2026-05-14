import React from 'react';

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-24">
          <h1 className="text-4xl lg:text-6xl font-bold uppercase tracking-tighter mb-8 animate-fade-in-up">
            Redefining Modern Luxury
          </h1>
          <p className="text-lg lg:text-xl text-gray-500 font-light leading-relaxed animate-fade-in-up">
            Founded in Lagos, Kayluxury is more than just a fashion brand. We are a curation of culture, 
            craftsmanship, and the relentless pursuit of timeless style.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-sm">
            <img 
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop" 
              alt="Our Story" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">Our Story</h2>
            <h3 className="text-3xl font-bold uppercase tracking-tight">Crafting the Future of Streetwear</h3>
            <p className="text-gray-600 leading-relaxed">
              Kayluxury started with a simple vision: to create pieces that bridge the gap between high-end luxury and urban streetwear. 
              Every garment we produce is a testament to our commitment to quality, featuring premium fabrics and meticulous attention to detail.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe that luxury shouldn't be exclusive—it should be an experience accessible to those who appreciate the finer details of design.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gray-50 py-20 px-8 lg:px-20 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <h4 className="text-lg font-bold uppercase tracking-widest">Quality</h4>
              <p className="text-sm text-gray-500 font-light">We source the finest materials globally to ensure every piece lasts a lifetime.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold uppercase tracking-widest">Curation</h4>
              <p className="text-sm text-gray-500 font-light">Every collection is hand-picked and thoughtfully designed for the modern individual.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold uppercase tracking-widest">Community</h4>
              <p className="text-sm text-gray-500 font-light">We are built by our community. Your style is our constant inspiration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
