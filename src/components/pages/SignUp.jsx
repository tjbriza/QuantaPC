import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AtSign, Lock } from 'lucide-react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signUpNewUser } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const result = await signUpNewUser(email, password);

      if (result.success) {
        navigate('/profilesetup');
      } else {
        setError(result.error.message);
      }
    } catch (error) {
      setError(
        'An unexpected error occurred. Please try again: ' + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative h-screen overflow-hidden' style={{ backgroundColor: '#EEEEEE', backgroundImage: 'url(/images/background.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* Logo in top left */}
      <Link 
        to="/" 
        className="absolute top-8 left-32 p-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105"
      >
        <img 
          src="/images/logo.png"
          alt="Quanta PC" 
          className="h-12 w-auto transition-all duration-300"
        />
      </Link>

      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-24">
        {/* Tab Navigation - Outside the card */}
        <div className="flex justify-center space-x-8 mb-6">
          <Link 
            to="/login" 
            className="text-white/70 text-lg font-medium hover:text-white transition-colors duration-200 relative group font-heading"
          >
            Login
            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full rounded-full'></span>
          </Link>
          <span className="text-white text-lg font-medium border-b-2 border-transparent pb-1 relative font-heading">
            Sign Up
            <span className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full'></span>
          </span>
        </div>
        
        <div className="w-full max-w-none" style={{ width: '500px' }}>
          <div 
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
            style={{ 
              border: '1px solid #6E6E6E', 
              boxShadow: '0 0 12px rgba(0, 0, 0, 0.6)' 
            }}
          >
            <h1 className="text-2xl font-semibold text-white text-center mb-8 font-heading">
              Sign up to <span className="text-white">quantapc</span>
            </h1>

            <form className="space-y-4" onSubmit={handleSignUp}>
              <div className="mb-5">
                <label htmlFor="email" className="text-black text-lg block mb-2 font-heading">
                  Email
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    className="pl-10 bg-black/40 border border-white/20 text-white placeholder:text-white/50 rounded-full h-12 w-full px-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-black/50"
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={true}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="password" className="text-black text-lg block mb-2 font-heading">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                  <input
                    id="password"
                    type="password"
                    className="pl-10 bg-black/40 border border-white/20 text-white placeholder:text-white/50 rounded-full h-12 w-full px-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-black/50"
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={true}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="confirmPassword" className="text-black text-lg block mb-2 font-heading">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    type="password"
                    className="pl-10 bg-black/40 border border-white/20 text-white placeholder:text-white/50 rounded-full h-12 w-full px-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-black/50"
                    placeholder=""
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={true}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-300 text-sm text-center mb-4">An error occured, please try again: {error}</div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-gray-900 hover:bg-gray-100 rounded-full h-12 font-medium transition-colors duration-200 font-heading"
                style={{ 
                  border: '1px solid #6E6E6E', 
                  boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)' 
                }}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <div className="text-center">
                <span className="text-black/80 text-sm">Or</span>
              </div>

              <a
                href="https://test.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white/90 text-gray-900 border border-white/30 hover:bg-white rounded-full h-12 font-medium transition-colors duration-200 flex items-center justify-center font-heading"
                style={{ 
                  border: '1px solid #6E6E6E', 
                  boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)' 
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </a>
            </form>
            
            <p className='text-center mt-4 text-black'>
              Already have an account?{' '}
              <Link className='hover:underline font-semibold relative group font-heading' to='/login'>
                Log in!{' '}
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full rounded-full'></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
