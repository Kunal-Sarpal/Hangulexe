import React, { useState } from 'react';
import { apiLogin, apiSignup, setToken } from '../../api/api';

export default function CustomerLoginModal({ onClose, setUser }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        if (!name) throw new Error('Name is required');
        const data = await apiSignup(name, email, password);
        setToken(data.token);
        setUser({ ...data.user, email });
        onClose();
      } else {
        const data = await apiLogin(email, password);
        setToken(data.token);
        setUser({ ...data.user, email });
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1B19]/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#FAF9F6] border border-[#E6E2DA] w-full max-w-md overflow-hidden shadow-2xl relative p-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-[#6E6A63] hover:text-[#1C1B19] text-2xl font-light cursor-pointer select-none"
          aria-label="Close"
        >
          &times;
        </button>
        
        <div className="text-center">
          {/* Brand/Subtitle */}
          <span className="text-[9px] font-bold tracking-[0.3em] text-[#6E6A63] uppercase block mb-1">
            HANGULUXE
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1C1B19] mb-2">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-[#6E6A63] mb-6 font-semibold uppercase tracking-wider">
            {isSignup 
              ? 'Join our community for exclusive drops' 
              : 'Log in to track orders, save items, and more'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="text-xs text-[#DC2626] bg-[#FEF2F2] border border-red-100 p-3 font-semibold text-center uppercase tracking-wider">
                {error}
              </div>
            )}
            
            {isSignup && (
              <div>
                <label className="text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Suraj Sharma"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19] transition-all"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="e.g. you@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19] transition-all"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase block mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1C1B19] text-[#FAF9F6] font-bold text-xs tracking-widest py-4 uppercase hover:opacity-90 transition-opacity disabled:opacity-75 shadow-sm mt-2"
            >
              {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Log In')}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 pt-4 border-t border-[#E6E2DA] text-xs font-bold text-[#6E6A63]">
            {isSignup ? (
              <span>
                Already have an account?{' '}
                <button 
                  onClick={() => { setIsSignup(false); setError(''); }} 
                  className="text-[#1C1B19] hover:underline uppercase tracking-wider"
                >
                  Log In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button 
                  onClick={() => { setIsSignup(true); setError(''); }} 
                  className="text-[#1C1B19] hover:underline uppercase tracking-wider"
                >
                  Sign Up
                </button>
              </span>
            )}
          </div>

          {!isSignup && (
            <div className="mt-4 text-[10px] text-[#A39E95] font-semibold">
              Demo Customer: <br/> manager@fashionco.com / password123
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
