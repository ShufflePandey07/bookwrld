import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
  };

  return (
    <div className="group">
      <Link to={`/book/${book._id}`} className="block">
        {/* Card Container */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
          
          {/* Image Container – Fixed 3:4 ratio, full image */}
          <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
            <img
              src={book.imageUrl}
              alt={book.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="lazy"
            />

            {/* Out of Stock Overlay */}
            {book.stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white font-bold text-lg tracking-wider">
                  OUT OF STOCK
                </span>
              </div>
            )}

            {/* Rating Badge */}
            {book.ratings?.average > 0 && (
              <div className="absolute top-3 left-3 bg-white px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-semibold text-gray-800">
                  {book.ratings.average.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Book Details */}
          <div className="p-4 space-y-2">
            <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
              {book.title}
            </h3>

            <p className="text-sm text-gray-600 line-clamp-1">{book.author}</p>

            {/* Price + Add Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-2xl font-bold text-primary-600">
                ${book.price.toFixed(2)}
              </span>

              <button
                onClick={handleAddToCart}
                disabled={book.stock === 0}
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white
                  ${book.stock === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#001f3f]'
                  }
                `}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;