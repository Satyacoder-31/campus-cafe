import { Link } from 'react-router-dom';
import { Coffee, MapPin, Phone, Mail, Clock, Globe, MessageCircle, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-stone-300 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-white block leading-none">Campus</span>
                <span className="font-display font-bold text-xl text-secondary block leading-none">Café</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-stone-400">
              Fresh, affordable meals crafted for your college day. Fuel your campus life with great food and warm vibes.
            </p>
            <p className="mt-4 text-xs text-stone-500 italic font-display">
              "Fuel Your Campus Life."
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[['/', 'Home'], ['/menu', 'Menu'], ['/my-orders', 'My Orders'], ['/profile', 'My Profile'], ['/login', 'Login / Register']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-secondary transition-colors flex items-center gap-1.5">→ {label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              {['Breakfast', 'South Indian', 'North Indian', 'Fast Food', 'Chinese', 'Beverages', 'Desserts'].map((cat) => (
                <li key={cat}><Link to={`/menu?category=${cat}`} className="hover:text-secondary transition-colors flex items-center gap-1.5">→ {cat}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5"><MapPin className="w-4 h-4 text-secondary mt-0.5 shrink-0" /><span>Ground Floor, Main Building, Campus Road, College City – 560001</span></li>
              <li className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-secondary shrink-0" /><span>+91 98765 43210</span></li>
              <li className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-secondary shrink-0" /><span>hello@campuscafe.edu</span></li>
              <li className="flex items-start gap-2.5"><Clock className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                <div>
                  <p>Mon – Fri: 7:00 AM – 8:00 PM</p>
                  <p>Sat: 8:00 AM – 4:00 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
            {[Globe, MessageCircle, Send].map((Icon, i) => (
                <button key={i} className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Campus Café. All rights reserved.</p>
          <p>Made with ☕ for students</p>
        </div>
      </div>
    </footer>
  );
}
