import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faCalendar, 
  faHeart,
  faChevronLeft,
  faChevronRight,
  faLanguage
} from '@fortawesome/free-solid-svg-icons';
import { authService } from '../../services/authService';
import { wishlistService } from '../../services/wishlistService';

const MovieRow = ({ title, fetchUrl }) => {
  const [movies, setMovies] = useState([]);
  const [scrollX, setScrollX] = useState(0);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState({});
  const [wishlistStates, setWishlistStates] = useState({});
  const rowRef = useRef(null);
  const sliderRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const apiKey = localStorage.getItem('TMDb-Key');
  const currentUser = authService.getCurrentUser();
  const MAX_MOVIES = 15;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ko-KR`
        );
        const genreMap = {};
        response.data.genres.forEach(genre => {
          genreMap[genre.id] = genre.name;
        });
        setGenres(genreMap);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, [apiKey]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (isLoading) return;
      try {
        setIsLoading(true);
        const response = await axios.get(fetchUrl);
        const movieResults = response.data.results.slice(0, MAX_MOVIES);
        setMovies(movieResults);

        if (currentUser) {
          const states = {};
          movieResults.forEach(movie => {
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
  }, [fetchUrl, currentUser]);

  const calculateScrollMetrics = useCallback(() => {
    if (!sliderRef.current || !rowRef.current) return { maxScroll: 0 };
    
    const container = rowRef.current;
    const slider = sliderRef.current;
    const containerWidth = container.offsetWidth;
    const sliderWidth = slider.scrollWidth;
    const maxScroll = -(sliderWidth - containerWidth);
    
    return { maxScroll };
  }, []);

  const scrollToPosition = useCallback((newScrollX) => {
    const { maxScroll } = calculateScrollMetrics();
    const clampedScroll = Math.max(Math.min(newScrollX, 0), maxScroll);
    setScrollX(clampedScroll);
  }, [calculateScrollMetrics]);

  const handleWheel = useCallback((e) => {
    if (!rowRef.current.contains(e.target)) return;
    e.preventDefault();
    const sensitivity = 1.5;
    const delta = e.deltaY * sensitivity;
    scrollToPosition(scrollX - delta);
  }, [scrollX, scrollToPosition]);

  const handleClick = useCallback((direction) => {
    const { maxScroll } = calculateScrollMetrics();
    const moveAmount = window.innerWidth * 0.6;
    const newScrollX = scrollX + (direction === 'left' ? moveAmount : -moveAmount);
    scrollToPosition(Math.max(Math.min(newScrollX, 0), maxScroll));
  }, [scrollX, scrollToPosition, calculateScrollMetrics]);
  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
  };
  
  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const diff = (startX - currentX) * 1.5;
    scrollToPosition(scrollX - diff);
    setStartX(currentX);
  }, [isDragging, startX, scrollX, scrollToPosition]);
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
 
  const debouncedSetHoveredMovie = useCallback((movieId) => {
    const timer = setTimeout(() => {
      setHoveredMovie(movieId);
    }, 50);
    return () => clearTimeout(timer);
  }, []);
 
  const handleWishlistToggle = useCallback((movie, event) => {
    event.stopPropagation();
    if (!currentUser) return;
 
    const wasAdded = wishlistService.toggleWishlist(currentUser, movie);
    setWishlistStates(prev => ({
      ...prev,
      [movie.id]: wasAdded
    }));
  }, [currentUser]);
 
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      const { maxScroll } = calculateScrollMetrics();
      scrollToPosition(Math.max(scrollX, maxScroll));
    };
 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateScrollMetrics, scrollToPosition, scrollX]);
 
  useEffect(() => {
    const element = rowRef.current;
    if (!element) return;
 
    const options = { passive: false };
    element.addEventListener('wheel', handleWheel, options);
    element.addEventListener('touchstart', handleDragStart);
    element.addEventListener('touchmove', handleDragMove);
    element.addEventListener('touchend', handleDragEnd);
    element.addEventListener('mousedown', handleDragStart);
    element.addEventListener('mousemove', handleDragMove);
    element.addEventListener('mouseup', handleDragEnd);
    element.addEventListener('mouseleave', handleDragEnd);
 
    return () => {
      element.removeEventListener('wheel', handleWheel, options);
      element.removeEventListener('touchstart', handleDragStart);
      element.removeEventListener('touchmove', handleDragMove);
      element.removeEventListener('touchend', handleDragEnd);
      element.removeEventListener('mousedown', handleDragStart);
      element.removeEventListener('mousemove', handleDragMove);
      element.removeEventListener('mouseup', handleDragEnd);
      element.removeEventListener('mouseleave', handleDragEnd);
    };
  }, [handleWheel, handleDragMove]);
 
  return (
    <div className="relative py-8 space-y-4 group select-none">
      <div className="px-4 md:px-8 flex items-center space-x-4">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide 
                      transition-all duration-300 group-hover:text-gray-200 
                      relative">
          {title}
          <div className="absolute -bottom-2 left-0 w-full h-0.5 
                        bg-gradient-to-r from-red-500 to-transparent 
                        transform origin-left scale-x-0 
                        group-hover:scale-x-100 transition-transform duration-500" />
        </h2>
      </div>
 
      <div className="relative touch-pan-x overflow-visible" ref={rowRef}>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.7)' }}
          whileTap={{ scale: 0.9 }}
          className="absolute left-4 top-1/2 z-50 w-12 h-12 
                     flex items-center justify-center
                     bg-black/40 text-white rounded-full 
                     transform -translate-y-1/2 
                     backdrop-blur-sm opacity-0 
                     group-hover:opacity-100 
                     transition-all duration-300
                     border border-white/20 hover:border-white/40
                     shadow-lg shadow-black/50"
          onClick={() => handleClick('left')}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-lg" />
        </motion.button>
 
        <div className="overflow-visible px-4 relative">
          <motion.div 
            ref={sliderRef}
            className="flex gap-12" // 카드 간격 조정
            style={{ 
              x: scrollX,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            transition={{ 
              type: "tween", 
              duration: 0.5,
              ease: "easeInOut"
            }}
          >
            {movies.map((movie) => (
              <motion.div 
                key={movie.id}
                className="relative flex-none w-[180px] md:w-[240px]" // 카드 크기 축소
                initial={false}
                whileHover={{
                  scale: 1.15, // 확대 비율 축소
                  zIndex: 40,
                  transition: { duration: 0.2 }
                }}
                onHoverStart={() => debouncedSetHoveredMovie(movie.id)}
                onHoverEnd={() => setHoveredMovie(null)}
              >
                <div className={`
                  relative rounded-lg overflow-hidden
                  aspect-[2/3] bg-gray-800
                  shadow-lg transition-all duration-300
                  ${hoveredMovie === movie.id 
                    ? 'shadow-2xl shadow-black/50 ring-2 ring-white/30' 
                    : 'shadow-black/20'}
                `}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
 
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleWishlistToggle(movie, e)}
                    className={`
                      absolute top-3 right-3 
                      w-10 h-10 rounded-full
                      flex items-center justify-center 
                      transition-all duration-300 z-50
                      ${wishlistStates[movie.id]
                        ? 'bg-red-600 shadow-lg shadow-red-500/30'
                        : 'bg-black/40 backdrop-blur-sm hover:bg-black/60'}
                    `}
                  >
                    <FontAwesomeIcon 
                      icon={faHeart} 
                      className={`
                        text-white transition-all duration-300
                        ${wishlistStates[movie.id] 
                          ? 'scale-110 drop-shadow-glow' 
                          : 'scale-100 opacity-80'}
                      `}
                    />
                  </motion.button>
 
                  <AnimatePresence>
                    {hoveredMovie === movie.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex flex-col justify-end
                                 bg-gradient-to-t from-black via-black/95 to-transparent
                                 p-4 space-y-2" // space-y-3에서 space-y-2로 조정
                      >
                        <motion.h3 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="text-white font-bold text-sm md:text-base 
                                   leading-tight mb-1" // 텍스트 크기 및 마진 조정
                        >
                          {movie.title}
                        </motion.h3>
 
                        <div className="space-y-2"> {/* space-y-3에서 space-y-2로 조정 */}
                          <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-wrap items-center gap-2"
                          >
                            <div className="flex items-center bg-yellow-500/20 
                                          px-2 py-0.5 rounded-full backdrop-blur-sm">
                              <FontAwesomeIcon 
                                icon={faStar} 
                                className="text-yellow-500 text-xs mr-1" 
                              />
                              <span className="text-yellow-400 text-xs font-semibold">
                                {movie.vote_average.toFixed(1)}
                              </span>
                            </div>
 
                            <div className="flex items-center text-gray-300 text-xs">
                              <FontAwesomeIcon 
                                icon={faCalendar} 
                                className="mr-1 text-gray-400" 
                              />
                              {new Date(movie.release_date).getFullYear()}
                            </div>
                          </motion.div>
 
                          <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/80 text-xs leading-snug
                                     line-clamp-3"
                          >
                            {movie.overview || "줄거리 정보가 없습니다."}
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
 
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.7)' }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-4 top-1/2 z-50 w-12 h-12 
                     flex items-center justify-center<motion.div
                     bg-black/40 text-white rounded-full 
                     transform -translate-y-1/2 
                     backdrop-blur-sm opacity-0 
                     group-hover:opacity-100 
                     transition-all duration-300
                     border border-white/20 hover:border-white/40
                     shadow-lg shadow-black/50"
          onClick={() => handleClick('right')}
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-lg" />
        </motion.button>
      </div>
    </div>
  );
 };
 
 export default MovieRow;