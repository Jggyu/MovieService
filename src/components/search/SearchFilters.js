// src/components/search/SearchFilters.js
import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSort,
  faStar,
  faFilm,
  faGlobe,
  faCalendarAlt,
  faRotateLeft
} from '@fortawesome/free-solid-svg-icons';

const SearchFilters = ({ filters, onChange, onReset }) => {
  // 장르 목록
  const genres = [
    { id: 28, name: '액션' },
    { id: 12, name: '모험' },
    { id: 16, name: '애니메이션' },
    { id: 35, name: '코미디' },
    { id: 80, name: '범죄' },
    { id: 99, name: '다큐멘터리' },
    { id: 18, name: '드라마' },
    { id: 10751, name: '가족' },
    { id: 14, name: '판타지' },
    { id: 36, name: '역사' },
    { id: 27, name: '공포' },
    { id: 10402, name: '음악' },
    { id: 9648, name: '미스터리' },
    { id: 10749, name: '로맨스' },
    { id: 878, name: 'SF' },
    { id: 53, name: '스릴러' },
    { id: 10752, name: '전쟁' },
    { id: 37, name: '서부' }
  ];

  // 정렬 옵션
  const sortOptions = [
    { value: 'popularity.desc', label: '인기도 높은순' },
    { value: 'popularity.asc', label: '인기도 낮은순' },
    { value: 'vote_average.desc', label: '평점 높은순' },
    { value: 'vote_average.asc', label: '평점 낮은순' },
    { value: 'release_date.desc', label: '최신순' },
    { value: 'release_date.asc', label: '오래된순' }
  ];

  // 언어 옵션
  const languages = [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: '영어' },
    { code: 'ja', name: '일본어' },
    { code: 'zh', name: '중국어' },
    { code: 'es', name: '스페인어' },
    { code: 'fr', name: '프랑스어' }
  ];

  const handleGenreToggle = (genreId) => {
    const newGenres = filters.genre.includes(genreId)
      ? filters.genre.filter(id => id !== genreId)
      : [...filters.genre, genreId];
    
    onChange({ ...filters, genre: newGenres });
  };

  const handleLanguageToggle = (langCode) => {
    const newLanguages = filters.language.includes(langCode)
      ? filters.language.filter(code => code !== langCode)
      : [...filters.language, langCode];
    
    onChange({ ...filters, language: newLanguages });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sort Section */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center">
            <FontAwesomeIcon icon={faSort} className="mr-2 text-purple-500" />
            정렬
          </h3>
          <select
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value })}
            className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-2.5 
                     border border-gray-600 focus:border-blue-500 focus:ring-1 
                     focus:ring-blue-500 outline-none text-sm"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div className="space-y-3">
        <h3 className="text-base font-semibold text-white flex items-center">
            <FontAwesomeIcon icon={faStar} className="mr-2 text-yellow-500" />
            최소 평점
        </h3>
        <div className="space-y-4">
            <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={filters.rating || 0}
            onChange={(e) => {
                const value = parseFloat(e.target.value);
                onChange({ 
                ...filters, 
                rating: value === 0 ? null : value 
                });
            }}
            className="w-full accent-yellow-500"
            />
            <div className="flex justify-between items-center">
            <div className="text-sm text-white">
                {filters.rating ? `${filters.rating}점 이상` : '제한 없음'}
            </div>
            {filters.rating && (
                <button
                onClick={() => onChange({ ...filters, rating: null })}
                className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                초기화
                </button>
            )}
            </div>
        </div>
        </div>

        {/* Year Filter */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-green-500" />
            개봉년도
          </h3>
          <select
            value={filters.year || ''}
            onChange={(e) => onChange({ ...filters, year: e.target.value ? parseInt(e.target.value) : null })}
            className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-2.5 
                     border border-gray-600 focus:border-blue-500 focus:ring-1 
                     focus:ring-blue-500 outline-none text-sm"
          >
            <option value="">전체</option>
            {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}년</option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center">
            <FontAwesomeIcon icon={faGlobe} className="mr-2 text-cyan-500" />
            언어
          </h3>
          <div className="flex flex-wrap gap-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageToggle(lang.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                         ${filters.language.includes(lang.code)
                           ? 'bg-cyan-500 text-white'
                           : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'}`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Genre Filter */}
      <div className="mt-6 space-y-3">
        <h3 className="text-base font-semibold text-white flex items-center">
          <FontAwesomeIcon icon={faFilm} className="mr-2 text-red-500" />
          장르
        </h3>
        <div className="flex flex-wrap gap-2">
          {genres.map(genre => (
            <motion.button
              key={genre.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGenreToggle(genre.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                       ${filters.genre.includes(genre.id)
                         ? 'bg-red-500 text-white'
                         : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'}`}
            >
              {genre.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onReset}
        className="mt-6 px-6 py-2.5 bg-gray-700/50 hover:bg-gray-600/50 
                 text-gray-300 rounded-lg flex items-center justify-center 
                 space-x-2 w-full transition-colors"
      >
        <FontAwesomeIcon icon={faRotateLeft} />
        <span>필터 초기화</span>
      </motion.button>
    </div>
  );
};

export default SearchFilters;