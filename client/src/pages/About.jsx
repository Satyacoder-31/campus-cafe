import { MapPin, Clock, Phone, Mail, Coffee, Award, Users, Leaf } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-cafe-bg">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 mb-16">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #D97706 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">About Campus Café</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">More than just a canteen — we're the heart of campus life, serving over 500 students daily with fresh, affordable, and delicious meals.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 space-y-16">
        {/* Our Story */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">Our Story</p>
            <h2 className="section-title mb-4">Fueling Campus Life Since 2015</h2>
            <p className="text-stone-600 leading-relaxed mb-4">Campus Café started as a small tiffin stall in the main building. Over the years, it grew into a fully-fledged canteen loved by students, faculty, and staff alike.</p>
            <p className="text-stone-600 leading-relaxed">We believe that great food shouldn't break the bank. Every dish on our menu is crafted with fresh ingredients, prepared with care, and priced for a student's budget.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['500+', 'Daily Students', Users], ['30+', 'Menu Items', Coffee], ['4.8★', 'Average Rating', Award], ['100%', 'Fresh Ingredients', Leaf]].map(([num, label, Icon]) => (
              <div key={label} className="card p-5 text-center">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-secondary" />
                </div>
                <p className="font-display font-bold text-2xl text-primary">{num}</p>
                <p className="text-xs text-stone-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Hours */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-8">
            <h3 className="font-bold text-stone-800 text-lg mb-5 flex items-center gap-2"><Clock className="w-5 h-5 text-secondary" /> Opening Hours</h3>
            {[['Monday – Friday', '7:00 AM – 8:00 PM', true], ['Saturday', '8:00 AM – 4:00 PM', true], ['Sunday', 'Closed', false]].map(([day, time, open]) => (
              <div key={day} className="flex justify-between py-3 border-b border-cafe-border last:border-0">
                <span className="text-stone-700 font-medium">{day}</span>
                <span className={`font-semibold text-sm ${open ? 'text-primary' : 'text-stone-400'}`}>{time}</span>
              </div>
            ))}
          </div>
          <div className="card p-8">
            <h3 className="font-bold text-stone-800 text-lg mb-5 flex items-center gap-2"><MapPin className="w-5 h-5 text-secondary" /> Find Us</h3>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3"><MapPin className="w-4 h-4 text-secondary mt-0.5 shrink-0" /><p className="text-stone-600">Ground Floor, Main Building,<br />Campus Road, College City – 560001</p></div>
              <div className="flex gap-3"><Phone className="w-4 h-4 text-secondary shrink-0" /><p className="text-stone-600">+91 98765 43210</p></div>
              <div className="flex gap-3"><Mail className="w-4 h-4 text-secondary shrink-0" /><p className="text-stone-600">hello@campuscafe.edu</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
