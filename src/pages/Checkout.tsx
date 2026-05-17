import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useCartActions, useCartState } from '../context/CartContext';
import { Navigate } from 'react-router-dom';
import { api } from '../lib/api';

const WA_LINK = 'https://wa.me/2349067440108';

const WHATSAPP_ICON = (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .012 5.403.01 12.039a11.811 11.811 0 001.532 5.795L0 24l6.39-1.676a11.82 11.82 0 005.656 1.443h.005c6.637 0 12.038-5.403 12.04-12.04a11.817 11.817 0 00-3.417-8.523z" />
  </svg>
);

const Checkout: React.FC = () => {
  const { cart, cartTotal } = useCartState();
  const { clearCart } = useCartActions();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const orderMutation = useMutation({
    mutationFn: api.createOrder,
    onSuccess: () => {
      clearCart();
      setSubmitError(null);
    },
    onError: () => {
      setSubmitError('Unable to place order. Please try again.');
    },
  });
  const submitting = orderMutation.isPending;

  if (cart.length === 0) return <Navigate to="/products" />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      items: cart.map(i => ({
        id: i.id,
        name: i.name,
        size: i.size,
        quantity: i.quantity,
        price: i.price,
      })),
      total: cartTotal,
    };

    const items = cart
      .map(i => `• ${i.name} (Size: ${i.size}) x${i.quantity} — ₦${i.price.toLocaleString()}`)
      .join('\n');
    const message =
      `Hello Kayluxury! I'd like to place an order 🛍️\n\n` +
      `*Name:* ${form.name}\n` +
      `*Email:* ${form.email}\n` +
      `*Phone:* ${form.phone}\n` +
      `*Address:* ${form.address}\n\n` +
      `*Order:*\n${items}\n\n` +
      `*Total:* ₦${cartTotal.toLocaleString()}`;

    setSubmitError(null);

    try {
      await orderMutation.mutateAsync(payload);
      window.open(`${WA_LINK}&text=${encodeURIComponent(message)}`, '_blank');
    } catch (err) {
      console.error('Order save failed:', err);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                {WHATSAPP_ICON}
                <h2 className="text-xl font-bold uppercase tracking-widest">Order via WhatsApp</h2>
              </div>
              <p className="text-sm text-gray-500 mb-8">Fill in your details and we'll open WhatsApp with your order ready to send.</p>
              {submitError && (
                <div className="mb-4 text-sm text-red-600 font-bold uppercase tracking-widest">{submitError}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  name="name" value={form.name} onChange={handleChange}
                  type="text" placeholder="Full Name" required
                  className="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:border-black transition-colors"
                />
                <input
                  name="email" value={form.email} onChange={handleChange}
                  type="email" placeholder="Email Address" required
                  className="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:border-black transition-colors"
                />
                <input
                  name="phone" value={form.phone} onChange={handleChange}
                  type="tel" placeholder="Phone Number" required
                  className="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:border-black transition-colors"
                />
                <textarea
                  name="address" value={form.address} onChange={handleChange}
                  placeholder="Delivery Address" required rows={3}
                  className="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-colors"
                >
                  {WHATSAPP_ICON}
                  {submitting ? 'Saving...' : 'Send Order on WhatsApp'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 shadow-sm sticky top-32">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Order Summary</h2>
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                    <div className="w-16 h-20 bg-gray-50 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xs font-bold uppercase tracking-tight">{item.name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Size: {item.size} × {item.quantity}</p>
                      <p className="text-sm font-bold mt-1">₦{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-6 border-t">
                <div className="flex justify-between text-sm text-gray-500 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="font-bold text-black italic">Via WhatsApp</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-100 uppercase tracking-widest">
                  <span>Total</span>
                  <span>₦{cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
