// src/services/urlService.js
import axios from 'axios';

export const urlService = {
  getURL4PopularMovies: (apiKey, page = 1) => 
    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${page}`,

  getURL4ReleaseMovies: (apiKey, page = 2) => 
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=${page}`,

  getURL4GenreMovies: (apiKey, genre, page = 1) => 
    `https://api.themoviedb.org/3/movie/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=ko-KR&page=${page}`,

  fetchFeaturedMovie: async (apiKey) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`
      );
      return response.data.results;  // 결과 배열 반환
    } catch (error) {
      console.error('Error fetching featured movies:', error);
      return [];
    }
  },
};