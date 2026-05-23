import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../api/usersAPI';

const Navbar = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      location.pathname === path
        ? 'bg-white text-indigo-700 shadow-md'
        : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
    }`;

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-indigo-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <span className="text-white text-xl font-bold tracking-wide">SIMS</span>
            <span className="hidden sm:block text-indigo-200 text-sm">| SmartPark</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link to="/spare-part" className={linkClass('/spare-part')}>SparePart</Link>
            <Link to="/stock-in" className={linkClass('/stock-in')}>StockIn</Link>
            <Link to="/stock-out" className={linkClass('/stock-out')}>StockOut</Link>
            <Link to="/reports" className={linkClass('/reports')}>Reports</Link>
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow hover:shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
