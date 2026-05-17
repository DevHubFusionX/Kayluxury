import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartState } from '../../context/CartContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/about', label: 'About' },
];

export const Navbar: React.FC = () => {
  const { cart, setIsCartOpen } = useCartState();
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white py-4 shadow-sm">
        <div className="container-custom flex items-center justify-between">
          {/* Left: Hamburger (Mobile) & Nav Links (Desktop) */}
          <div className="flex items-center gap-8">
            <button className="lg:hidden p-2" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} className="hover:text-gray-500 transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/">
              <h1 className="text-xl lg:text-2xl font-bold tracking-widest uppercase">KAYLUXURY</h1>
            </Link>
          </div>

          {/* Right: Search & Cart */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:scale-110 transition-transform" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:scale-110 transition-transform relative"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />

          {/* Drawer */}
          <div className="absolute top-0 left-0 h-full w-72 bg-white flex flex-col animate-slide-in-right" style={{ animationName: 'slideInLeft' }}>
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <span className="text-lg font-bold tracking-widest uppercase">KAYLUXURY</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-4 py-6">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-bold uppercase tracking-widest px-3 py-3 hover:bg-gray-100 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
