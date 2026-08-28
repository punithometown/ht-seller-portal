import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Plus, 
  Warehouse, 
  Zap, 
  Check, 
  ArrowRight,
  Boxes,
  ShoppingBag,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronDown,
  FileSpreadsheet,
  LogOut,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSeller, WAREHOUSES, DEMO_USERS } from '../../context/SellerContext';
import { Badge } from '../common/Badge';

export const Navbar: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadNotificationsCount, 
    markAllNotificationsRead, 
    dismissNotification,
    activeWarehouse,
    setActiveWarehouse,
    realTimeSync,
    setRealTimeSync,
    triggerSimulatedSale,
    products,
    orders,
    clients,
    currentUser,
    logout,
    switchUser
  } = useSeller();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showWarehouseMenu, setShowWarehouseMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ type: string; title: string; subtitle: string; link: string }[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const q = query.toLowerCase();
    const results: { type: string; title: string; subtitle: string; link: string }[] = [];

    // Search Products
    products.forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.material.toLowerCase().includes(q)) {
        results.push({
          type: 'Product',
          title: p.name,
          subtitle: `${p.sku} • ${p.category} • Stock: ${p.stock}`,
          link: '/products'
        });
      }
    });

    // Search Orders
    orders.forEach(o => {
      if (o.orderNumber.toLowerCase().includes(q) || o.clientName.toLowerCase().includes(q) || o.status.toLowerCase().includes(q)) {
        results.push({
          type: 'Order',
          title: `Order #${o.orderNumber} - ${o.clientName}`,
          subtitle: `${o.status} • $${o.totalAmount.toLocaleString()} • ${o.items.length} items`,
          link: '/orders'
        });
      }
    });

    // Search Clients
    clients.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.company && c.company.toLowerCase().includes(q))) {
        results.push({
          type: 'Client',
          title: c.name,
          subtitle: `${c.tier} • ${c.totalOrders} Orders • $${c.totalSpent.toLocaleString()}`,
          link: '/clients'
        });
      }
    });

    setSearchResults(results.slice(0, 8));
  };

  return (
    <header className="h-14 bg-[#FAF8F5] border-b border-[#E7DDD3] px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-[0_1px_3px_rgba(36,21,14,0.03)]">
      
      {/* Left: Mobile Sidebar Trigger & Live Sync indicator */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded text-[#6B5546] hover:bg-[#EFE7DE] hover:text-[#24150E]"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-bold text-[#24150E] hidden sm:block">Seller Dashboard</h2>
          <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] text-[10px] font-bold rounded-full uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>Live Sync</span>
          </span>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="relative flex-1 max-w-xs sm:max-w-sm mx-3">
        <Search className="w-3.5 h-3.5 text-[#9C8270] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search products, SKUs, clients..."
          value={searchQuery}
          onChange={(e) => {
            handleSearch(e.target.value);
            setShowSearchModal(true);
          }}
          onFocus={() => setShowSearchModal(true)}
          className="w-full bg-[#F3ECE2] hover:bg-[#EDE3D6] focus:bg-white text-xs text-[#24150E] placeholder-[#9C8270] pl-8 pr-3 py-1.5 rounded border border-[#E0D2C3] focus:outline-none focus:ring-1 focus:ring-[#D84C1C] focus:border-[#D84C1C] transition-colors"
        />

        {/* Quick Search Dropdown */}
        {showSearchModal && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-lg shadow-xl border border-[#E7DDD3] overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
            <div className="p-2.5 bg-[#FAF7F2] border-b border-[#E7DDD3] flex items-center justify-between text-[11px] text-[#7A6454] font-medium">
              <span>Results ({searchResults.length})</span>
              <button 
                onClick={() => setShowSearchModal(false)}
                className="text-[#9C8270] hover:text-[#24150E] text-[10px]"
              >
                Close
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-[#F5EFE8]">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#9C8270]">
                  No matching items found for "{searchQuery}"
                </div>
              ) : (
                searchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setShowSearchModal(false);
                      setSearchQuery('');
                      navigate(res.link);
                    }}
                    className="p-2.5 hover:bg-[#FAF7F2] cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        res.type === 'Product' ? 'bg-[#FFF2EB] text-[#C84B22] border border-[#FCD2BF]' :
                        res.type === 'Order' ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]' :
                        'bg-[#F3ECE2] text-[#6B5546] border border-[#E0D2C3]'
                      }`}>
                        {res.type}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#24150E] group-hover:text-[#D84C1C] truncate">{res.title}</p>
                        <p className="text-[10px] text-[#9C8270] truncate">{res.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C2B1A2] group-hover:text-[#D84C1C] shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2">
        
        {/* Test Sale Button */}
        <button
          onClick={triggerSimulatedSale}
          className="hidden md:flex items-center gap-1.5 bg-[#FFF2EB] text-[#C84B22] text-xs font-semibold px-2.5 py-1.5 rounded border border-[#FCD2BF] hover:bg-[#FFE8DC] transition"
          title="Simulate store purchase"
        >
          <Zap className="w-3.5 h-3.5 text-[#D84C1C] fill-[#D84C1C]" />
          <span>Test Sale</span>
        </button>

        {/* Warehouse Selector */}
        <div className="relative">
          <button
            onClick={() => setShowWarehouseMenu(!showWarehouseMenu)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded bg-[#F3ECE2] border border-[#E0D2C3] text-[#3E291C] hover:bg-[#EBE2D5] transition-colors"
          >
            <Warehouse className="w-3.5 h-3.5 text-[#9C8270]" />
            <span className="max-w-[110px] truncate text-[11px]">{activeWarehouse}</span>
            <ChevronDown className="w-3 h-3 text-[#9C8270]" />
          </button>

          {showWarehouseMenu && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-lg shadow-xl border border-[#E7DDD3] py-1 z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-[#9C8270] uppercase tracking-wider border-b border-[#F3ECE2]">
                Warehouse Node
              </div>
              {WAREHOUSES.map((wh) => (
                <button
                  key={wh}
                  onClick={() => {
                    setActiveWarehouse(wh);
                    setShowWarehouseMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#FAF7F2] transition-colors ${
                    activeWarehouse === wh ? 'text-[#D84C1C] font-bold bg-[#FFF2EB]' : 'text-[#3E291C]'
                  }`}
                >
                  <span className="truncate">{wh}</span>
                  {activeWarehouse === wh && <Check className="w-3.5 h-3.5 text-[#D84C1C] shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-1.5 rounded text-[#6B5546] hover:text-[#24150E] hover:bg-[#F3ECE2] border border-[#E0D2C3] transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#D84C1C] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-[#E7DDD3] py-2 z-50">
              <div className="px-3.5 py-2 border-b border-[#F3ECE2] flex items-center justify-between">
                <span className="font-bold text-[#24150E] text-xs">Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#D84C1C] hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#F5EFE8]">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#9C8270]">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 hover:bg-[#FAF7F2] transition-colors flex items-start gap-2.5 ${!notif.read ? 'bg-[#FFF6F2]' : ''}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'STOCK_ALERT' && <Boxes className="w-3.5 h-3.5 text-amber-600" />}
                        {notif.type === 'NEW_ORDER' && <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />}
                        {notif.type === 'NEW_INQUIRY' && <MessageSquare className="w-3.5 h-3.5 text-[#D84C1C]" />}
                        {notif.type === 'CSV_IMPORT' && <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
                        {notif.type === 'SYSTEM' && <Bell className="w-3.5 h-3.5 text-[#7A6454]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-[#24150E] truncate">{notif.title}</p>
                          <span className="text-[9px] text-[#9C8270] shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-[#6B5546] mt-0.5 leading-snug">{notif.message}</p>
                      </div>
                      <button
                        onClick={() => dismissNotification(notif.id)}
                        className="text-[#C2B1A2] hover:text-[#24150E] text-xs px-0.5"
                      >
                        &times;
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Primary CTA: Add Product */}
        <button
          onClick={() => navigate('/products/add')}
          className="bg-[#D84C1C] text-white text-xs font-bold px-3 sm:px-4 py-1.5 rounded hover:bg-[#BF3E12] transition flex items-center gap-1.5 shadow-sm shadow-[#D84C1C]/25"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Product</span>
        </button>

        {/* Secondary CTA: Bulk CSV */}
        <button
          onClick={() => navigate('/products/add?tab=csv')}
          className="bg-[#F3ECE2] text-[#4A3427] text-xs font-semibold px-3 py-1.5 rounded border border-[#E0D2C3] hover:bg-[#EBE2D5] transition hidden xl:flex items-center gap-1.5"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#9C8270]" />
          <span>Bulk CSV</span>
        </button>

        {/* User Account Popover */}
        <div className="relative ml-1">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg border border-[#E0D2C3] hover:bg-[#F3ECE2] transition"
            title="Merchant Account & Sessions"
          >
            {currentUser?.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt="" 
                className="w-6 h-6 rounded-full object-cover border border-[#D5C5B5] shrink-0" 
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#D84C1C] text-white font-bold text-[10px] flex items-center justify-center">
                {currentUser?.name?.slice(0, 1) || 'H'}
              </div>
            )}
            <span className="hidden md:inline text-xs font-semibold text-[#24150E] max-w-[100px] truncate">
              {currentUser?.name?.split(' ')[0] || 'Merchant'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#9C8270]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-[#E7DDD3] py-2 z-50 text-[#24150E] animate-in fade-in">
              <div className="px-3.5 py-2 border-b border-[#F3ECE2]">
                <p className="text-[10px] font-bold text-[#9C8270] uppercase tracking-wider">Merchant Station</p>
                <p className="text-xs font-bold text-[#24150E] mt-0.5">{currentUser?.name}</p>
                <p className="text-[11px] text-[#D84C1C] font-semibold truncate">{currentUser?.storeName}</p>
                <p className="text-[10px] text-[#7A6454] truncate mt-0.5">{currentUser?.email}</p>
              </div>

              {/* Demo Account Switcher */}
              <div className="py-2 px-1 space-y-1">
                <p className="px-2.5 text-[9px] font-bold text-[#9C8270] uppercase tracking-wider">Switch Account</p>
                {DEMO_USERS.map((usr) => (
                  <button
                    key={usr.id}
                    onClick={() => {
                      switchUser(usr);
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] flex items-center justify-between hover:bg-[#FAF7F2] transition ${
                      currentUser?.id === usr.id ? 'bg-[#FFF2EB] text-[#C84B22] font-semibold' : 'text-[#4A3427]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={usr.avatar} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                      <span className="truncate">{usr.name}</span>
                    </div>
                    <span className="text-[9px] text-[#9C8270] shrink-0">{usr.role.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Sign Out Button */}
              <div className="pt-1.5 border-t border-[#F3ECE2] px-2">
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                    navigate('/login');
                  }}
                  className="w-full py-1.5 px-2.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>


      </div>
    </header>
  );
};
