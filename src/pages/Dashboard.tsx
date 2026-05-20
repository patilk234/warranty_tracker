
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Calendar, Clock, AlertTriangle, ShieldCheck, Edit, Trash2, X, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleDrive } from '../hooks/useGoogleDrive';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useMemo } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { database, isLoading, isAuthenticated, login, deleteWarranty } = useGoogleDrive();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="neo-outset p-16 text-center space-y-8 max-w-md w-full"
        >
          <div className="p-6 neo-inset rounded-3xl w-fit mx-auto">
            <Clock className="w-16 h-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">Sign in required</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Your data is stored securely in your private Google Drive account.
            </p>
          </div>
          <button 
            onClick={login}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-[6px_6px_12px_rgba(79,70,229,0.3)] hover:shadow-[8px_8px_20px_rgba(79,70,229,0.4)] transition-all active:scale-95"
          >
            Sign In with Google
          </button>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 neo-outset flex items-center justify-center animate-pulse">
          <div className="w-12 h-12 neo-inset rounded-full animate-spin border-t-2 border-indigo-600"></div>
        </div>
        <p className="mt-8 font-black text-slate-500 tracking-widest uppercase text-sm">Initializing Drive...</p>
      </div>
    );
  }

  const warranties = database?.warranties || [];
  
  // Refined Logic for Expiration
  const { activeWarranties, expiredWarranties, expiringSoon } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today

    const active: any[] = [];
    const expired: any[] = [];
    const soon: any[] = [];

    warranties.forEach(w => {
      const expiryDate = new Date(w.purchaseDate);
      expiryDate.setMonth(expiryDate.getMonth() + w.durationMonths);
      expiryDate.setHours(23, 59, 59, 999); // End of the expiry day

      const diffTime = expiryDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffTime >= 0) {
        active.push(w);
        if (diffDays <= 30) {
          soon.push(w);
        }
      } else {
        expired.push(w);
      }
    });

    return { activeWarranties: active, expiredWarranties: expired, expiringSoon: soon };
  }, [warranties]);

  const filteredWarranties = warranties.filter(w => 
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chartData = [
    { name: 'Active', value: activeWarranties.length, color: '#4f46e5' },
    { name: 'Expired', value: expiredWarranties.length, color: '#ef4444' },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white leading-none">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 font-bold">Manage your product warranties.</p>
        </div>
        <Link 
          to="/add" 
          className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-[6px_6px_12px_rgba(79,70,229,0.3)] active:scale-95"
        >
          <Plus className="w-6 h-6" />
          Add Warranty
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Warranties", value: warranties.length, icon: <Calendar className="w-6 h-6 text-indigo-600" />, color: "indigo" },
          { label: "Active Items", value: activeWarranties.length, icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />, color: "emerald" },
          { label: "Expiring Soon", value: expiringSoon.length, icon: <AlertTriangle className="w-6 h-6 text-amber-600" />, color: "amber" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="neo-outset p-8 group hover:neo-inset transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <h3 className={`text-5xl font-black tracking-tighter`}>{stat.value}</h3>
              </div>
              <div className="p-4 neo-inset rounded-2xl group-hover:neo-outset transition-all duration-300">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Warranty List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="neo-inset p-2 flex items-center gap-4">
            <div className="p-3">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search warranties..." 
              className="flex-1 bg-transparent border-none outline-none font-bold text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="p-4 neo-button rounded-xl !p-3 mr-1 bg-[#e0e5ec] dark:bg-[#2d3436]">
              <Filter className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="space-y-6">
            {filteredWarranties.length === 0 ? (
              <div className="text-center py-24 neo-inset border-2 border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-slate-500 font-black tracking-tight text-xl">
                  {searchQuery ? 'No matches found for your search.' : 'No warranties found. Start by adding one!'}
                </p>
              </div>
            ) : (
              filteredWarranties.map((w, i) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredId(w.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="neo-outset p-6 flex items-center justify-between hover:neo-inset transition-all duration-200 group relative overflow-hidden"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 neo-inset rounded-2xl flex items-center justify-center">
                      <ShieldCheck className={`w-8 h-8 ${activeWarranties.includes(w) ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-black tracking-tight">{w.title}</h4>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                        {w.category} • Purchased {new Date(w.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 relative min-w-[120px] h-12 justify-end">
                    <AnimatePresence mode="wait">
                      {hoveredId !== w.id ? (
                        <motion.div
                          key="badge"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="neo-inset px-6 py-2 rounded-xl text-sm font-black text-indigo-600 tracking-wide flex items-center gap-2"
                        >
                          {w.durationMonths} MO
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="actions"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-3"
                        >
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit/${w.id}`);
                            }}
                            className="p-3 neo-button rounded-xl bg-[#e0e5ec] dark:bg-[#2d3436] text-indigo-600 hover:scale-110 active:scale-95 transition-all shadow-sm"
                            title="Edit Warranty"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDeleting(w.id);
                            }}
                            className="p-3 neo-button rounded-xl bg-[#e0e5ec] dark:bg-[#2d3436] text-red-500 hover:scale-110 active:scale-95 transition-all shadow-sm"
                            title="Delete Warranty"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Delete Confirmation Overlay */}
                  <AnimatePresence>
                    {isDeleting === w.id && (
                      <motion.div 
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        className="absolute inset-0 z-20 bg-[#e0e5ec]/90 dark:bg-[#2d3436]/90 rounded-2xl flex items-center justify-between px-8"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 neo-inset rounded-xl text-red-500">
                            <AlertTriangle className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Confirm Delete?</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Permanent action</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDeleting(null);
                            }}
                            className="px-5 py-2.5 neo-button rounded-xl text-xs font-black uppercase tracking-widest bg-inherit"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              await deleteWarranty(w.id);
                              setIsDeleting(null);
                            }}
                            className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/30 active:scale-95"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Chart/Side Info */}
        <div className="space-y-12">
          <div className="neo-outset p-10 space-y-8">
            <h4 className="text-2xl font-black tracking-tight text-center leading-none">Status Overview</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '8px 8px 16px rgba(0,0,0,0.1)',
                      fontWeight: 'bold'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {chartData.map((entry, index) => (
                <div key={index} className="neo-inset p-4 flex flex-col items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">{entry.name}</span>
                  <span className="text-lg font-black">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
