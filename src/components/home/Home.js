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
      <main className="pb-20"> {/* 하단 여백 추가 */}
        {featuredMovie && <Banner movie={featuredMovie} />}
        <div className="space-y-16 mt-12"> {/* space-y-8에서 space-y-16으로, mt-8에서 mt-12로 변경 */}
          <div className="mt-4"> {/* 각 MovieRow를 div로 감싸서 추가 여백 설정 */}
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