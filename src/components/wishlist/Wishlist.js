// src/components/wishlist/Wishlist.js
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faTrashAlt, 
  faStar, 
  faCalendarAlt,
  faLanguage,
  faThumbsUp,
  faFilm,
  faPlay
} from '@fortawesome/free-solid-svg-icons';
import Header from '../layout/Header';
import { authService } from '../../services/authService';
import { wishlistService } from '../../services/wishlistService';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // currentUser를 state로 관리
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 현재 사용자 확인
    const user = authService.getCurrentUser();
    console.log('Current user:', user);
    
    if (!user) {
      navigate('/signin');
      return;
    }
    
    setCurrentUser(user);
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      loadWishlist();
    }
  }, [currentUser]);

  const loadWishlist = () => {
    if (!currentUser) {
      console.log('No user found');
      return;
    }

    try {
      console.log('Loading wishlist for user:', currentUser);
      const wishlistMovies = wishlistService.getWishlist(currentUser);
      console.log('Loaded wishlist movies:', wishlistMovies);
      setMovies(wishlistMovies || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (movieId) => {
    if (!currentUser) return;

    wishlistService.removeFromWishlist(currentUser, movieId);
    loadWishlist(); // 삭제 후 위시리스트 다시 로드
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"/>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent 
                         bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            마이 무비 콜렉션
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            내가 찜한 영화 {movies.length}편
          </p>
        </motion.div>

        {/* Empty State */}
        {movies.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6">
              <FontAwesomeIcon 
                icon={faHeart} 
                className="text-gray-600 text-5xl animate-pulse" 
              />
            </div>
            <h3 className="text-xl text-gray-400 font-medium mb-2">
              아직 찜한 영화가 없습니다
            </h3>
            <p className="text-gray-500">
              관심있는 영화를 찜하고 나만의 컬렉션을 만들어보세요
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {movies.map((movie) => (
              <motion.div
                key={movie.id}
                variants={item}
                className="relative group"
                layout
              >
                <div className="relative overflow-hidden rounded-xl bg-gray-800 shadow-lg
                              transform transition-all duration-300 hover:scale-105">
                  {/* Movie Poster */}
                  <div className="relative aspect-[2/3]">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                    {/* Basic Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-2" />
                          <span className="text-white">{movie.vote_average.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-300">
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100
                                  transition-opacity duration-300 p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-white font-bold text-lg mb-1">{movie.title}</h3>
                          <p className="text-sm text-gray-400">{movie.original_title}</p>
                        </div>

                        <p className="text-sm text-gray-300 line-clamp-4">
                          {movie.overview || "줄거리 정보가 없습니다."}
                        </p>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-300">
                            <FontAwesomeIcon icon={faCalendarAlt} className="w-5 text-blue-400" />
                            <span className="ml-2">
                              {new Date(movie.release_date).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <FontAwesomeIcon icon={faLanguage} className="w-5 text-purple-400" />
                            <span className="ml-2">{movie.original_language.toUpperCase()}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <FontAwesomeIcon icon={faThumbsUp} className="w-5 text-green-400" />
                            <span className="ml-2">{movie.vote_count.toLocaleString()}명이 평가</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <motion.button
                          onClick={() => setSelectedMovie(movie)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium
                                   hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faFilm} className="mr-2" />
                          상세정보
                        </motion.button>
                        <motion.button
                          onClick={() => handleRemove(movie.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium
                                   hover:bg-red-700 transition-colors flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                          삭제하기
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Movie Detail Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setSelectedMovie(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gray-900 rounded-xl max-w-2xl w-full overflow-hidden shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <img
                  src={`https://image.tmdb.org/t/p/w1280${selectedMovie.backdrop_path}`}
                  alt={selectedMovie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50" />
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedMovie.title}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  {selectedMovie.overview}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <span className="text-gray-500">개봉일</span>
                    <p className="text-white">
                      {new Date(selectedMovie.release_date).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">평점</span>
                    <p className="text-white flex items-center">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" />
                      {selectedMovie.vote_average.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">언어</span>
                    <p className="text-white uppercase">
                      {selectedMovie.original_language}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">인기도</span>
                    <p className="text-white">
                      {Math.round(selectedMovie.popularity)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedMovie(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white
                             transition-colors duration-200"
                  >
                    닫기
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium
                             hover:bg-blue-700 transition-colors duration-200 flex items-center"
                  >
                    <FontAwesomeIcon icon={faPlay} className="mr-2" />
                    예고편 보기
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wishlist;