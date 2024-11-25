// src/components/popular/TableView.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChevronLeft, faChevronRight, faHeart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { authService } from '../../services/authService';
import { wishlistService } from '../../services/wishlistService';

const TableView = ({ apiKey }) => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistStates, setWishlistStates] = useState({});
  const moviesPerPage = 6;
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${currentPage}`
        );
        setMovies(response.data.results);
        setTotalPages(Math.min(response.data.total_pages, 500));
        
        // 각 영화의 위시리스트 상태 확인
        if (currentUser) {
          const states = {};
          response.data.results.forEach(movie => {
            states[movie.id] = wishlistService.isInWishlist(currentUser, movie.id);
          });
          setWishlistStates(states);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [apiKey, currentPage, currentUser]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const handleWishlistToggle = (movie) => {
    if (!currentUser) return;

    const wasAdded = wishlistService.toggleWishlist(currentUser, movie);
    setWishlistStates(prev => ({
      ...prev,
      [movie.id]: wasAdded
    }));
  };

  return (
    <div className="space-y-6">
      {/* Table Header */}
      <div className="bg-gray-800 rounded-t-lg">
        <div className="grid grid-cols-14 gap-4 px-6 py-4 text-gray-200 font-semibold items-center">
          <div className="col-span-1 text-center text-sm">#</div>
          <div className="col-span-2 text-sm">포스터</div>
          <div className="col-span-4 text-sm">제목</div>
          <div className="col-span-2 text-center text-sm whitespace-nowrap">개봉일</div>
          <div className="col-span-2 text-center text-sm whitespace-nowrap">평점</div>
          <div className="col-span-2 text-center text-sm whitespace-nowrap">언어</div>
          <div className="col-span-1 text-center text-sm whitespace-nowrap">찜하기</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="bg-gray-900 rounded-b-lg overflow-hidden">
        {movies.slice(0, moviesPerPage).map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="grid grid-cols-14 gap-4 px-6 py-4 items-center border-b border-gray-800 hover:bg-gray-800/50 transition-colors duration-200"
          >
            {/* Rank Number */}
            <div className="col-span-1 text-center text-gray-400 font-medium">
              {(currentPage - 1) * moviesPerPage + index + 1}
            </div>

            {/* Movie Poster */}
            <div className="col-span-2">
              <div className="relative aspect-[2/3] w-16 rounded-lg overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-200"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
              </div>
            </div>

            {/* Title */}
            <div className="col-span-4">
              <div className="font-medium text-white hover:text-blue-400 cursor-pointer transition-colors truncate">
                {movie.title}
              </div>
              <div className="text-sm text-gray-400 truncate">
                {movie.original_title}
              </div>
            </div>

            {/* Release Date */}
            <div className="col-span-2 text-center text-gray-300">
              {new Date(movie.release_date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>

            {/* Rating */}
            <div className="col-span-2 text-center">
              <div className="inline-flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded-full">
                <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                <span className="text-white">{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>

            {/* Language */}
            <div className="col-span-2 text-center">
              <span className="px-3 py-1 rounded-full text-xs font-medium 
                             bg-gray-700 text-gray-300 uppercase">
                {movie.original_language}
              </span>
            </div>

            {/* Wishlist Button - 수정됨 */}
            <div className="col-span-1 text-center">
              <motion.button
                onClick={() => handleWishlistToggle(movie)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-8 h-8 rounded-full transition-all duration-200
                          flex items-center justify-center
                          ${wishlistStates[movie.id] 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-red-500'}`}
              >
                <FontAwesomeIcon 
                  icon={faHeart} 
                  className={`transition-transform duration-200
                            ${wishlistStates[movie.id] ? 'scale-110' : 'scale-100'}`}
                />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50
                   transition-all hover:bg-gray-700"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div className="flex items-center space-x-2">
          {currentPage > 2 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-4 py-2 rounded-lg hover:bg-gray-800 text-white"
              >
                1
              </button>
              {currentPage > 3 && <span className="text-white">...</span>}
            </>
          )}

          {[...Array(5)].map((_, i) => {
            const pageNum = currentPage - 2 + i;
            if (pageNum > 0 && pageNum <= totalPages) {
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-800 text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
            return null;
          })}

          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && <span className="text-white">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-4 py-2 rounded-lg hover:bg-gray-800 text-white"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50
                   transition-all hover:bg-gray-700"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default TableView;