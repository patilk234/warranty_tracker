
import { Link } from 'react-router-dom';
import { Shield, LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import { useGoogleDrive } from '../hooks/useGoogleDrive';

const Navbar = () => {
  const { isAuthenticated, login, logout } = useGoogleDrive();

  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                warranty-tracker
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
            <Link to="/pricing" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Dashboard</Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <button 
                onClick={login}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-indigo-600/20 active:scale-95 font-medium"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
