// src/components/home/Home.js
import React from 'react';
import Header from '../layout/Header';
import Banner from './Banner';
import MovieRow from './MovieRow';
import { urlService } from '../../services/urlService';

const Home = () => {
  const apiKey = localStorage.getItem('TMDb-Key') || '';
  const [featuredMovies, setFeaturedMovies] = React.useState([]);

  const popularMoviesUrl = urlService.getURL4PopularMovies(apiKey);
  const newReleasesUrl = urlService.getURL4ReleaseMovies(apiKey);
  const actionMoviesUrl = urlService.getURL4GenreMovies(apiKey, '28');

  React.useEffect(() => {
    const loadFeaturedMovies = async () => {
      try {
        const movies = await urlService.fetchFeaturedMovie(apiKey);
        // 상위 5개 영화만 선택
        setFeaturedMovies(movies.slice(0, 5));
      } catch (error) {
        console.error('Error loading featured movies:', error);
      }
    };

    loadFeaturedMovies();
  }, [apiKey]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="pb-20">
        {featuredMovies.length > 0 && <Banner movies={featuredMovies} />}
        <div className="space-y-16 mt-12">
          <div className="mt-4">
            <MovieRow title="Popular Movies" fetchUrl={popularMoviesUrl} />
          </div>
          <div className="mt-8">
            <MovieRow title="New Releases" fetchUrl={newReleasesUrl} />
          </div>
          <div className="mt-8">
            <MovieRow title="Action Movies" fetchUrl={actionMoviesUrl} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;