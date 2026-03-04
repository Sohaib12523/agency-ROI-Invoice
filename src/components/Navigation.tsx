import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calculator, FileText } from 'lucide-react';
import { clsx } from 'clsx';

export default function Navigation() {
  const location = useLocation();

  const links = [
    { name: 'ROI Calculator', path: '/', icon: Calculator },
    { name: 'SmartInvoice AI', path: '/invoice', icon: FileText },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">AgencyROI Pro</span>
          </div>
          
          <div className="flex space-x-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={clsx(
                    'relative px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2',
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-white/10 rounded-md"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
