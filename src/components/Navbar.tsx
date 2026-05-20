import { Link } from 'react-router-dom';
import { Shield, LayoutDashboard, LogIn, LogOut, Globe, Sun, Moon } from 'lucide-react';
import { useGoogleDrive } from '../hooks/useGoogleDrive';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { isAuthenticated, login, logout } = useGoogleDrive();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 px-4 py-4 bg-[#e0e5ec]/80 dark:bg-[#2d3436]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto neo-outset px-6 py-3 flex justify-between items-center bg-[#e0e5ec] dark:bg-[#2d3436]">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 neo-inset rounded-lg group-hover:neo-outset transition-all">
              <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              warranty-tracker
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
            <Link to="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</Link>
            <a 
              href="https://github.com/patilk234/warranty_tracker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Globe className="w-4 h-4" />
              Source
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2.5 neo-button rounded-xl !p-2 bg-[#e0e5ec] dark:bg-[#2d3436]"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5 text-slate-600" /> : <Sun className="w-5 h-5 text-amber-400" />}
          </button>

          {!isAuthenticated ? (
            <button 
              onClick={login}
              className="neo-button bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 flex items-center gap-2 text-sm"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="neo-button flex items-center gap-2 text-sm bg-[#e0e5ec] dark:bg-[#2d3436]">
                <LayoutDashboard className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                Dashboard
              </Link>
              <button 
                onClick={logout}
                className="p-2.5 neo-button rounded-xl !p-2 bg-[#e0e5ec] dark:bg-[#2d3436]"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5 text-red-500" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
