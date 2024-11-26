// src/components/home/Home.js
import React from 'react';
import Header from '../layout/Header';
import Banner from './Banner';
import MovieRow from './MovieRow';
import { urlService } from '../../services/urlService';

const Home = () => {
  const apiKey = localStorage.getItem('TMDb-Key') || '';
  const [featuredMovies, setFeaturedMovies] = React.useState([]);

  // 여러 카테고리의 영화 URL 생성
  const popularMoviesUrl = urlService.getURL4PopularMovies(apiKey);
  const newReleasesUrl = urlService.getURL4ReleaseMovies(apiKey);
  const actionMoviesUrl = urlService.getURL4GenreMovies(apiKey, '28');
  const adventureMoviesUrl = urlService.getURL4GenreMovies(apiKey, '12');
  const animationMoviesUrl = urlService.getURL4GenreMovies(apiKey, '16');
  const comedyMoviesUrl = urlService.getURL4GenreMovies(apiKey, '35');
  const topRatedMoviesUrl = urlService.getURL4TopRatedMovies(apiKey);
  const upcomingMoviesUrl = urlService.getURL4UpcomingMovies(apiKey);

  React.useEffect(() => {
    const loadFeaturedMovies = async () => {
      try {
        const movies = await urlService.fetchFeaturedMovie(apiKey);
        setFeaturedMovies(movies.slice(0, 5));
      } catch (error) {
        console.error('Error loading featured movies:', error);
      }
    };

    loadFeaturedMovies();
  }, [apiKey]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      <Header />
      <main className="pb-20">
        {featuredMovies.length > 0 && <Banner movies={featuredMovies} />}
        <div className="space-y-12 mt-8 md:mt-12">
          <div>
            <MovieRow title="인기 영화" fetchUrl={popularMoviesUrl} />
          </div>
          <div>
            <MovieRow title="최신 개봉작" fetchUrl={newReleasesUrl} />
          </div>
          <div>
            <MovieRow title="평점이 높은 영화" fetchUrl={topRatedMoviesUrl} />
          </div>
          <div>
            <MovieRow title="액션 영화" fetchUrl={actionMoviesUrl} />
          </div>
          <div>
            <MovieRow title="모험 영화" fetchUrl={adventureMoviesUrl} />
          </div>
          <div>
            <MovieRow title="애니메이션" fetchUrl={animationMoviesUrl} />
          </div>
          <div>
            <MovieRow title="코미디 영화" fetchUrl={comedyMoviesUrl} />
          </div>
          <div>
            <MovieRow title="개봉 예정작" fetchUrl={upcomingMoviesUrl} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;