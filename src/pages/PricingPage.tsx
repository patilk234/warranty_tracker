
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { useGoogleDrive } from '../hooks/useGoogleDrive';

const PricingPage = () => {
  const { login } = useGoogleDrive();
  const features = [
    "Unlimited Warranty Entries",
    "Google Drive Cloud Storage",
    "Receipt & Document Management",
    "Zero Tracking or Ads",
    "Self-Hosted Data (Your Drive)",
    "Secure Google Authentication",
    "Mobile Responsive Design",
    "Export Data Anytime (JSON)"
  ];

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6 mb-20">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          The best things in life are free. warranty-tracker is open-source and free forever.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="neo-outset p-12 relative overflow-hidden border-2 border-indigo-600/20"
        >
          <div className="absolute top-0 right-0 p-8">
            <div className="bg-indigo-600 text-white text-sm font-black px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-indigo-600/30">
              <Star className="w-4 h-4 fill-current" /> BEST VALUE
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-3">
              <h3 className="text-3xl font-black tracking-tight">Free Forever</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-violet-600">$0</span>
                <span className="text-slate-500 font-bold text-xl">/lifetime</span>
              </div>
            </div>

            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
              Complete access to all features without any hidden costs or subscriptions.
            </p>

            <button 
              onClick={login}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl transition-all shadow-[6px_6px_12px_rgba(79,70,229,0.3)] hover:shadow-[8px_8px_20px_rgba(79,70,229,0.4)] active:scale-95"
            >
              Get Started Now
            </button>

            <ul className="space-y-5 pt-10 border-t border-slate-200 dark:border-slate-700">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="p-1.5 neo-inset rounded-lg">
                    <Check className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-bold">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <div className="mt-24 text-center">
        <p className="text-slate-500 font-medium text-sm">
          * warranty-tracker is a static client-side application. We do not store any of your data on our servers.
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
