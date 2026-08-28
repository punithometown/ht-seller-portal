import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Armchair, 
  PlusCircle, 
  Boxes, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  BarChart3, 
  FileSpreadsheet,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  Package,
  LogOut,
  ChevronUp,
  UserCheck,
  Store,
  Radio
} from 'lucide-react';
import { useSeller, DEMO_USERS } from '../../context/SellerContext';
import { HomeTownLogo } from '../common/HomeTownLogo';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { products, orders, inquiries, currentUser, logout, switchUser } = useSeller();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const lowStockCount = products.filter(p => p.stock <= p.minStockThreshold).length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'In Production / Carpentry').length;
  const unreadInquiriesCount = inquiries.filter(i => i.status === 'New' || i.status === 'In Progress').length;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    onClose();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      badgeVariant: 'terracotta'
    },
    {
      to: '/products',
      label: 'Products',
      icon: Package,
      badge: products.length
    },
    {
      to: '/products/add',
      label: 'Add Product',
      icon: PlusCircle,
      badge: null
    },
    {
      to: '/inventory',
      label: 'Inventory',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} alert` : null,
      badgeVariant: 'amber'
    },
    {
      to: '/clients',
      label: 'Clients & Ledgers',
      icon: Users,
      badge: null
    },
    {
      to: '/inquiries',
      label: 'Inquiries',
      icon: MessageSquare,
      badge: unreadInquiriesCount > 0 ? unreadInquiriesCount : null,
      badgeVariant: 'wood'
    },
    {
      to: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      to: '/shopify',
      label: 'Shopify OMS & APIs',
      icon: Radio,
      badge: 'Live',
      badgeVariant: 'terracotta'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-[#160E0A]/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#1E150F] text-[#D8C7B8] flex flex-col border-r border-[#34241B] z-50 transition-transform duration-200 ease-in-out shrink-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Top: Brand Identity Header with Official HT Logo */}
        <div className="p-4 border-b border-[#34241B] bg-[#170F0A]">
          <div className="flex items-center justify-between">
            <HomeTownLogo size="md" showText theme="dark" />
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#D84C1C]/20 text-[#FF8E68] border border-[#D84C1C]/30 uppercase tracking-wider">
              Seller
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold text-[#8A7363] uppercase tracking-wider">
            Merchant Station
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              end={item.to === '/'}
              className={({ isActive }) => `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors group ${
                isActive 
                  ? 'bg-[#D84C1C]/15 text-[#FF8E68] border border-[#D84C1C]/35 font-semibold' 
                  : 'text-[#C5B3A3] hover:bg-[#2A1D15] hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <item.icon className="w-4 h-4 text-[#A89382] group-hover:text-[#FF8E68] transition-colors shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== null && item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  item.badgeVariant === 'amber' ? 'bg-[#422506] text-[#FCD34D] border border-[#854D0E]' :
                  item.badgeVariant === 'terracotta' ? 'bg-[#4A1709] text-[#FFA88B] border border-[#B93815]' :
                  item.badgeVariant === 'wood' ? 'bg-[#372314] text-[#E9C39B] border border-[#6B4426]' :
                  'bg-[#2A1D15] text-[#A89382] border border-[#3E2B20]'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick CSV Action Link */}
        <div className="px-3 py-2 border-t border-[#34241B]">
          <NavLink
            to="/products/add?tab=csv"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#281C14] hover:bg-[#34241B] text-[#E2D2C2] text-xs font-medium border border-[#443023] transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#D84C1C] shrink-0" />
            <span className="truncate">Bulk CSV Upload</span>
          </NavLink>
        </div>

        {/* Bottom Panel: Verified Merchant Profile & Logout Menu */}
        <div className="p-3 border-t border-[#34241B] bg-[#170F0A] relative">
          
          {/* User Popover Switcher / Logout Menu */}
          {showUserMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#231810] border border-[#4A3427] rounded-xl shadow-2xl p-3 z-50 text-[#EDE0D4] animate-in fade-in slide-in-from-bottom-2">
              <div className="pb-2.5 border-b border-[#3E2C20]">
                <p className="text-[10px] font-bold text-[#9C8270] uppercase tracking-wider">Active Merchant Station</p>
                <p className="text-xs font-bold text-white mt-0.5">{currentUser?.name}</p>
                <p className="text-[11px] text-[#FF8E68] font-medium truncate">{currentUser?.storeName}</p>
                <p className="text-[10px] text-[#A6907F] truncate mt-0.5">{currentUser?.email}</p>
              </div>

              {/* Demo Account Switcher */}
              <div className="py-2 space-y-1">
                <p className="text-[9px] font-bold text-[#8A7363] uppercase tracking-wider">Switch Merchant Role</p>
                {DEMO_USERS.map((usr) => (
                  <button
                    key={usr.id}
                    onClick={() => {
                      switchUser(usr);
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left p-1.5 rounded text-[11px] flex items-center justify-between hover:bg-[#34241B] transition ${
                      currentUser?.id === usr.id ? 'bg-[#D84C1C]/20 text-[#FFA88B] font-semibold' : 'text-[#D0C0B0]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <img src={usr.avatar} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                      <span className="truncate">{usr.name}</span>
                    </div>
                    <span className="text-[9px] text-[#8A7363] shrink-0">{usr.role.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Logout Button */}
              <div className="pt-2 border-t border-[#3E2C20]">
                <button
                  onClick={handleLogout}
                  className="w-full py-1.5 px-2 rounded bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-rose-800/40"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Station</span>
                </button>
              </div>
            </div>
          )}

          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#281C14] cursor-pointer transition group"
          >
            {currentUser?.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-[#4E382A] shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#34241B] text-[#EAE0D5] flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.name?.slice(0, 2).toUpperCase() || 'HT'}
              </div>
            )}
            
            <div className="flex-1 overflow-hidden min-w-0">
              <p className="text-xs font-semibold text-white truncate group-hover:text-[#FF8E68] transition">
                {currentUser?.name || 'Alex Furniture'}
              </p>
              <p className="text-[10px] text-[#A6907F] truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D84C1C]"></span>
                <span>{currentUser?.role || 'Verified Seller'}</span>
              </p>
            </div>

            <ChevronUp className={`w-3.5 h-3.5 text-[#8A7363] group-hover:text-[#C5B3A3] transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </div>
        </div>

      </aside>
    </>
  );
};
