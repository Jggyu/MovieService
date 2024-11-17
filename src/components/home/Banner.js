// src/components/home/Banner.js
import React from 'react';

const Banner = ({ movie }) => {
    if (!movie) return null;
  
    return (
      <div className="relative h-[80vh] bg-cover bg-center">
        {/* Cinematic backdrop */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-105"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        >
          {/* Multiple gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-transparent" />
        </div>
  
        {/* Content with glass effect */}
        <div className="absolute bottom-0 left-0 w-full p-16 text-white">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-6xl font-bold tracking-tight animate-fade-in-up"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              {movie.title}
            </h1>
            
            <p className="text-xl leading-relaxed max-w-2xl text-gray-200 animate-fade-in-up animation-delay-200">
              {movie.overview}
            </p>
  
            <div className="flex items-center space-x-4 pt-4 animate-fade-in-up animation-delay-400">
              <button className="px-8 py-3 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg 
                             transform hover:scale-105 transition-all duration-300 flex items-center space-x-2
                             shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                <span>▶</span>
                <span>재생</span>
              </button>
              <button className="px-8 py-3 bg-gray-500/30 hover:bg-gray-500/50 text-white font-semibold 
                             rounded-lg backdrop-blur-sm transform hover:scale-105 transition-all duration-300
                             flex items-center space-x-2 border border-white/20">
                <span>ℹ</span>
                <span>상세 정보</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default Banner;