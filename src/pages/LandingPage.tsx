
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, HardDrive, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGoogleDrive } from '../hooks/useGoogleDrive';

const LandingPage = () => {
  const { login } = useGoogleDrive();

  return (
    <div className="space-y-32 pb-24 pt-12">
      {/* Hero Section */}
      <section className="relative px-4">
        <div className="max-w-5xl mx-auto neo-outset p-12 md:p-20 text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-6 py-2 rounded-full neo-inset text-indigo-600 dark:text-indigo-400 text-sm font-bold tracking-wide uppercase">
              Modern Warranty Management
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tighter text-slate-800 dark:text-white leading-none"
          >
            Never Lose a <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-violet-600">Warranty</span> Again.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Store receipts, track expirations, and manage everything in one secure place. Powered by your private Google Drive.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-4"
          >
            <button 
              onClick={login}
              className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl transition-all shadow-[6px_6px_12px_rgba(79,70,229,0.3)] hover:shadow-[8px_8px_20px_rgba(79,70,229,0.4)] active:scale-95 flex items-center justify-center gap-3"
            >
              Get Started Free <ArrowRight className="w-6 h-6" />
            </button>
            <Link 
              to="/pricing" 
              className="w-full sm:w-auto px-10 py-5 neo-button text-slate-800 dark:text-white rounded-2xl font-black text-xl"
            >
              View Pricing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-12 px-4 max-w-7xl mx-auto">
        {[
          {
            icon: <HardDrive className="w-10 h-10 text-indigo-500" />,
            title: "Private Storage",
            description: "All your data stays in your personal Google Drive. We never see or store your sensitive information."
          },
          {
            icon: <ShieldCheck className="w-10 h-10 text-emerald-500" />,
            title: "Safe & Secure",
            description: "Encrypted by Google's infrastructure. Authentication is handled entirely by Google Identity Services."
          },
          {
            icon: <Zap className="w-10 h-10 text-amber-500" />,
            title: "Smooth Experience",
            description: "Clean, modern UI with drag-and-drop file uploads and beautiful soft-touch animations."
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="neo-outset p-10 flex flex-col items-center text-center group hover:neo-inset transition-all duration-300"
          >
            <div className="mb-6 p-5 neo-inset rounded-2xl group-hover:neo-outset transition-all duration-300">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
