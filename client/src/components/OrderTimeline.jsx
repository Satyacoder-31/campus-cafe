import { Check, Clock, ChefHat, BellRing, PackageCheck } from 'lucide-react';

const STEPS = [
  { key: 'placed', label: 'Order Placed', icon: Check, desc: 'Your order has been received' },
  { key: 'confirmed', label: 'Order Confirmed', icon: BellRing, desc: 'Canteen has accepted your order' },
  { key: 'preparing', label: 'Preparing', icon: ChefHat, desc: 'Chef is preparing your food' },
  { key: 'ready', label: 'Ready for Pickup', icon: PackageCheck, desc: 'Your order is ready at the counter!' },
  { key: 'completed', label: 'Completed', icon: Check, desc: 'Enjoy your meal! 😊' },
];

const STATUS_ORDER = ['placed', 'confirmed', 'preparing', 'ready', 'completed'];

export default function OrderTimeline({ status }) {
  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <div className="space-y-0">
      {STEPS.map((step, idx) => {
        const isCompleted = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        const isPending = idx > currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.key} className={`timeline-step ${isCompleted ? 'completed' : ''}`}>
            {/* Icon circle */}
            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full shrink-0 border-2 transition-all duration-500
              ${isCompleted ? 'bg-success border-success text-white' : ''}
              ${isCurrent ? 'bg-secondary border-secondary text-white scale-110 shadow-glow animate-pulse-slow' : ''}
              ${isPending ? 'bg-white border-cafe-border text-stone-400' : ''}
            `}>
              <Icon className="w-4 h-4" />
            </div>

            {/* Content */}
            <div className="pb-8 min-h-[60px]">
              <p className={`font-semibold text-sm ${isCompleted || isCurrent ? 'text-stone-800' : 'text-stone-400'}`}>{step.label}</p>
              <p className={`text-xs mt-0.5 ${isCurrent ? 'text-secondary font-medium' : 'text-stone-400'}`}>{step.desc}</p>
              {isCurrent && (
                <span className="inline-flex items-center gap-1 text-xs text-secondary font-semibold mt-1.5 bg-secondary/10 px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" /> Current Status
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
