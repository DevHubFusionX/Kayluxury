import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-widest">Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-8">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <p className="text-gray-500 uppercase tracking-widest text-sm">Your cart is empty</p>
              <Link 
                to="/products" 
                onClick={() => setIsCartOpen(false)}
                className="bg-black text-white px-12 py-4 font-bold uppercase tracking-widest text-sm"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4">
                <div className="w-24 h-32 bg-gray-50 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-tight mb-1">{item.name}</h3>
                    <div className="flex gap-4">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Size: {item.size}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Color: {item.color}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-100 rounded-sm">
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-50"
                      >-</button>
                      <span className="px-3 py-1 text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-50"
                      >+</button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-xs font-bold uppercase tracking-widest border-b border-black"
                    >Remove</button>
                  </div>
                </div>
                <div className="text-sm font-bold">
                  ₦{item.price}
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t space-y-6 bg-gray-50">
            <div className="flex items-center justify-between text-lg font-bold">
              <span className="uppercase tracking-widest">Subtotal</span>
              <span>₦{cartTotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 text-center uppercase tracking-widest">Shipping & taxes calculated at checkout</p>
            <Link 
              to="/checkout" 
              onClick={() => setIsCartOpen(false)}
              className="block w-full bg-black text-white py-5 text-center font-bold uppercase tracking-widest text-sm hover:bg-gray-900 transition-colors"
            >
              Check Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
