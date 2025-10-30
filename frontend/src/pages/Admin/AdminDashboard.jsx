import { Link } from 'react-router-dom';
import { BookOpen, Package, Users, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [booksRes, ordersRes, usersRes] = await Promise.all([
        api.get('/books?limit=1000'),
        api.get('/orders'),
        api.get('/users')
      ]);

      const totalRevenue = ordersRes.data
        .filter((order) => order.orderStatus === 'Delivered')
        .reduce((sum, order) => sum + Number(order.totalPrice), 0);

      setStats({
        totalBooks: booksRes.data.total || booksRes.data.books.length,
        totalOrders: ordersRes.data.length,
        totalUsers: usersRes.data.length,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/books"
          className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-primary-100 rounded-full">
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Manage Books</h2>
              <p className="text-gray-600">Add, edit, or delete books</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-green-100 rounded-full">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Manage Orders</h2>
              <p className="text-gray-600">View and update order status</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;