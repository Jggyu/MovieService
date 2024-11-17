// src/components/home/Banner.js
import React from 'react';

const Banner = ({ movie }) => {
  if (!movie) return null;

  return (
    <div 
      className="relative h-[60vh] bg-cover bg-center"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      <div className="absolute bottom-0 left-0 p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
        <p className="text-lg max-w-2xl mb-4">{movie.overview}</p>
        <div className="space-x-4">
          <button className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-opacity-80">
            재생
          </button>
          <button className="px-6 py-2 bg-gray-500 text-white font-bold rounded hover:bg-opacity-80">
            상세 정보
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;