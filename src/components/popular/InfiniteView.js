// src/components/popular/InfiniteView.js - Part 1
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
  const [wishlistStates, setWishlistStates] = useState({});
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

      // Update wishlist states for new movies
      if (currentUser) {
        const states = { ...wishlistStates };
        newMovies.forEach(movie => {
          states[movie.id] = wishlistService.isInWishlist(currentUser, movie.id);
        });
        setWishlistStates(states);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer setup
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

    const wasAdded = wishlistService.toggleWishlist(currentUser, movie);
    setWishlistStates(prev => ({
      ...prev,
      [movie.id]: wasAdded
    }));
  };
// src/components/popular/InfiniteView.js - Part 2
return (
  <>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
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
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform 
                        transition-all duration-300 group-hover:scale-105">
            <div className="relative aspect-[2/3]">
              {/* Movie Poster */}
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

              {/* Wishlist Button - Always Visible */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleWishlistToggle(movie);
                }}
                className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
                          transition-all duration-200 z-10 ${
                            wishlistStates[movie.id]
                              ? 'bg-red-500 text-white'
                              : 'bg-black/50 backdrop-blur-sm text-white/70 hover:bg-black/70'
                          }`}
              >
                <FontAwesomeIcon 
                  icon={faHeart} 
                  className={`transition-transform duration-200 ${
                    wishlistStates[movie.id] ? 'scale-110' : 'scale-100'
                  }`}
                />
              </motion.button>

              {/* Basic Info (Always Visible) */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-base md:text-lg line-clamp-2 mb-1">
                  {movie.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" />
                    <span className="text-white">{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-300">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/95 opacity-0 group-hover:opacity-100 
                            transition-all duration-300 p-4 flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <div className="space-y-3">
                    {/* Title Section */}
                    <div>
                      <h3 className="text-white font-bold text-base mb-0.5 line-clamp-2">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {movie.original_title}
                      </p>
                    </div>

                    {/* Overview */}
                    <p className="text-xs text-gray-300 line-clamp-4">
                      {movie.overview || "줄거리 정보가 없습니다."}
                    </p>

                    {/* Movie Details */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center text-gray-300">
                        <FontAwesomeIcon icon={faCalendarAlt} className="w-3.5 text-blue-400" />
                        <span className="ml-2">
                          {new Date(movie.release_date).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <FontAwesomeIcon icon={faLanguage} className="w-3.5 text-purple-400" />
                        <span className="ml-2">{movie.original_language.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <FontAwesomeIcon icon={faThumbsUp} className="w-3.5 text-green-400" />
                        <span className="ml-2">{movie.vote_count.toLocaleString()}명이 평가</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Loading Indicator */}
    {loading && (
      <div ref={loadingRef} className="flex justify-center items-center py-8">
        <div className="w-10 h-10 rounded-full border-3 border-gray-300 border-t-blue-500 animate-spin"/>
      </div>
    )}

    {/* Scroll to Top Button */}
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
  </>
);
};

export default InfiniteView;