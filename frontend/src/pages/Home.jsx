
import { useState, useEffect } from 'react';
import { Search, Filter, Book, TrendingUp, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import BookCard from '../components/BookCard';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const carouselImages = [
    {
      url: 'https://cdn.mos.cms.futurecdn.net/RHRww9NMVmyaBrcV43kbkP.jpg',
      title: 'Discover Your Next Adventure',
      subtitle: 'Explore thousands of captivating stories'
    },
    {
      url: 'https://miro.medium.com/v2/resize:fit:1400/1*tkmVNzi3dC64XzoJkECBHQ.jpeg',
      title: 'Knowledge at Your Fingertips',
      subtitle: 'From classics to contemporary bestsellers'
    },
    {
      url: 'https://imgproxy.domestika.org/unsafe/w:820/plain/src://content-items/010/190/647/SM_self_help_books_EN%20%281%29-original.jpg?1642155220',
      title: 'Transform Your Reading Journey',
      subtitle: 'Find inspiration in every page'
    }
  ];

  useEffect(() => {
    fetchFeaturedBooks();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [search, selectedCategory, minPrice, maxPrice]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchFeaturedBooks = async () => {
    try {
      const { data } = await api.get('/books/featured');
      setFeaturedBooks(data);
    } catch (error) {
      console.error('Error fetching featured books:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/books/categories/all');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory) params.append('category', selectedCategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const { data } = await api.get(`/books?${params.toString()}`);
      setBooks(data.books);
      setIsSearching(!!search || !!selectedCategory || !!minPrice || !!maxPrice);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setIsSearching(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section with Image Carousel */}
      <div className="relative overflow-hidden h-[600px]">
        {/* Carousel Images */}
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            {/* Dynamic Overlay - Lighter when searching */}
            <div className={`absolute inset-0 transition-all duration-500 ${
              isSearching 
                ? 'bg-gradient-to-b from-black/40 via-black/30 to-black/20' 
                : 'bg-gradient-to-b from-black/70 via-black/60 to-black/50'
            }`}></div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'
              }`}
            />
          ))}
        </div>

        {/* Hero Content - Always visible with better contrast */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
              {carouselImages[currentSlide].title}
            </h1>
            
            <p className="text-xl lg:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-xl">
              {carouselImages[currentSlide].subtitle}
            </p>

            {/* Enhanced Search Bar - Always on white background */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-grow relative group">
                    <input
                      type="text"
                      placeholder="Search by title, author, or genre..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full px-6 py-4 pr-12 rounded-2xl text-gray-900 bg-white/95 backdrop-blur-xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/75 focus:ring-offset-4 focus:ring-offset-white/50 transition-all duration-300 text-lg border-2 border-white/50 hover:border-blue-300 hover:shadow-3xl z-40"
                    />
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors z-40" />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-8 py-4 rounded-2xl hover:from-blue-800 hover:to-blue-700 shadow-2xl flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/50 border border-blue-700 z-40"
                  >
                    <Filter className="h-5 w-5" />
                    <span className="font-semibold">Filters</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#f8fafc" fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-12 border border-gray-100/50 animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-900 rounded-lg">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Advanced Filters</h3>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 transition-all bg-white/80 text-gray-900"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 transition-all bg-white/80"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price ($)</label>
                <input
                  type="number"
                  placeholder="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 transition-all bg-white/80"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={clearFilters}
                className="text-blue-900 hover:text-blue-700 font-semibold flex items-center space-x-2 transition-colors group"
              >
                <X className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                <span>Clear All Filters</span>
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-3 rounded-xl hover:from-blue-800 hover:to-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Featured Books Section - Only show when NOT searching */}
        {!isSearching && featuredBooks.length > 0 && (
          <div className="mb-16 mt-20">
            <div className="flex items-center mb-8">
              <div className="p-2 bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 ml-3">Featured Books</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </div>
        )}

        {/* Search Results / All Books Section */}
        <div id="books">
          <div className="flex items-center mb-8">
            <div className="p-2 bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg">
              <Book className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 ml-3">
              {isSearching ? `${books.length} Search Results` : 'All Books'}
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-900 border-t-transparent absolute top-0 left-0"></div>
              </div>
              <p className="mt-6 text-gray-600 font-medium">
                {isSearching ? 'Searching books...' : 'Loading books...'}
              </p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-20 bg-white/95 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-100">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <Book className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-2xl font-semibold text-gray-900 mb-2">
                {isSearching ? 'No books found' : 'No books available'}
              </p>
              <p className="text-gray-600 mb-6">
                {isSearching 
                  ? 'Try adjusting your search or filters' 
                  : 'Check back soon for new arrivals'
                }
              </p>
              {isSearching && (
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-8 py-3 rounded-xl hover:from-blue-800 hover:to-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;


