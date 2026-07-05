import { useState } from 'react';
import { USERS } from '../data/constants';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const user = USERS[email];
      if (user) {
        onLogin({ ...user, email });
      } else {
        setError('Invalid credentials. Try manager@fashionco.com');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-screen-bg">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md animate-fade-in">
        <div className="login-card">
          <div className="login-title-wrapper">
            <div className="login-logo">
              FC
            </div>
            <h1 className="login-title">Fashion Co</h1>
            <p className="login-subtitle">Admin Panel — Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field-group">
              <label className="login-label">Email</label>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="Enter your email" className="login-input" required />
            </div>

            <div className="login-field-group">
              <label className="login-label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="login-input" required />
            </div>



            {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p className="login-footer-text">Demo accounts: manager@ · reception@ · designer@ · partner@fashionco.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
