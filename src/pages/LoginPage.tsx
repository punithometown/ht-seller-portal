import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Warehouse, 
  Headphones, 
  Boxes, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  X,
  Sparkles
} from 'lucide-react';
import { useSeller, DEMO_USERS } from '../context/SellerContext';
import { AuthUser } from '../types';
import { HomeTownLogo } from '../components/common/HomeTownLogo';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, addToast } = useSeller();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const [email, setEmail] = useState('alex@hometown-furniture.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // If already authenticated and navigated here directly, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email.trim()) {
      setErrorMessage('Please enter your merchant email or identifier.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password, rememberMe);
      setIsLoading(false);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.error || 'Invalid merchant credentials. Please check your email or select a demo profile.');
      }
    }, 450);
  };

  const handleSelectDemoUser = (user: AuthUser) => {
    setEmail(user.email);
    setPassword('••••••••••••');
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(user.email, 'password123', true);
      setIsLoading(false);
      if (res.success) {
        navigate(from, { replace: true });
      }
    }, 350);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      addToast('Invalid Email', 'Please provide a registered merchant email address.', 'SYSTEM');
      return;
    }
    setForgotSuccess(true);
    addToast('Recovery Dispatched', `Temporary access key sent to ${forgotEmail}`, 'SYSTEM');
  };

  return (
    <div className="min-h-screen bg-[#140D08] text-[#EADBCE] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#D84C1C] selection:text-white">
      
      {/* Subtle Background Ambience with Warm Amber and Terracotta Radiance */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(216,76,28,0.18),rgba(20,13,8,0))] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#D84C1C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#DAA350]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="px-6 py-4 border-b border-[#322218] bg-[#1A110B]/80 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <HomeTownLogo size="sm" showText theme="dark" />
        </div>

        <div className="flex items-center gap-4 text-xs text-[#A89280]">
          <div className="hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D84C1C]" />
            <span className="text-[11px]">256-Bit Encrypted Portal</span>
          </div>
          <span className="hidden sm:inline text-[#4A3427]">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[11px] text-[#D8C7B8]">Catalog Engine v2.4 Active</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 z-10">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Info Column (Visible on lg screens) */}
          <div className="lg:col-span-5 hidden lg:flex flex-col justify-between space-y-6 pr-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A1C14] border border-[#4E3424] text-[#FFA88B] text-[11px] font-semibold">
                <Sparkles className="w-3 h-3 text-[#D84C1C]" />
                <span>HomeTown Merchant Station</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight leading-snug">
                Unified Furniture Merchandising & Supply Engine
              </h2>
              <p className="text-xs text-[#B8A494] leading-relaxed">
                Seamlessly manage luxury solid wood collections, modular sofas, real-time fulfillment hubs, and bespoke carpentry orders.
              </p>
            </div>

            {/* Quick Feature Pillars */}
            <div className="space-y-2.5 pt-2">
              <div className="p-3 rounded-lg bg-[#20150E]/80 border border-[#3E2A1D] flex items-start gap-3">
                <div className="w-7 h-7 rounded bg-[#D84C1C]/20 text-[#FFA88B] flex items-center justify-center shrink-0 mt-0.5">
                  <Boxes className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#EDE0D4]">Real-Time Inventory Synchronization</h4>
                  <p className="text-[11px] text-[#A6907F] mt-0.5">Automated multi-warehouse tracking with low-stock alerts and CSV batch sync.</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#20150E]/80 border border-[#3E2A1D] flex items-start gap-3">
                <div className="w-7 h-7 rounded bg-[#D5A764]/20 text-[#F5D090] flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#EDE0D4]">VIP Designer & B2B Commercial Ledgers</h4>
                  <p className="text-[11px] text-[#A6907F] mt-0.5">Track lifetime value, commercial credit terms, and custom furniture inquiries.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#7A6354] flex items-center gap-2">
              <span>HomeTown Furniture & Homeware Network</span>
              <span>•</span>
              <span>ISO 27001 Certified</span>
            </div>
          </div>

          {/* Right / Login Form Card */}
          <div className="lg:col-span-7 w-full max-w-md mx-auto">
            <div className="bg-[#1E140E]/90 border border-[#3E2B20] rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
              
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Merchant Sign In
                  </h3>
                  <p className="text-xs text-[#A89280] mt-1">
                    Access your seller console, inventory hubs, and order pipelines.
                  </p>
                </div>
                <HomeTownLogo size="sm" />
              </div>

              {/* Error Message Box */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-[11px] leading-relaxed">
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#D8C7B8] block">
                    Merchant Email / Station ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8A7363] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="merchant@hometown-furniture.com"
                      className="w-full bg-[#120B07] border border-[#3E2A1D] focus:border-[#D84C1C] text-xs text-white placeholder-[#7A6354] pl-9 pr-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D84C1C] transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#D8C7B8]">
                      Merchant Key / Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] text-[#FF8E68] hover:text-[#FFA88B] hover:underline font-medium"
                    >
                      Forgot key?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8A7363] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#120B07] border border-[#3E2A1D] focus:border-[#D84C1C] text-xs text-white placeholder-[#7A6354] pl-9 pr-10 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D84C1C] transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#8A7363] hover:text-[#EADBCE] absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-[#120B07] border-[#4E3424] text-[#D84C1C] focus:ring-[#D84C1C] focus:ring-offset-[#1E140E]"
                    />
                    <span className="text-[11px] text-[#A89280] font-medium">Keep merchant session authenticated</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#D84C1C] hover:bg-[#C03E12] disabled:opacity-60 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D84C1C]/25 active:scale-[0.99] mt-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Enter Seller Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Quick Demo Switcher */}
              <div className="pt-4 border-t border-[#34241B] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#A89280] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#D84C1C]" />
                    <span>1-Click Demo Profiles</span>
                  </span>
                  <span className="text-[10px] text-[#7A6354]">Instant Access</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {DEMO_USERS.map((usr) => (
                    <button
                      key={usr.id}
                      type="button"
                      onClick={() => handleSelectDemoUser(usr)}
                      className={`p-2.5 rounded-lg text-left border transition-all flex flex-col justify-between ${
                        email === usr.email 
                          ? 'bg-[#351E13] border-[#D84C1C] text-white' 
                          : 'bg-[#150D08] border-[#382418] hover:border-[#523725] text-[#D8C7B8] hover:bg-[#1E140E]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <img 
                          src={usr.avatar} 
                          alt="" 
                          className="w-6 h-6 rounded-full object-cover border border-[#4E3424] shrink-0" 
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold truncate leading-tight">{usr.name.split(' ')[0]}</p>
                          <p className="text-[9px] text-[#8A7363] truncate">{usr.role.split(' ')[0]}</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-[#FF8E68] font-semibold truncate">
                        {usr.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#322218] bg-[#1A110B]/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#7A6354] z-10">
        <div className="flex items-center gap-2 text-[11px]">
          <span>&copy; 2026 HomeTown Furniture & Merchandising. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <a href="#terms" onClick={(e) => { e.preventDefault(); addToast('Terms of Service', 'Standard HomeTown Enterprise Merchant Agreement.', 'SYSTEM'); }} className="hover:text-[#D8C7B8]">
            Terms of Service
          </a>
          <a href="#privacy" onClick={(e) => { e.preventDefault(); addToast('Privacy Policy', 'Data secured under SOC-2 Merchant Guidelines.', 'SYSTEM'); }} className="hover:text-[#D8C7B8]">
            Security & Privacy
          </a>
          <a href="#help" onClick={(e) => { e.preventDefault(); setShowForgotModal(true); }} className="hover:text-[#D8C7B8]">
            Seller Support
          </a>
        </div>
      </footer>

      {/* Forgot Password / Key Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#140D08]/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#1E140E] border border-[#3E2B20] rounded-xl shadow-2xl w-full max-w-md overflow-hidden text-[#EADBCE]">
            
            <div className="px-5 py-3.5 bg-[#170F0A] border-b border-[#34241B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#D84C1C]/20 text-[#FFA88B] flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white">Merchant Key Recovery</h3>
              </div>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccess(false);
                }}
                className="p-1 rounded text-[#8A7363] hover:text-white hover:bg-[#281C14]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {forgotSuccess ? (
                <div className="p-4 rounded-lg bg-[#0F291E] border border-[#047857] space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Recovery Key Dispatched</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                    A secure 6-digit one-time access token and password reset link have been transmitted to <strong>{forgotEmail}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSuccess(false);
                    }}
                    className="w-full mt-3 bg-[#D84C1C] hover:bg-[#C03E12] text-white font-bold py-2 rounded text-xs transition"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <p className="text-[#A89280] text-[11px] leading-relaxed">
                    Enter the verified corporate email address associated with your HomeTown seller station to receive an instant authentication link.
                  </p>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#D8C7B8]">Corporate Merchant Email</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. alex@hometown-furniture.com"
                      className="w-full bg-[#120B07] border border-[#3E2A1D] text-xs text-white p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D84C1C]"
                    />
                  </div>

                  <div className="p-2.5 rounded bg-[#150D08] border border-[#34241B] text-[10px] text-[#8A7363] flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D84C1C] shrink-0 mt-0.5" />
                    <span>For demo testing, you can also immediately select any profile on the sign-in screen without resetting passwords.</span>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-3 py-1.5 rounded bg-[#281C14] text-[#D8C7B8] hover:bg-[#34241B] text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-[#D84C1C] hover:bg-[#C03E12] text-white text-xs font-bold shadow-xs"
                    >
                      Send Reset Instructions
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
