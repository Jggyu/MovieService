// src/components/search/MovieSearch.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch,
  faFilter,
  faTimes,
  faSort
} from '@fortawesome/free-solid-svg-icons';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import FilterChips from './FilterChips';

const MovieSearch = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    genre: [],
    rating: null,
    year: null,
    sort: 'popularity.desc',
    language: []
  });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiKey = localStorage.getItem('TMDb-Key');

  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const baseUrl = 'https://api.themoviedb.org/3/discover/movie';
      const filterParams = new URLSearchParams({
        api_key: apiKey,
        language: 'ko-KR',
        sort_by: filters.sort,
        ...(filters.genre.length && { with_genres: filters.genre.join(',') }),
        ...(filters.year && { primary_release_year: filters.year }),
        ...(filters.rating && { 'vote_average.gte': filters.rating }),
        ...(filters.language.length && { with_original_language: filters.language.join(',') })
      });

      const response = await fetch(`${baseUrl}?${filterParams}`);
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      genre: [],
      rating: null,
      year: null,
      sort: 'popularity.desc',
      language: []
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black px-4 py-24"
    >
      {/* Search Header */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent 
                     bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
          >
            영화 찾아보기
          </motion.h1>
          <p className="text-gray-400">
            다양한 필터로 원하는 영화를 찾아보세요
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(true)}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl
                     text-white flex items-center space-x-2 backdrop-blur-sm"
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>필터</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetFilters}
            className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500
                     rounded-xl flex items-center space-x-2 backdrop-blur-sm"
          >
            <FontAwesomeIcon icon={faTimes} />
            <span>초기화</span>
          </motion.button>
        </div>

        {/* Active Filters */}
        <FilterChips filters={filters} onRemove={handleFilterChange} />

        {/* Results */}
        <SearchResults 
          movies={movies} 
          loading={loading}
        />
      </div>

      {/* Filter Sidebar */}
      <AnimatePresence>
        {isFilterOpen && (
          <SearchFilters
            filters={filters}
            onChange={handleFilterChange}
            onClose={() => setIsFilterOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MovieSearch;