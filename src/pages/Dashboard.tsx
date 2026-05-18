
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGoogleDrive } from '../hooks/useGoogleDrive';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
  const { database, isLoading, isAuthenticated, login } = useGoogleDrive();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
          <Clock className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold">Sign in to view your dashboard</h2>
        <p className="text-slate-600 dark:text-slate-400">Your data is stored securely in your Google Drive.</p>
        <button 
          onClick={login}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const warranties = database?.warranties || [];
  
  const activeWarranties = warranties.filter(w => {
    const expiryDate = new Date(w.purchaseDate);
    expiryDate.setMonth(expiryDate.getMonth() + w.durationMonths);
    return expiryDate > new Date();
  });

  const expiringSoon = warranties.filter(w => {
    const expiryDate = new Date(w.purchaseDate);
    expiryDate.setMonth(expiryDate.getMonth() + w.durationMonths);
    const diffTime = expiryDate.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  });

  const chartData = [
    { name: 'Active', value: activeWarranties.length, color: '#4f46e5' },
    { name: 'Expired', value: warranties.length - activeWarranties.length, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage and track your product warranties.</p>
        </div>
        <Link 
          to="/add" 
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Warranty
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Warranties</p>
              <h3 className="text-3xl font-bold mt-1">{warranties.length}</h3>
            </div>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Active</p>
              <h3 className="text-3xl font-bold mt-1 text-emerald-600">{activeWarranties.length}</h3>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Expiring Soon</p>
              <h3 className="text-3xl font-bold mt-1 text-amber-600">{expiringSoon.length}</h3>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Warranty List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <Search className="w-5 h-5 text-slate-400 ml-2" />
            <input 
              type="text" 
              placeholder="Search warranties..." 
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Filter className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div className="space-y-4">
            {warranties.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-500">No warranties found. Start by adding one!</p>
              </div>
            ) : (
              warranties.map((w, i) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold">{w.title}</h4>
                      <p className="text-xs text-slate-500">{w.category} • Purchased {new Date(w.purchaseDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {w.durationMonths} Months
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Chart/Side Info */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold mb-4">Status Overview</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {chartData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-xs text-slate-500">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple icon wrapper because I forgot ShieldCheck was imported in LandingPage but not here initially
const ShieldCheck = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>;

export default Dashboard;
