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
    <div className="px-4 space-y-2">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="relative">
        <button
          className="absolute left-0 top-1/2 z-10 bg-black/50 text-white p-2 rounded-full transform -translate-y-1/2"
          onClick={() => handleScroll('left')}
        >
          &#8249;
        </button>
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${scrollX}px)` }}
          >
            {movies.map((movie) => (
              <div 
                key={movie.id} 
                className="flex-none w-[150px] mr-2"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto rounded-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          className="absolute right-0 top-1/2 z-10 bg-black/50 text-white p-2 rounded-full transform -translate-y-1/2"
          onClick={() => handleScroll('right')}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default MovieRow;