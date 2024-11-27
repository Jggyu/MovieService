import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../services/authService';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userId, setUserId] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUserId(currentUser || '');
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUserId('');
    navigate('/signin');
  };

  const menuItems = [
    { to: "/", label: "홈" },
    { to: "/popular", label: "대세 콘텐츠" },
    { to: "/wishlist", label: "내가 찜한 리스트" },
    { to: "/search", label: "찾아보기" }
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
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
              <Link
                to="/"
                className={`text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500  
                         bg-clip-text text-transparent hover:from-purple-400 hover:to-pink-400 
                         transition-all duration-300 ${isScrolled ? 'text-2xl' : 'text-3xl'}`}
              >
                MOVIEFLIX
              </Link>
              <nav className="hidden md:flex items-center space-x-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative px-5 py-2 text-gray-200 hover:text-white 
                             transition-colors duration-200 group
                             ${isScrolled ? 'text-base' : 'text-lg'}`}
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r 
                                 from-purple-500 to-pink-500 transform scale-x-0 
                                 group-hover:scale-x-100 transition-transform duration-300" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {userId && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-white/90 font-medium hidden md:block
                              ${isScrolled ? 'text-sm' : 'text-base'}`}
                >
                  {userId}
                </motion.span>
              )}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-2 text-white/90 font-medium transition-all duration-300
                            hover:text-white relative group hidden md:block
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full
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
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-64 bg-black/95 backdrop-blur-lg z-50
                       md:hidden shadow-xl"
          >
            <div className="flex flex-col p-8 h-full">
              <div className="flex-1 flex flex-col space-y-4 mt-16">
                {menuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMobileMenu}
                    className="text-white/90 hover:text-white py-2 px-4
                             transition-colors duration-200 text-lg"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              <div className="border-t border-white/10 pt-4 space-y-4">
                {userId && (
                  <span className="block text-white/90 px-4">
                    {userId}
                  </span>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="w-full text-left text-white/90 hover:text-white 
                           py-2 px-4 transition-colors duration-200"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;