import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, HardDrive, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold border border-indigo-100 dark:border-indigo-800">
              Modern Warranty Management
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Never Lose a <span className="text-indigo-600">Warranty</span> Again.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Store your receipts, track expiration dates, and manage all your product warranties in one secure place. Powered by your own Google Drive.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2">
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </button>
            <Link to="/pricing" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold text-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95">
              View Pricing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <HardDrive className="w-8 h-8 text-indigo-500" />,
            title: "Private Storage",
            description: "All your data stays in your personal Google Drive. We never see or store your sensitive information."
          },
          {
            icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
            title: "Safe & Secure",
            description: "Encrypted by Google's infrastructure. Authentication is handled entirely by Google Identity Services."
          },
          {
            icon: <Zap className="w-8 h-8 text-amber-500" />,
            title: "Smooth Experience",
            description: "Clean, modern UI with drag-and-drop file uploads and beautiful animations."
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="p-8 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 transition-colors group"
          >
            <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 w-fit group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
