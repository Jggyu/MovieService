// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import Home from './components/home/Home';
import Popular from './components/popular/Popular';
import Wishlist from './components/wishlist/Wishlist';
import MovieSearch from './components/search/MovieSearch';
import { AuthGuard } from './guards/AuthGuard';

function App() {
  return (
    <Router basename="/MovieService">  {/* basename 추가 */}
      <Routes>
        {/* 초기 경로 "/" 접속 시 인증 상태 체크 후 리다이렉트 */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
        
        {/* Popular 페이지 경로 추가 */}
        <Route
          path="/popular"
          element={
            <AuthGuard>
              <Popular />
            </AuthGuard>
          }
        />

        <Route
          path="/wishlist"
          element={
            <AuthGuard>
              <Wishlist />
            </AuthGuard>
          }
        />
        
        <Route
          path="/search"
          element={
            <AuthGuard>
              <MovieSearch />
            </AuthGuard>
          }
        />


        <Route path="/signin" element={<SignIn />} />
        
        {/* 잘못된 경로로 접근 시 인증 상태 체크 후 리다이렉트 */}
        <Route 
          path="*" 
          element={
            localStorage.getItem('TMDb-Key') 
              ? <Navigate to="/" replace /> 
              : <Navigate to="/signin" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;