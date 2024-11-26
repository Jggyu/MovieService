// src/components/search/MovieSearch.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilter,
  faTimes,
  faChevronDown,
  faChevronUp,
  faSearch,
  faTimes as faSearchClear
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const apiKey = localStorage.getItem('TMDb-Key');

  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      return () => {
        clearTimeout(timer);
      };
    }, [value, delay]);
  
    return debouncedValue;
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (!isSearching) {
      fetchMovies(currentPage);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      handleSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  const fetchMovies = async (page = 1) => {
    setLoading(true);
    try {
      const baseUrl = 'https://api.themoviedb.org/3/discover/movie';
      const filterParams = new URLSearchParams({
        api_key: apiKey,
        language: 'ko-KR',
        page: page.toString(),
        sort_by: filters.sort,
        ...(filters.genre.length && { with_genres: filters.genre.join(',') }),
        ...(filters.year && { primary_release_year: filters.year }),
        ...(filters.rating && { 'vote_average.gte': filters.rating }),
        ...(filters.language.length && { with_original_language: filters.language.join(',') })
      });

      const response = await fetch(`${baseUrl}?${filterParams}`);
      const data = await response.json();
      
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      fetchMovies(1);
      return;
    }

    setIsSearching(true);
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ko-KR&query=${encodeURIComponent(query)}&page=1`
      );
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setCurrentPage(1);
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setCurrentPage(1);
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

        {/* Search Bar with Enhanced Animation */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="영화 제목으로 검색하기"
              className="w-full bg-white/10 text-white placeholder-gray-400 
                        rounded-xl px-12 py-4 backdrop-blur-sm
                        border border-white/10 focus:border-blue-500
                        focus:ring-1 focus:ring-blue-500 outline-none
                        transition-all duration-300"
            />
            <FontAwesomeIcon 
              icon={faSearch}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2
                            text-gray-400 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faSearchClear} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 left-0 right-0 text-center text-gray-400"
              >
                "{searchQuery}" 검색 결과
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filter Controls & Results 부분은 그대로 유지 */}
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

        {/* Results with Enhanced Props */}
        <SearchResults 
          movies={isSearching ? searchResults : movies} 
          loading={loading}
          isSearching={isSearching}
          searchQuery={searchQuery}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default MovieSearch;