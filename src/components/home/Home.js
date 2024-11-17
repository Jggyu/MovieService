// src/components/home/Home.js
import React from 'react';
import Header from '../layout/Header';
import Banner from './Banner';
import MovieRow from './MovieRow';
import { urlService } from '../../services/urlService';

const Home = () => {
  const apiKey = localStorage.getItem('TMDb-Key') || '';
  const [featuredMovie, setFeaturedMovie] = React.useState(null);

  const popularMoviesUrl = urlService.getURL4PopularMovies(apiKey);
  const newReleasesUrl = urlService.getURL4ReleaseMovies(apiKey);
  const actionMoviesUrl = urlService.getURL4GenreMovies(apiKey, '28');

  React.useEffect(() => {
    const loadFeaturedMovie = async () => {
      const movie = await urlService.fetchFeaturedMovie(apiKey);
      setFeaturedMovie(movie);
    };

    loadFeaturedMovie();
  }, [apiKey]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main>
        {featuredMovie && <Banner movie={featuredMovie} />}
        <div className="space-y-8 mt-8">
          <MovieRow title="Popular Movies" fetchUrl={popularMoviesUrl} />
          <MovieRow title="New Releases" fetchUrl={newReleasesUrl} />
          <MovieRow title="Action Movies" fetchUrl={actionMoviesUrl} />
        </div>
      </main>
    </div>
  );
};


export default Home;