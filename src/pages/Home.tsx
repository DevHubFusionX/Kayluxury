import React from 'react';
import { Hero } from '../components/home/Hero';
import { CategorySection } from '../components/home/CategorySection';
import { ProductSection } from '../components/home/ProductSection';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <CategorySection />
      <ProductSection />
    </>
  );
};

export default Home;
