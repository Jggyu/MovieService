// src/components/layout/Header.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('TMDb-Key');
    navigate('/signin');
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-black' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center space-x-4">
          <a href="/" className="text-white text-xl font-bold">홈</a>
          <a href="/popular" className="text-gray-300 hover:text-white">대세 콘텐츠</a>
          <a href="/wishlist" className="text-gray-300 hover:text-white">내가 찜한 리스트</a>
          <a href="/search" className="text-gray-300 hover:text-white">찾아보기</a>
        </div>
        <button 
          onClick={handleLogout}
          className="text-white hover:text-gray-300"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
};

export default Header;