
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, BookOpen, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount, toggleCart } = useCart();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-white border-b-2 border-blue-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-900" />
            <span className="text-2xl font-bold text-blue-900">BookWrld</span>
          </Link>

          <div className="flex items-center space-x-6">
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 text-blue-900 hover:text-blue-600 transition-colors"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="hidden sm:inline font-medium">Admin</span>
              </Link>
            )}

            <button
              onClick={toggleCart}
              className="relative p-2 text-blue-900 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {getCartCount()}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 text-blue-900 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden sm:inline font-medium">{user?.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-blue-900 py-1 z-50">
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-blue-900 hover:bg-blue-50 transition-colors font-medium"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-blue-900 hover:bg-blue-50 transition-colors flex items-center space-x-2 font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;