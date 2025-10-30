
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, ArrowLeft, BookOpen, Calendar, Globe, Tag, Package, Hash } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const { data } = await api.get(`/books/${id}`);
      setBook(data);
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(book, quantity);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 fill-blue-900 text-blue-900 drop-shadow-sm" />);
    }
    if (hasHalf) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-5 h-5 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-5 h-5 fill-blue-900 text-blue-900" />
          </div>
        </div>
      );
    }
    while (stars.length < 5) {
      stars.push(<Star key={stars.length} className="w-5 h-5 text-gray-300" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-slate-200"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-blue-900 border-r-blue-800 border-b-blue-700 border-l-blue-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 text-center">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-24 h-24 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Book not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-slate-600 hover:text-blue-900 transition-all duration-300 mb-8"
        >
          <div className="p-2 rounded-full bg-white shadow-sm border border-slate-200 group-hover:shadow-md group-hover:border-blue-300 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg">Back to Books</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-1">
            <div className="group relative overflow-hidden rounded-2xl shadow-xl bg-white p-4 border border-slate-200">
              <div className="aspect-w-3 aspect-h-4 overflow-hidden rounded-xl">
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image'}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                {book.title}
              </h1>
              <p className="text-xl text-slate-600 mt-2 flex items-center gap-2 font-semibold">
                <BookOpen className="h-6 w-6 text-blue-900" />
                by <span className="text-blue-900">{book.author}</span>
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(book.ratings?.average || 0)}
              </div>
              <span className="text-sm font-medium text-slate-600">
                {book.ratings?.average?.toFixed(1) || '0.0'} ({book.ratings?.count || 0} reviews)
              </span>
            </div>

            {/* Price & Category */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-5xl font-bold text-blue-900">
                ${book.price}
              </div>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 font-bold text-sm shadow-sm">
                <Tag className="h-4 w-4" />
                {book.category}
              </span>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-7 bg-blue-900 rounded-full"></div>
                About this book
              </h3>
              <p className="text-slate-700 leading-relaxed text-base">
                {book.description || 'No description available.'}
              </p>
            </div>

            {/* Book Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {book.publisher && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 group">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Package className="h-4 w-4 text-blue-900 group-hover:scale-110 transition-transform" />
                    Publisher
                  </div>
                  <p className="mt-2 font-semibold text-slate-900 text-lg">{book.publisher}</p>
                </div>
              )}
              {book.publishedDate && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 group">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Calendar className="h-4 w-4 text-blue-900 group-hover:scale-110 transition-transform" />
                    Published
                  </div>
                  <p className="mt-2 font-semibold text-slate-900 text-lg">
                    {new Date(book.publishedDate).getFullYear()}
                  </p>
                </div>
              )}
              {book.pages && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 group">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <BookOpen className="h-4 w-4 text-blue-900 group-hover:scale-110 transition-transform" />
                    Pages
                  </div>
                  <p className="mt-2 font-semibold text-slate-900 text-lg">{book.pages}</p>
                </div>
              )}
              {book.language && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 group">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Globe className="h-4 w-4 text-blue-900 group-hover:scale-110 transition-transform" />
                    Language
                  </div>
                  <p className="mt-2 font-semibold text-slate-900 text-lg">{book.language}</p>
                </div>
              )}
              {book.isbn && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 group md:col-span-2">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Hash className="h-4 w-4 text-blue-900 group-hover:scale-110 transition-transform" />
                    ISBN
                  </div>
                  <p className="mt-2 font-mono text-sm text-slate-700 break-all">{book.isbn}</p>
                </div>
              )}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-300">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Stock
                </div>
                <p className={`mt-2 font-bold text-xl ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                </p>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            {book.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-5 items-center">
                <div className="flex items-center gap-4">
                  <label className="font-bold text-slate-800 text-lg">Quantity:</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all shadow-sm"
                  >
                    {[...Array(Math.min(book.stock, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="group relative w-full sm:w-auto flex-1 sm:flex-initial overflow-hidden rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-10 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <ShoppingCart className="h-6 w-6 group-hover:animate-bounce" />
                  <span className="relative z-10 text-lg">Add to Cart</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              </div>
            )}

            {book.stock === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center shadow-sm">
                <p className="text-red-700 font-bold text-lg">This book is currently out of stock.</p>
                <p className="text-red-600 text-sm mt-2">Check back soon or explore similar titles!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;