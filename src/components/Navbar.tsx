'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Gemelo 3D', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/config', label: 'Config', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-4 left-1/2 transform -translate-x-1/2 z-50 backdrop-blur-xl bg-black/30 border border-white/10 rounded-full px-4 py-2 shadow-2xl">
        <div className="flex items-center gap-2">
          {/* Navigation Items */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Divider */}
          <div className="w-px h-6 bg-white/10 mx-2" />

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Salir</span>
          </button>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-4 right-4 left-4 z-50">
        <div className="backdrop-blur-xl bg-black/30 border border-white/10 rounded-2xl px-4 py-3 shadow-2xl">
          <div className="flex items-center justify-between">
            <h1 className="text-white font-semibold text-sm">Digital Twin</h1>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="mt-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="h-px bg-white/10 my-2" />

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

