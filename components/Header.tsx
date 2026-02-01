
import React from 'react';
import { Bell, Menu, Search, Settings } from 'lucide-react';
import { User, UserRole } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
  user: User;
  role: UserRole;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, user, role }) => {
  return (
    <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-6 z-30 border-b border-white/10 bg-nesma-dark/80 backdrop-blur-md sticky top-0 shadow-lg">
      <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors border border-transparent hover:border-white/10 active:scale-95 transform transition-transform lg:hidden"
        >
          <Menu size={24} />
        </button>
        
        {/* Mobile Logo Text (Visible only on mobile when sidebar closed essentially, or always on mobile header) */}
        <span className="lg:hidden font-bold text-lg text-white tracking-wider">NESMA</span>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-64 lg:w-96 focus-within:bg-white/10 focus-within:border-nesma-secondary/50 transition-all focus-within:w-full focus-within:max-w-md group">
          <Search size={18} className="text-gray-400 group-focus-within:text-nesma-secondary transition-colors" />
          <input 
            type="text" 
            placeholder="Search assets, orders..." 
            className="bg-transparent border-none outline-none text-sm w-full px-3 placeholder-gray-500 text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6 pl-2">
        {/* Mobile Search Icon */}
        <button className="md:hidden p-2 text-gray-300 hover:text-white">
          <Search size={20} />
        </button>

        <div className="flex items-center gap-1 md:gap-2">
          <div className="relative cursor-pointer p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-nesma-dark animate-pulse"></span>
          </div>
          <div className="relative cursor-pointer p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white hidden sm:block">
            <Settings size={20} />
          </div>
        </div>
        
        <div className="h-8 w-px bg-white/10 mx-1 md:mx-2 hidden sm:block"></div>
        
        <div className="flex items-center gap-3 pl-2 sm:pl-0 border-l border-white/10 sm:border-0">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
            <p className="text-[10px] text-nesma-secondary font-medium tracking-wide uppercase mt-0.5">{user.role}</p>
          </div>
          <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-nesma-primary to-nesma-secondary p-[2px] cursor-pointer shadow-lg hover:shadow-nesma-secondary/20 transition-all hover:scale-105">
             <div className="h-full w-full rounded-full border-2 border-nesma-dark overflow-hidden bg-nesma-dark">
                <img src={user.avatar} alt="User" className="h-full w-full object-cover" />
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};
