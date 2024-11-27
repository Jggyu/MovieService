// src/components/home/Banner.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faCalendar,
  faFilm,
  faLanguage,
  faInfo,
  faQuoteLeft,
  faTicket
} from '@fortawesome/free-solid-svg-icons';

const Banner = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [genres, setGenres] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const apiKey = localStorage.getItem('TMDb-Key');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 장르 정보 가져오기
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ko-KR`
        );
        const data = await response.json();
        const genreMap = {};
        data.genres.forEach(genre => {
          genreMap[genre.id] = genre.name;
        });
        setGenres(genreMap);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, [apiKey]);

  // 자동 슬라이드
  useEffect(() => {
    if (!isMobile && !isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered, movies.length, isMobile]);

  if (!movies || movies.length === 0) return null;
  const currentMovie = movies[currentIndex];

  return (
    <div 
      className="relative h-[80vh] bg-cover bg-center"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-300
                     ${!isMobile && isHovered ? 'scale-105' : 'scale-100'}`}
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end md:justify-center p-8 md:p-16">
            <div className="max-w-4xl space-y-4 md:space-y-6">
              {/* Title */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white"
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                {currentMovie.title}
              </h1>

              {/* Movie Info Row */}
              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
                <div className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-full">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-2" />
                  <span className="text-yellow-400 font-medium">
                    {currentMovie.vote_average.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center px-3 py-1 bg-gray-800/50 rounded-full">
                  <FontAwesomeIcon icon={faCalendar} className="text-gray-400 mr-2" />
                  <span className="text-gray-300">
                    {new Date(currentMovie.release_date).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="flex items-center px-3 py-1 bg-gray-800/50 rounded-full">
                  <FontAwesomeIcon icon={faLanguage} className="text-gray-400 mr-2" />
                  <span className="text-gray-300 uppercase">
                    {currentMovie.original_language}
                  </span>
                </div>
              </div>

              {/* Genres */}
              {currentMovie.genre_ids && (
                <div className="flex flex-wrap gap-2">
                  {currentMovie.genre_ids.map(genreId => (
                    <span
                      key={genreId}
                      className="px-3 py-1 bg-gray-800/40 backdrop-blur-sm rounded-full
                               text-xs md:text-sm text-white/90 border border-white/10"
                    >
                      {genres[genreId]}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Overview */}
              <p className="text-sm md:text-base leading-relaxed text-gray-300 max-w-2xl
                         line-clamp-3 md:line-clamp-4">
                {currentMovie.overview || "줄거리 정보가 없습니다."}
              </p>

              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faTicket} className="text-gray-300" />
                <span className="text-sm md:text-base text-gray-300">
                  Popularity: {currentMovie.popularity.toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="absolute bottom-6 right-6 flex space-x-2">
            {movies.map((_, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.2 }}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 rounded-full cursor-pointer transition-all duration-300
                  ${idx === currentIndex 
                    ? 'w-8 md:w-10 bg-white' 
                    : 'w-2 md:w-3 bg-white/50 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Banner;