import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const MovieRow = ({ title, fetchUrl }) => {
  const [movies, setMovies] = useState([]);
  const [scrollX, setScrollX] = useState(0);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const rowRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 영화 데이터 가져오기 (무한 스크롤)
  const fetchMovies = useCallback(async (pageNum) => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`${fetchUrl}&page=${pageNum}`);
      const newMovies = response.data.results;
      
      if (newMovies.length > 0) {
        setMovies(prev => [...prev, ...newMovies]);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUrl, hasMore, isLoading]);

  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  const calculateScrollMetrics = useCallback(() => {
    if (!rowRef.current) return { maxScroll: 0 };
    
    const container = rowRef.current;
    const containerWidth = container.offsetWidth;
    const itemWidth = isMobile ? 180 : 220;
    const gap = 32;
    const totalWidth = movies.length * (itemWidth + gap);
    const maxScroll = -(totalWidth - containerWidth + gap);
    
    return { maxScroll, itemWidth };
  }, [movies.length, isMobile]);

  const scrollToPosition = useCallback((newScrollX) => {
    const { maxScroll } = calculateScrollMetrics();
    const clampedScroll = Math.max(Math.min(newScrollX, 0), maxScroll);
    setScrollX(clampedScroll);

    // 끝에 가까워지면 더 많은 영화 로드
    if (clampedScroll <= maxScroll + 500 && hasMore && !isLoading) {
      fetchMovies(page);
    }
  }, [calculateScrollMetrics, hasMore, isLoading, page, fetchMovies]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const sensitivity = 1.5;
    const delta = e.deltaY * sensitivity;
    scrollToPosition(scrollX - delta);
  }, [scrollX, scrollToPosition]);

  const handleClick = useCallback((direction) => {
    const moveAmount = window.innerWidth * 0.8;
    scrollToPosition(scrollX + (direction === 'left' ? moveAmount : -moveAmount));
  }, [scrollX, scrollToPosition]);

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
    element.addEventListener('touchstart', handleDragStart, { passive: true });
    element.addEventListener('touchmove', handleDragMove, { passive: true });
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
    <div className="py-8 space-y-4 group select-none">
      <div className="px-8 flex items-center space-x-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide 
                      transition-all duration-300 group-hover:text-gray-200">
          {title}
        </h2>
        <div className="h-[2px] flex-grow bg-gradient-to-r from-white/20 to-transparent 
                      transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </div>

      <div 
        className="relative touch-pan-x" 
        ref={rowRef}
        style={{ willChange: 'transform' }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-900 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-900 to-transparent z-10" />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute left-4 top-1/2 z-20 w-12 h-12 flex items-center justify-center
                   bg-black/50 text-white rounded-full transform -translate-y-1/2 
                   backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300
                   border border-white/10 hover:border-white/30"
          onClick={() => handleClick('left')}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        <div className="overflow-visible px-4">
          <motion.div 
            className="flex gap-16"
            style={{ 
              x: scrollX,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            transition={{ 
              type: "spring", 
              stiffness: 50,
              damping: 14,
              mass: 0.8
            }}
          >
            {movies.map((movie) => (
              <motion.div 
                key={movie.id}
                className={`
                  relative flex-none
                  w-[180px] md:w-[200px] lg:w-[220px]
                  transform-gpu transition-all duration-300
                  hover:z-30
                `}
                initial={false}
                whileHover={{
                  scale: 1.5,
                  transition: {
                    duration: 0.3,
                    ease: "easeOut"
                  }
                }}
                onHoverStart={() => setHoveredMovie(movie.id)}
                onHoverEnd={() => setHoveredMovie(null)}
              >
                <div className={`
                  relative rounded-lg overflow-hidden aspect-[2/3]
                  bg-gray-800 shadow-lg
                  transition-all duration-300
                  ${hoveredMovie === movie.id ? 'shadow-2xl ring-2 ring-white/20' : ''}
                `}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <AnimatePresence>
                    {hoveredMovie === movie.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent
                                 flex flex-col justify-end p-4 gap-2"
                      >
                        <h3 className="text-white font-semibold text-lg leading-tight">
                          {movie.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-green-500/20 rounded-md text-green-400 text-sm font-medium">
                            {Math.round(movie.vote_average * 10)}%
                          </span>
                          <span className="text-white/70 text-sm">
                            {new Date(movie.release_date).getFullYear()}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm line-clamp-2 mt-1">
                          {movie.overview}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-4 top-1/2 z-20 w-12 h-12 flex items-center justify-center
                   bg-black/50 text-white rounded-full transform -translate-y-1/2 
                   backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300
                   border border-white/10 hover:border-white/30"
          onClick={() => handleClick('right')}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>

        {isLoading && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/50" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieRow;