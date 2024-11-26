// src/components/search/SearchResults.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faHeart,
  faCalendarAlt,
  faLanguage,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { authService } from '../../services/authService';
import { wishlistService } from '../../services/wishlistService';

const SearchResults = ({ movies: initialMovies, loading, isSearching, searchQuery }) => {
  const [wishlistStates, setWishlistStates] = useState({});
  const [imageLoading, setImageLoading] = useState({});
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showWishlistAnimation, setShowWishlistAnimation] = useState({});
  const currentUser = authService.getCurrentUser();
  const observer = useRef();
  const apiKey = localStorage.getItem('TMDb-Key');

  useEffect(() => {
    setMovies(initialMovies);
    setPage(1);
    setHasMore(true);
  }, [initialMovies]);

  useEffect(() => {
    // 초기 위시리스트 상태 설정
    if (currentUser) {
      const states = {};
      movies.forEach(movie => {
        states[movie.id] = wishlistService.isInWishlist(currentUser, movie.id);
      });
      setWishlistStates(states);
    }
  }, [movies, currentUser]);

  const lastMovieRef = useCallback(node => {
    if (loading || isLoadingMore || !hasMore || isSearching) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMoreMovies();
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, isSearching, isLoadingMore]);

  const loadMoreMovies = async () => {
    if (isLoadingMore || !hasMore || isSearching) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${nextPage}`
      );
      const data = await response.json();
      
      if (data.results.length > 0) {
        setMovies(prev => [...prev, ...data.results]);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleWishlistToggle = (movie, event) => {
    event.stopPropagation(); // 이벤트 버블링 방지
    if (!currentUser) return;

    const wasAdded = wishlistService.toggleWishlist(currentUser, movie);
    setWishlistStates(prev => ({
      ...prev,
      [movie.id]: wasAdded
    }));

    // 위시리스트 토글 애니메이션
    setShowWishlistAnimation(prev => ({
      ...prev,
      [movie.id]: true
    }));
    setTimeout(() => {
      setShowWishlistAnimation(prev => ({
        ...prev,
        [movie.id]: false
      }));
    }, 1000);
  };

  const handleImageLoad = (movieId) => {
    setImageLoading(prev => ({
      ...prev,
      [movieId]: false
    }));
  };

  const handleImageLoadStart = (movieId) => {
    setImageLoading(prev => ({
      ...prev,
      [movieId]: true
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        <p className="text-gray-400 animate-pulse">영화 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-20">
        {isSearching ? (
          <div className="space-y-2">
            <p className="text-gray-400 text-lg">
              '{searchQuery}'에 대한 검색 결과가 없습니다
            </p>
            <p className="text-gray-500">
              다른 검색어를 입력하거나 필터를 조정해보세요
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-lg">
            필터링된 결과가 없습니다
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie, index) => (
          <motion.div
            key={`${movie.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
            ref={index === movies.length - 1 ? lastMovieRef : null}
          >
            {/* 영화 카드 내용 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg
                          transform transition-all duration-300 group-hover:scale-105">
              <div className="relative aspect-[2/3]">
                {/* 위시리스트 토글 애니메이션 */}
                <AnimatePresence>
                  {showWishlistAnimation[movie.id] && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center
                               bg-black/70 z-50"
                    >
                      <div className="text-white text-center">
                        <FontAwesomeIcon 
                          icon={faCheck} 
                          className="text-3xl mb-2 text-green-500"
                        />
                        <p className="text-sm">
                          {wishlistStates[movie.id] ? '위시리스트에 추가됨' : '위시리스트에서 제거됨'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 이미지 및 기존 내용 */}
                {/* 이미지 로딩 플레이스홀더 */}
                {imageLoading[movie.id] && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center space-y-2">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-gray-400">로딩중...</span>
                    </div>
                    </div>
                )}
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className={`w-full h-full object-cover transition-opacity duration-300
                            ${imageLoading[movie.id] ? 'opacity-0' : 'opacity-100'}`}
                    loading="lazy"
                    onLoadStart={() => handleImageLoadStart(movie.id)}
                    onLoad={() => handleImageLoad(movie.id)}
                    onError={() => handleImageLoad(movie.id)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Wishlist Button - z-index 증가 */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleWishlistToggle(movie, e)}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full 
                            flex items-center justify-center transition-all duration-200 
                            z-50 ${
                              wishlistStates[movie.id]
                                ? 'bg-red-500 text-white'
                                : 'bg-black/50 backdrop-blur-sm text-white/70 hover:bg-black/70'
                            }`}
                >
                  <FontAwesomeIcon icon={faHeart} 
                    className={`transition-transform duration-200 
                              ${wishlistStates[movie.id] ? 'scale-110' : 'scale-100'}`}
                  />
                </motion.button>

                {/* Movie Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
                    {movie.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm">
                    <div className="flex items-center text-yellow-500">
                        <FontAwesomeIcon icon={faStar} className="mr-1" />
                        <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-400">
                        {new Date(movie.release_date).getFullYear()}
                    </span>
                    </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 
                                transition-all duration-300 p-4 flex flex-col">
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm text-gray-300 line-clamp-5 mb-4">
                            {movie.overview || "줄거리 정보가 없습니다."}
                        </p>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-300">
                        <FontAwesomeIcon icon={faCalendarAlt} className="w-4 text-blue-400" />
                        <span className="ml-2">
                            {new Date(movie.release_date).toLocaleDateString('ko-KR')}
                        </span>
                        </div>
                        <div className="flex items-center text-gray-300">
                        <FontAwesomeIcon icon={faLanguage} className="w-4 text-purple-400" />
                        <span className="ml-2">
                            {movie.original_language.toUpperCase()}
                        </span>
                        </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 로딩 인디케이터 */}
      {(isLoadingMore || loading) && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
    </>
  );
};

export default SearchResults;