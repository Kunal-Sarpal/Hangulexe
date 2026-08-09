import { useState } from 'react';
import { apiLogin, setToken } from '../api/api';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await apiLogin(email, password);
      setToken(data.token);
      onLogin({ ...data.user, email });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Try manager@fashionco.com');
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center w-full px-4 min-h-screen bg-white">
      <form onSubmit={handleSubmit} className="flex w-full flex-col max-w-96">
        <a href="#" className="mb-8" title="Go to PrebuiltUI">
          <svg className="size-10" width="30" height="33" viewBox="0 0 30 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="m8 4.55 6.75 3.884 6.75-3.885M8 27.83v-7.755L1.25 16.19m27 0-6.75 3.885v7.754M1.655 8.658l13.095 7.546 13.095-7.546M14.75 31.25V16.189m13.5 5.976V10.212a2.98 2.98 0 0 0-1.5-2.585L16.25 1.65a3.01 3.01 0 0 0-3 0L2.75 7.627a3 3 0 0 0-1.5 2.585v11.953a2.98 2.98 0 0 0 1.5 2.585l10.5 5.977a3.01 3.01 0 0 0 3 0l10.5-5.977a3 3 0 0 0 1.5-2.585" stroke="#1d293d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <h2 className="text-4xl font-medium text-gray-900">Sign in</h2>

        <p className="mt-4 text-base text-gray-500/90">
          Please enter email and password to access.
        </p>

        <div className="mt-10">
          <label className="font-medium text-gray-900">Email</label>
          <input
            placeholder="Please enter your email"
            className="mt-2 rounded-md ring ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full text-gray-900"
            required
            type="email"
            name="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
          />
        </div>

        <div className="mt-6">
          <label className="font-medium text-gray-900">Password</label>
          <input
            placeholder="Please enter your password"
            className="mt-2 rounded-md ring ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full text-gray-900"
            required
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="mt-4 text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2 border border-red-200">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-8 py-3 w-full cursor-pointer rounded-md bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-70 flex justify-center items-center"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Signing in…
            </span>
          ) : 'Login'}
        </button>

        <p className="text-center py-8 text-gray-600">
          Demo accounts: manager@ · reception@ · designer@ · partner@fashionco.com
        </p>
        
        <p className='text-center text-gray-600'>
          Don't have an account? <a href="/signup" className="text-indigo-600 hover:underline">Sign up</a>
        </p>
      </form>
    </main>
  );
};

export default LoginScreen;
