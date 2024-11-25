// src/components/search/FilterChips.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const FilterChips = ({ filters, onRemove }) => {
  // 장르 이름 매핑
  const genres = {
    28: '액션', 12: '모험', 16: '애니메이션', 35: '코미디',
    80: '범죄', 99: '다큐멘터리', 18: '드라마', 10751: '가족',
    14: '판타지', 36: '역사', 27: '공포', 10402: '음악',
    9648: '미스터리', 10749: '로맨스', 878: 'SF', 53: '스릴러',
    10752: '전쟁', 37: '서부'
  };

  // 언어 이름 매핑
  const languages = {
    ko: '한국어', en: '영어', ja: '일본어',
    zh: '중국어', es: '스페인어', fr: '프랑스어'
  };

  // 정렬 옵션 매핑
  const sortOptions = {
    'popularity.desc': '인기도 높은순',
    'popularity.asc': '인기도 낮은순',
    'vote_average.desc': '평점 높은순',
    'vote_average.asc': '평점 낮은순',
    'release_date.desc': '최신순',
    'release_date.asc': '오래된순'
  };

  const removeGenre = (genreId) => {
    const newGenres = filters.genre.filter(id => id !== genreId);
    onRemove({ ...filters, genre: newGenres });
  };

  const removeLanguage = (langCode) => {
    const newLanguages = filters.language.filter(code => code !== langCode);
    onRemove({ ...filters, language: newLanguages });
  };

  const handleRemove = (type, value) => {
    switch (type) {
      case 'genre':
        removeGenre(value);
        break;
      case 'language':
        removeLanguage(value);
        break;
      case 'rating':
        onRemove({ ...filters, rating: null });
        break;
      case 'year':
        onRemove({ ...filters, year: null });
        break;
      default:
        break;
    }
  };

  return (
    <AnimatePresence>
      {(filters.genre.length > 0 || filters.language.length > 0 || 
        filters.rating || filters.year || filters.sort !== 'popularity.desc') && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-wrap gap-2"
        >
          {/* 정렬 필터 */}
          {filters.sort !== 'popularity.desc' && (
            <Chip
              label={`정렬: ${sortOptions[filters.sort]}`}
              onRemove={() => onRemove({ ...filters, sort: 'popularity.desc' })}
            />
          )}

          {/* 장르 필터 */}
          {filters.genre.map(genreId => (
            <Chip
              key={`genre-${genreId}`}
              label={`장르: ${genres[genreId]}`}
              onRemove={() => handleRemove('genre', genreId)}
            />
          ))}

          {/* 언어 필터 */}
          {filters.language.map(langCode => (
            <Chip
              key={`lang-${langCode}`}
              label={`언어: ${languages[langCode]}`}
              onRemove={() => handleRemove('language', langCode)}
            />
          ))}

          {/* 평점 필터 */}
          {filters.rating && (
            <Chip
              label={`평점: ${filters.rating}점 이상`}
              onRemove={() => handleRemove('rating')}
            />
          )}

          {/* 년도 필터 */}
          {filters.year && (
            <Chip
              label={`개봉년도: ${filters.year}년`}
              onRemove={() => handleRemove('year')}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Chip = ({ label, onRemove }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="inline-flex items-center px-3 py-1 rounded-full text-sm 
              bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
  >
    {label}
    <button
      onClick={onRemove}
      className="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
    >
      <FontAwesomeIcon icon={faTimes} />
    </button>
  </motion.span>
);

export default FilterChips;