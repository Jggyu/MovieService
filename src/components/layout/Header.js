import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    <motion.header
      initial={false}
      animate={{
        height: isScrolled ? '50px' : '80px',
      }}
      transition={{
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      className="fixed top-0 w-full z-50"
    >
      {/* 배경 레이어 */}
      <div 
        className={`absolute inset-0 transition-all duration-300 pointer-events-none
                   ${isScrolled 
                     ? 'bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur-md'
                     : 'bg-gradient-to-b from-black/80 via-black/50 to-transparent'}`}
        style={{ zIndex: -1 }}
      />

      <div className="max-w-7xl mx-auto px-8 relative">
        <div className="flex items-center justify-between h-full relative">
          <div className="flex items-center space-x-12">
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              className={`text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500  
                       bg-clip-text text-transparent hover:from-purple-400 hover:to-pink-400 
                       transition-all duration-300 ${isScrolled ? 'text-2xl' : 'text-3xl'}`}
            >
              MOVIEFLIX
            </motion.a>
            <nav className="hidden md:flex items-center space-x-2">
              {[
                { href: "/", label: "홈" },
                { href: "/popular", label: "대세 콘텐츠" },
                { href: "/wishlist", label: "내가 찜한 리스트" },
                { href: "/search", label: "찾아보기" }
              ].map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  whileHover={{ scale: 1.05 }}
                  className={`relative px-5 py-2 text-gray-200 hover:text-white 
                           transition-colors duration-200 group
                           ${isScrolled ? 'text-base' : 'text-lg'}`}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r 
                               from-purple-500 to-pink-500 transform scale-x-0 
                               group-hover:scale-x-100 transition-transform duration-300" />
                </motion.a>
              ))}
            </nav>
          </div>

          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-2 text-white/90 font-medium transition-all duration-300
                        hover:text-white relative group
                        ${isScrolled ? 'text-sm' : 'text-base'}`}
            >
            로그아웃
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30 
                            transform origin-left scale-x-0 group-hover:scale-x-100 
                            transition-transform duration-300"/>
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="md:hidden fixed right-8 top-6 p-2 rounded-full
                   bg-black/20 backdrop-blur-lg border border-white/10"
        >
          <svg
            className={`text-white transition-all duration-300
                     ${isScrolled ? 'w-5 h-5' : 'w-6 h-6'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;