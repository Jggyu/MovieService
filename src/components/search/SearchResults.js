// src/components/search/SearchResults.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faHeart,
  faCalendarAlt,
  faLanguage
} from '@fortawesome/free-solid-svg-icons';
import { authService } from '../../services/authService';
import { wishlistService } from '../../services/wishlistService';

const SearchResults = ({ movies, loading }) => {
  const [wishlistStates, setWishlistStates] = useState({});
  const currentUser = authService.getCurrentUser();

  const handleWishlistToggle = (movie) => {
    if (!currentUser) return;

    const wasAdded = wishlistService.toggleWishlist(currentUser, movie);
    setWishlistStates(prev => ({
      ...prev,
      [movie.id]: wasAdded
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">검색 결과가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies.map(movie => (
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg
                        transform transition-all duration-300 group-hover:scale-105">
            <div className="relative aspect-[2/3]">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleWishlistToggle(movie)}
                className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
                          transition-all duration-200 ${
                            wishlistStates[movie.id]
                              ? 'bg-red-500 text-white'
                              : 'bg-black/50 backdrop-blur-sm text-white/70 hover:bg-black/70'
                          }`}
              >
                <FontAwesomeIcon icon={faHeart} />
              </motion.button>

              {/* Movie Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
                  {movie.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center text-yellow-500">
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 
                            transition-all duration-300 p-4 flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm text-gray-300 line-clamp-5 mb-4">
                    {movie.overview || "줄거리 정보가 없습니다."}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-300">
                      <FontAwesomeIcon icon={faCalendarAlt} className="w-4 text-blue-400" />
                      <span className="ml-2">
                        {new Date(movie.release_date).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FontAwesomeIcon icon={faLanguage} className="w-4 text-purple-400" />
                      <span className="ml-2">
                        {movie.original_language.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SearchResults;