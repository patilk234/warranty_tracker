import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';

const PricingPage: React.FC = () => {
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
    <div className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold">Simple, Transparent Pricing</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          The best things in life are free. Warracker is open-source and free forever.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white dark:bg-slate-800 rounded-3xl border-2 border-indigo-600 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6">
            <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> BEST VALUE
            </div>
          </div>

          <div className="p-10 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Free Forever</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">$0</span>
                <span className="text-slate-500">/lifetime</span>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400">
              Complete access to all features without any hidden costs or subscriptions.
            </p>

            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
              Get Started Now
            </button>

            <ul className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-700">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 bg-emerald-100 dark:bg-emerald-900/30 p-0.5 rounded-full">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <div className="mt-20 text-center text-slate-500 text-sm">
        * Warracker is a static client-side application. We do not store any of your data on our servers.
      </div>
    </div>
  );
};

export default PricingPage;
