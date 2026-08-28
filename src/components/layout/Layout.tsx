import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useSeller } from '../../context/SellerContext';
import { CheckCircle, AlertTriangle, Info, X, Zap } from 'lucide-react';

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeToast, clearActiveToast } = useSeller();

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1F1610] flex flex-col lg:flex-row font-sans">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Dynamic Toast Alert Banner */}
        {activeToast && (
          <div className="sticky top-0 z-40 px-4 lg:px-6 pt-2">
            <div className="max-w-4xl mx-auto rounded-xl bg-[#1E140E] text-[#EDE0D4] p-3 shadow-xl border border-[#3E2B20] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-[#D84C1C]/20 text-[#FFA88B] flex items-center justify-center shrink-0">
                  {activeToast.type === 'NEW_ORDER' ? <Zap className="w-3.5 h-3.5 text-[#D84C1C] fill-[#D84C1C]" /> :
                   activeToast.type === 'STOCK_ALERT' ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> :
                   <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{activeToast.title}</p>
                  <p className="text-[11px] text-[#B5A191] truncate">{activeToast.message}</p>
                </div>
              </div>
              <button
                onClick={clearActiveToast}
                className="p-1 text-[#8A7363] hover:text-white rounded hover:bg-[#2A1D15] shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Routed Page Content */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 w-full max-w-[1440px] mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

