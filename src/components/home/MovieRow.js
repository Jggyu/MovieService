// src/components/home/MovieRow.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovieRow = ({ title, fetchUrl }) => {
  const [movies, setMovies] = useState([]);
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(fetchUrl);
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [fetchUrl]);

  const handleScroll = (direction) => {
    const scrollAmount = 200;
    if (direction === 'left') {
      setScrollX(Math.min(scrollX + scrollAmount, 0));
    } else {
      const maxScroll = -((movies.length * 150) - window.innerWidth);
      setScrollX(Math.max(scrollX - scrollAmount, maxScroll));
    }
  };

  return (
    <div className="px-8 py-8 space-y-4 group">
      <h2 className="text-2xl font-bold text-white tracking-wide ml-2 group-hover:text-gray-300 transition-colors">
        {title}
      </h2>
      <div className="relative">
        {/* Gradient fade effect on sides */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-900 to-transparent z-10" />
        
        {/* Navigation buttons */}
        <button
          className="absolute left-4 top-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/30 
                     text-white text-2xl rounded-full transform -translate-y-1/2 
                     backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300
                     border border-white/20 hover:scale-110"
          onClick={() => handleScroll('left')}
        >
          ❮
        </button>

        {/* Movies container */}
        <div className="overflow-hidden mx-2">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${scrollX}px)` }}
          >
            {movies.map((movie) => (
              <div 
                key={movie.id} 
                className="flex-none w-[200px] mr-4 transform transition-transform duration-300
                         hover:scale-110 hover:z-10 relative group/item"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto rounded-lg shadow-lg hover:shadow-2xl 
                         transition-all duration-300"
                />
                {/* Hover info overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent
                            opacity-0 group-hover/item:opacity-100 transition-opacity duration-300
                            rounded-lg flex flex-col justify-end p-4">
                  <h3 className="text-white font-semibold text-sm">{movie.title}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-green-400 text-xs">
                      {Math.round(movie.vote_average * 10)}% Match
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="absolute right-4 top-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/30 
                     text-white text-2xl rounded-full transform -translate-y-1/2 
                     backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300
                     border border-white/20 hover:scale-110"
          onClick={() => handleScroll('right')}
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default MovieRow;