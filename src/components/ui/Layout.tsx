import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/src/components/ui/Navbar';
import { Sidebar } from '@/src/components/ui/Sidebar';
import { Menu, X } from 'lucide-react';
import { cn } from '@/src/utils/utils';

export const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-brand-bg relative overflow-hidden">
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand-primary text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Desktop & Mobile */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 lg:relative transition-transform duration-300 ease-in-out lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </div>
  );
};
