import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const MovieRow = ({ title, fetchUrl }) => {
  const [movies, setMovies] = useState([]);
  const [scrollX, setScrollX] = useState(0);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const rowRef = useRef(null);
  const [isWheeling, setIsWheeling] = useState(false);
  const wheelingTimeoutRef = useRef(null);

  const fetchMovies = useCallback(async (pageNum) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${fetchUrl}&page=${pageNum}`);
      if (pageNum === 1) {
        setMovies(response.data.results);
      } else {
        setMovies(prev => [...prev, ...response.data.results]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setIsLoading(false);
    }
  }, [fetchUrl]);

  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  // 스크롤 핸들링 함수 수정
  const handleScroll = useCallback((direction, amount = window.innerWidth * 0.8) => {
    const maxScroll = -((movies.length * 240) - window.innerWidth);
    const newScrollX = direction === 'left' 
      ? Math.min(scrollX + amount, 0)
      : Math.max(scrollX - amount, maxScroll);

    setScrollX(newScrollX);

    if (newScrollX < maxScroll + 500 && !isLoading) {
      setPage(prev => prev + 1);
      fetchMovies(page + 1);
    }
  }, [scrollX, movies.length, isLoading, page, fetchMovies]);

  // 휠 이벤트 핸들러
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    if (isWheeling) return;
    
    setIsWheeling(true);
    
    // 휠 방향 감지 (deltaY가 양수면 아래로/오른쪽으로, 음수면 위로/왼쪽으로)
    const direction = e.deltaY > 0 ? 'right' : 'left';
    
    // 스크롤 양을 휠 델타에 비례하게 설정
    const scrollAmount = Math.min(Math.abs(e.deltaY * 2), window.innerWidth * 0.4);
    handleScroll(direction, scrollAmount);

    // 디바운싱
    if (wheelingTimeoutRef.current) {
      clearTimeout(wheelingTimeoutRef.current);
    }
    
    wheelingTimeoutRef.current = setTimeout(() => {
      setIsWheeling(false);
    }, 150);
  }, [isWheeling, handleScroll]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
  };

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const diff = (startX - currentX) * 1.5;
    const maxScroll = -((movies.length * 240) - window.innerWidth);
    
    const newScrollX = Math.max(Math.min(scrollX - diff, 0), maxScroll);
    setScrollX(newScrollX);
    setStartX(currentX);

    if (newScrollX < maxScroll + 500 && !isLoading) {
      setPage(prev => prev + 1);
      fetchMovies(page + 1);
    }
  }, [isDragging, startX, movies.length, scrollX, page, isLoading, fetchMovies]);

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const row = rowRef.current;
    if (row) {
      // 이벤트 리스너들 추가
      row.addEventListener('wheel', handleWheel, { passive: false });
      row.addEventListener('touchstart', handleDragStart, { passive: true });
      row.addEventListener('touchmove', handleDragMove, { passive: true });
      row.addEventListener('touchend', handleDragEnd);
      row.addEventListener('mousedown', handleDragStart);
      row.addEventListener('mousemove', handleDragMove);
      row.addEventListener('mouseup', handleDragEnd);
      row.addEventListener('mouseleave', handleDragEnd);

      return () => {
        // 클린업: 이벤트 리스너들 제거
        row.removeEventListener('wheel', handleWheel);
        row.removeEventListener('touchstart', handleDragStart);
        row.removeEventListener('touchmove', handleDragMove);
        row.removeEventListener('touchend', handleDragEnd);
        row.removeEventListener('mousedown', handleDragStart);
        row.removeEventListener('mousemove', handleDragMove);
        row.removeEventListener('mouseup', handleDragEnd);
        row.removeEventListener('mouseleave', handleDragEnd);
        
        if (wheelingTimeoutRef.current) {
          clearTimeout(wheelingTimeoutRef.current);
        }
      };
    }
  }, [handleDragMove, handleWheel]);

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

      <div className="relative" ref={rowRef}>
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-900 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-900 to-transparent z-10" />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute left-4 top-1/2 z-20 w-12 h-12 flex items-center justify-center
                   bg-black/50 text-white rounded-full transform -translate-y-1/2 
                   backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300
                   border border-white/10 hover:border-white/30"
          onClick={() => handleScroll('left')}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        <div className="overflow-visible mx-4">
          <motion.div 
            className="flex gap-12 px-8"
            animate={{ x: scrollX }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {movies.map((movie) => (
              <motion.div 
                key={movie.id}
                className="relative flex-none w-[180px] md:w-[200px] lg:w-[220px]
                         transform-gpu transition-all duration-300"
                initial={{ scale: 1 }}
                whileHover={{ 
                  scale: 1.3,
                  zIndex: 30,
                  transition: { duration: 0.2 }
                }}
                onHoverStart={() => setHoveredMovie(movie.id)}
                onHoverEnd={() => setHoveredMovie(null)}
              >
                <div className="relative rounded-lg overflow-hidden aspect-[2/3] bg-gray-800
                             shadow-lg transition-all duration-300 hover:shadow-2xl">
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
          onClick={() => handleScroll('right')}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default MovieRow;