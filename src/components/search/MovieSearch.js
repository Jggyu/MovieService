// src/components/search/MovieSearch.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilter,
  faTimes,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import Header from '../layout/Header';
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Search Header */}
        <div className="text-center space-y-4 mb-8">
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
        <div className="mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl
                     text-white flex items-center justify-between backdrop-blur-sm"
          >
            <span className="flex items-center">
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              필터 설정
            </span>
            <FontAwesomeIcon icon={isFilterOpen ? faChevronUp : faChevronDown} />
          </motion.button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <SearchFilters
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active Filters */}
        <FilterChips filters={filters} onRemove={handleFilterChange} />

        {/* Results */}
        <SearchResults 
          movies={movies} 
          loading={loading}
        />
      </div>
    </div>
  );
};

export default MovieSearch;