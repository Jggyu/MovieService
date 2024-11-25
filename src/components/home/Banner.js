// src/components/home/Banner.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faInfoCircle, faStar, faCalendar } from '@fortawesome/free-solid-svg-icons';

const Banner = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
      }, 5000); // 5초마다 변경

      return () => clearInterval(interval);
    }
  }, [isHovered, movies.length]);

  if (!movies || movies.length === 0) return null;
  const currentMovie = movies[currentIndex];

  return (
    <div 
      className="relative h-[80vh] bg-cover bg-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          {/* Cinematic backdrop */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-105"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-transparent" />
          </div>

          {/* Content with glass effect */}
          <div className="absolute bottom-0 left-0 w-full p-16 text-white">
            <div className="max-w-4xl space-y-6">
              <h1 className="text-6xl font-bold tracking-tight"
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                {currentMovie.title}
              </h1>

              <div className="flex items-center space-x-4 text-lg">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                  <span>{currentMovie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                  <span>{new Date(currentMovie.release_date).getFullYear()}</span>
                </div>
              </div>
              
              <p className="text-xl leading-relaxed max-w-2xl text-gray-200">
                {currentMovie.overview}
              </p>

              <div className="flex items-center space-x-4 pt-4">
                <button className="px-8 py-3 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg 
                               transform hover:scale-105 transition-all duration-300 flex items-center space-x-2
                               shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  <FontAwesomeIcon icon={faPlay} />
                  <span>재생</span>
                </button>
                <button className="px-8 py-3 bg-gray-500/30 hover:bg-gray-500/50 text-white font-semibold 
                               rounded-lg backdrop-blur-sm transform hover:scale-105 transition-all duration-300
                               flex items-center space-x-2 border border-white/20">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span>상세 정보</span>
                </button>
              </div>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {movies.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 transition-all duration-300 cursor-pointer
                  ${idx === currentIndex 
                    ? 'w-10 bg-white' 
                    : 'w-4 bg-white/50 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Banner;