import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { clearLoans } from '../store/slices/loanSlice';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const userType = user?.userType || null;
  const userName = user?.name || null;

  const formattedUserType = userType
    ? userType.charAt(0).toUpperCase() + userType.slice(1)
    : 'Unknown';

  const userTypeColors = {
    admin: 'bg-purple-600',
    agent: 'bg-blue-600',
    customer: 'bg-green-600'
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(deleteUser());
    dispatch(clearLoans());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* App Name */}
          <div className="flex-shrink-0">
            <span className="text-white font-extrabold text-2xl tracking-wide">CREDIT APP</span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex space-x-6 items-center">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-2">
                  
                  <div className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                    {userName || 'User'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm transition"
                >
                  <User className="h-5 w-5 mr-2" />
                  Login
                </a>
                <a
                  href="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Sign up
                </a>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white p-2 rounded-md"
            >
              <span className="sr-only">Toggle menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-4 space-y-3">
          {isLoggedIn ? (
            <>
              <div className="flex flex-col space-y-2">
                
                <div className="bg-gray-700 text-white px-3 py-2 rounded-md text-center">
                  {userName || 'User'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium flex items-center justify-center transition"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="block w-full text-left text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base"
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Login
                </div>
              </a>
              <a
                href="/signup"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Sign up
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
