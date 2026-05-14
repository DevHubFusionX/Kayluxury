import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/kayluxurystores___?igsh=ajNhbHRsYXgzd3F1&utm_source=qr',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/2349067440108',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .012 5.403.01 12.039a11.811 11.811 0 001.532 5.795L0 24l6.39-1.676a11.82 11.82 0 005.656 1.443h.005c6.637 0 12.038-5.403 12.04-12.04a11.817 11.817 0 00-3.417-8.523z"/></svg>
    ),
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-0 overflow-hidden">
      {/* Big animated wordmark — full bleed */}
      <BigWordmark />

      <div className="container-custom pb-10">
        {/* Brand + Links */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mt-6">
          <div className="space-y-4 max-w-xs">
            <p className="text-gray-400 font-light leading-relaxed text-sm">
              Redefining luxury streetwear through curation and craftsmanship.
            </p>
            <div className="flex gap-4">
              {socials.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="hover:text-gray-400 transition-colors">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links row */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:gap-x-16">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-white">Shop</h3>
              <ul className="space-y-2.5 text-gray-400 text-sm">
                <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">T-shirts</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Vintage</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-white">Support</h3>
              <ul className="space-y-2.5 text-gray-400 text-sm">
                <li><a href="https://wa.me/2349067440108" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

function BigWordmark() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const letters = 'KAYLUXURY'.split('');

  return (
    <div ref={ref} className="overflow-hidden w-full">
      <div className="flex w-full">
        {letters.map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: '100%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.055 }}
            className="font-display font-black uppercase leading-none text-white select-none flex-1 text-center"
            style={{ fontSize: 'clamp(1.8rem, 9.5vw, 9rem)', display: 'inline-block' }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
