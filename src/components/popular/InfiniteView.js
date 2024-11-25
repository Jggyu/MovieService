// src/components/popular/InfiniteView.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faArrowUp, 
  faHeart,
  faCalendarAlt,
  faLanguage,
  faThumbsUp,
  faFilm
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { authService } from '../../services/authService';
import { wishlistService } from '../../services/wishlistService';

const InfiniteView = ({ apiKey }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const observer = useRef();
  const loadingRef = useRef(null);
  const currentUser = authService.getCurrentUser();

  const fetchMovies = async (pageNum) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${pageNum}`
      );
      
      const newMovies = response.data.results;
      setMovies(prev => [...prev, ...newMovies]);
      setHasMore(pageNum < Math.min(response.data.total_pages, 500));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const lastMovieRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleWishlistToggle = (movie) => {
    if (!currentUser) return;
    wishlistService.toggleWishlist(currentUser, movie);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie, index) => (
          <motion.div
            key={`${movie.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative group"
            ref={index === movies.length - 1 ? lastMovieRef : null}
          >
            {/* Movie Card */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform 
                          transition-all duration-300 group-hover:scale-105">
              <div className="relative aspect-[2/3]">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

                {/* Basic Info (Always Visible) */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg line-clamp-2">{movie.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                    <span className="text-white">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-gray-300">
                      ({new Date(movie.release_date).getFullYear()})
                    </span>
                  </div>
                </div>

                {/* Overlay (Visible on Hover) */}
                <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300 p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">{movie.title}</h3>
                      <p className="text-sm text-gray-400">{movie.original_title}</p>
                    </div>

                    <p className="text-sm text-gray-300 line-clamp-6">
                      {movie.overview || "줄거리 정보가 없습니다."}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-300">
                        <FontAwesomeIcon icon={faCalendarAlt} className="w-5 text-blue-400" />
                        <span className="ml-2">
                          {new Date(movie.release_date).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <FontAwesomeIcon icon={faLanguage} className="w-5 text-purple-400" />
                        <span className="ml-2">
                          {movie.original_language.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <FontAwesomeIcon icon={faThumbsUp} className="w-5 text-green-400" />
                        <span className="ml-2">
                          {movie.vote_count.toLocaleString()}명이 평가
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-3">
                    <motion.button
                      onClick={() => setSelectedMovie(movie)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium
                               hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faFilm} className="mr-2" />
                      상세정보
                    </motion.button>
                    <motion.button
                      onClick={() => handleWishlistToggle(movie)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center
                                ${wishlistService.isInWishlist(currentUser, movie.id)
                                  ? 'bg-red-600 text-white hover:bg-red-700'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      <FontAwesomeIcon icon={faHeart} className="mr-2" />
                      찜하기
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {loading && (
        <div ref={loadingRef} className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      <AnimatePresence>
        {showTopButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full 
                     shadow-lg hover:bg-blue-700 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Movie Detail Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setSelectedMovie(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gray-900 rounded-xl max-w-2xl w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal content */}
              {/* Add detailed movie information here */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InfiniteView;