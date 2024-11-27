// src/components/home/MovieRow.js - Part 1
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faCalendar, 
  faFilm,
  faPlay,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

const MovieRow = ({ title, fetchUrl }) => {
  const [movies, setMovies] = useState([]);
  const [scrollX, setScrollX] = useState(0);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState({});
  const rowRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const apiKey = localStorage.getItem('TMDb-Key');
  const MAX_MOVIES = 15; // 최대 표시할 영화 수 제한

  // 장르 정보 가져오기
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

  // 영화 데이터 가져오기
  useEffect(() => {
    const fetchMovies = async () => {
      if (isLoading) return;

      try {
        setIsLoading(true);
        const response = await axios.get(fetchUrl);
        setMovies(response.data.results.slice(0, MAX_MOVIES));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [fetchUrl]);

 // 스크롤 관련 로직
 const calculateScrollMetrics = useCallback(() => {
  if (!rowRef.current) return { maxScroll: 0 };
  
  const container = rowRef.current;
  const containerWidth = container.offsetWidth;
  const itemWidth = isMobile ? 200 : 250; // 카드 크기 증가
  const gap = 20;
  const totalWidth = movies.length * (itemWidth + gap);
  const maxScroll = -(totalWidth - containerWidth + gap);
  
  return { maxScroll, itemWidth };
}, [movies.length, isMobile]);

const scrollToPosition = useCallback((newScrollX) => {
  const { maxScroll } = calculateScrollMetrics();
  const clampedScroll = Math.max(Math.min(newScrollX, 0), maxScroll);
  setScrollX(clampedScroll);
}, [calculateScrollMetrics]);

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

// 반응형 처리
useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    const { maxScroll } = calculateScrollMetrics();
    scrollToPosition(Math.max(scrollX, maxScroll));
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [calculateScrollMetrics, scrollToPosition, scrollX]);

// 이벤트 리스너 설정
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
  <div className="py-6 space-y-4 group select-none">
    <div className="px-4 md:px-8 flex items-center space-x-4">
      <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide 
                    transition-all duration-300 group-hover:text-gray-200">
        {title}
      </h2>
      <div className="h-[2px] flex-grow bg-gradient-to-r from-white/20 to-transparent 
                    transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>

    <div className="relative touch-pan-x" ref={rowRef}>
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-900 to-transparent z-10" />

      {/* Left Arrow */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute left-4 top-1/2 z-20 w-10 h-10 flex items-center justify-center
                 bg-black/50 text-white rounded-full transform -translate-y-1/2 
                 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300
                 border border-white/10 hover:border-white/30"
        onClick={() => handleClick('left')}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </motion.button>

      {/* Movie Cards Container */}
      <div className="overflow-visible px-4">
        <motion.div 
          className="flex gap-5"
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
                w-[200px] md:w-[250px]
                transform-gpu transition-all duration-300
                hover:z-30
              `}
              initial={false}
              whileHover={{
                scale: 1.4,
                transition: { duration: 0.3, ease: "easeOut" }
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
                      className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50
                               flex flex-col justify-between p-4"
                    >
                      {/* Movie Title */}
                      <h3 className="text-white font-bold text-lg leading-tight mb-2">
                        {movie.title}
                      </h3>

                      {/* Movie Info */}
                      <div className="space-y-3">
                        {/* Rating and Year */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-yellow-500/20 px-2 py-1 rounded">
                            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1 text-sm" />
                            <span className="text-yellow-400 text-sm font-medium">
                              {movie.vote_average.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                            {new Date(movie.release_date).getFullYear()}
                          </div>
                        </div>

                        {/* Genres */}
                        {movie.genre_ids && (
                          <div className="flex flex-wrap gap-1">
                            {movie.genre_ids.slice(0, 3).map(genreId => (
                              <span key={genreId} 
                                    className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/80">
                                {genres[genreId]}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Overview */}
                        <p className="text-white/90 text-sm leading-tight line-clamp-4">
                          {movie.overview || "줄거리 정보가 없습니다."}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-2">
                          <button className="flex-1 flex items-center justify-center gap-2 
                                         bg-white/90 hover:bg-white text-black rounded-md py-2 text-sm font-medium
                                         transition-colors duration-200">
                            <FontAwesomeIcon icon={faPlay} />
                            재생
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-2
                                         bg-gray-600/50 hover:bg-gray-600 text-white rounded-md py-2 text-sm font-medium
                                         transition-colors duration-200">
                            <FontAwesomeIcon icon={faFilm} />
                            상세정보
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Right Arrow */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-4 top-1/2 z-20 w-10 h-10 flex items-center justify-center
                 bg-black/50 text-white rounded-full transform -translate-y-1/2 
                 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300
                 border border-white/10 hover:border-white/30"
        onClick={() => handleClick('right')}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </motion.button>
    </div>
  </div>
);
};

export default MovieRow;