// src/services/urlService.js
import axios from 'axios';

export const urlService = {
 getURL4PopularMovies: (apiKey) => 
   `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=1`,

 getURL4ReleaseMovies: (apiKey) => 
   `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=1`,

 getURL4TopRatedMovies: (apiKey) => 
   `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=ko-KR&page=1`,

 getURL4UpcomingMovies: (apiKey) => 
   `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=ko-KR&page=1`,

 getURL4GenreMovies: (apiKey, genre) => 
   `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=ko-KR&page=1`,

 fetchFeaturedMovie: async (apiKey) => {
   try {
     const response = await axios.get(
       `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`
     );
     return response.data.results.slice(0, 5);  // 상위 5개만 반환
   } catch (error) {
     console.error('Error fetching featured movies:', error);
     return [];
   }
 },

 // 장르 정보 가져오기
 fetchGenres: async (apiKey) => {
   try {
     const response = await axios.get(
       `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ko-KR`
     );
     return response.data.genres;
   } catch (error) {
     console.error('Error fetching genres:', error);
     return [];
   }
 }
};