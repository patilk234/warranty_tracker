import { Link, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8">
        <Outlet />
      </main>
      <footer className="py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">© 2026 warranty-tracker. All rights reserved.</p>
          <div className="flex gap-8 text-sm font-black uppercase tracking-widest text-slate-500">
            <Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
            <Link to="/data-usage" className="hover:text-indigo-600 transition-colors">Data</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
