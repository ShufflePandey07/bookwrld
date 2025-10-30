
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload, Calendar, BookOpen, Tag, DollarSign, Hash, Globe, Star } from 'lucide-react';
import api from '../../utils/api';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    category: 'Fiction',
    isbn: '',
    publisher: '',
    publishedDate: '',
    pages: '',
    language: 'English',
    imageUrl: '',
    stock: '',
    featured: false
  });

  const categories = [
    'Fiction', 'Non-Fiction', 'Science', 'History', 'Biography',
    'Children', 'Romance', 'Mystery', 'Fantasy', 'Self-Help',
    'Technology', 'Business'
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books?limit=1000');
      setBooks(data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price,
        category: book.category,
        isbn: book.isbn || '',
        publisher: book.publisher || '',
        publishedDate: book.publishedDate ? book.publishedDate.split('T')[0] : '',
        pages: book.pages || '',
        language: book.language,
        imageUrl: book.imageUrl,
        stock: book.stock,
        featured: book.featured
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '', author: '', description: '', price: '', category: 'Fiction',
        isbn: '', publisher: '', publishedDate: '', pages: '', language: 'English',
        imageUrl: '', stock: '', featured: false
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBook(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, formData);
      } else {
        await api.post('/books', formData);
      }
      fetchBooks();
      handleCloseModal();
      alert(editingBook ? 'Book updated successfully' : 'Book created successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save book');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
      alert('Book deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete book');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-navy-900 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Manage Books</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Book</span>
          </button>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book._id} className="bg-white">
                    <td className="px-6 py-4">
                      <img src={book.imageUrl} alt={book.title} className="w-12 h-16 object-cover rounded-lg shadow-sm" />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 text-gray-700">{book.author}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-900 rounded-full">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">${book.price}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {book.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleOpenModal(book)}
                          className="text-blue-900 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-lg">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                    <BookOpen className="h-8 w-8 text-blue-900" />
                    <span>{editingBook ? 'Edit Book' : 'Add New Book'}</span>
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Image Preview & URL */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <label className="flex items-center space-x-2 text-blue-900 font-semibold mb-3">
                          <Upload className="h-5 w-5" />
                          <span>Book Cover</span>
                        </label>
                        <input
                          type="url"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                          placeholder="https://example.com/cover.jpg"
                        />
                      </div>
                      <div className="md:w-32">
                        {formData.imageUrl ? (
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg shadow-md border border-gray-300"
                            onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image'}
                          />
                        ) : (
                          <div className="bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg w-full h-48 flex items-center justify-center">
                            <Upload className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Main Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <label className="text-blue-900 font-semibold flex items-center space-x-2 mb-2">
                        <BookOpen className="h-5 w-5" />
                        <span>Title *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    {/* Author & Category */}
                    <div>
                      <label className="text-blue-900 font-semibold flex items-center space-x-2 mb-2">
                        <span>Author *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="text-blue-900 font-semibold flex items-center space-x-2 mb-2">
                        <Tag className="h-5 w-5" />
                        <span>Category *</span>
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent appearance-none"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price & Stock */}
                    <div>
                      <label className="text-blue-900 font-semibold flex items-center space-x-2 mb-2">
                        <DollarSign className="h-5 w-5" />
                        <span>Price *</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="text-blue-900 font-semibold flex items-center space-x-2 mb-2">
                        <Hash className="h-5 w-5" />
                        <span>Stock *</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    {/* ISBN & Publisher */}
                    <div>
                      <label className="text-blue-900 font-semibold flex items-center space-x-2 mb-2">
                        <Hash className="h-5 w-5" />
                        <span>ISBN</span>
                      </label>
                      <input
                        type="text"
                        value={formData.isbn}
                        onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="text-blue-900 font-semibold flex items-center space-x-2 mb-2">
                        <span>Publisher</span>
                      </label>
                      <input
                        type="text"
                        value={formData.publisher}
                        onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    {/* Published Date & Pages */}
                    <div>
                      <label className="text-blue-900 font-semibold flex items-center space-x-2 mb-2">
                        <Calendar className="h-5 w-5" />
                        <span>Published Date</span>
                      </label>
                      <input
                        type="date"
                        value={formData.publishedDate}
                        onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="text-blue-900 font-semibold flex items-center space-x-2 mb-2">
                        <span>Pages</span>
                      </label>
                      <input
                        type="number"
                        value={formData.pages}
                        onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    {/* Language & Featured */}
                    <div>
                      <label className="text-blue-900 font-semibold flex items-center space-x-2 mb-2">
                        <Globe className="h-5 w-5" />
                        <span>Language</span>
                      </label>
                      <input
                        type="text"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center space-x-3 mt-8">
                      <label className="text-blue-900 font-semibold flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-5 h-5 text-blue-900 bg-white border-gray-300 rounded focus:ring-blue-900"
                        />
                        <Star className="h-5 w-5 text-blue-900" />
                        <span>Mark as Featured</span>
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-blue-900 font-semibold flex items-center space-x-2 mb-2">
                      <span>Description *</span>
                    </label>
                    <textarea
                      required
                      rows="4"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-900 text-white font-bold py-3.5 rounded-lg shadow-md hover:bg-blue-800 flex items-center justify-center space-x-2"
                    >
                      <span>{editingBook ? 'Update Book' : 'Create Book'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 bg-gray-200 text-gray-900 font-semibold py-3.5 rounded-lg border border-gray-300 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooks;