import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const Header = () => {
 const [isScrolled, setIsScrolled] = useState(false);
 const [isScrollingUp, setIsScrollingUp] = useState(true);
 const [lastScrollY, setLastScrollY] = useState(0);
 const navigate = useNavigate();
 const { scrollY } = useScroll();

 useEffect(() => {
   const handleScroll = () => {
     const currentScrollY = window.scrollY;
     setIsScrolled(currentScrollY > 50);
     setIsScrollingUp(currentScrollY < lastScrollY || currentScrollY < 50);
     setLastScrollY(currentScrollY);
   };

   window.addEventListener('scroll', handleScroll);
   return () => window.removeEventListener('scroll', handleScroll);
 }, [lastScrollY]);

 const handleLogout = () => {
   localStorage.removeItem('TMDb-Key');
   navigate('/signin');
 };

 const height = useTransform(scrollY, [0, 50], [80, 60]);

 return (
   <AnimatePresence>
     <motion.header
       initial={false}
       animate={{
         height: isScrolled ? 60 : 80,
         y: isScrollingUp ? 0 : -100,
         opacity: isScrollingUp ? 1 : 0,
       }}
       transition={{
         duration: 0.3,
         ease: "easeInOut"
       }}
       style={{ height }}
       className={`fixed top-0 w-full z-50 transition-all duration-300 ${
         isScrolled 
           ? 'bg-black/90 backdrop-blur-md shadow-lg shadow-black/20' 
           : 'bg-gradient-to-b from-black/80 to-transparent'
       }`}
     >
       <div className="max-w-7xl mx-auto px-6">
         <div className="flex items-center justify-between h-full">
           <div className="flex items-center space-x-8">
             <motion.a
               href="/"
               whileHover={{ scale: 1.05 }}
               className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 
                        bg-clip-text text-transparent hover:from-purple-400 hover:to-pink-400 
                        transition-all duration-300"
             >
               MOVIEFLIX
             </motion.a>
             <nav className="hidden md:flex items-center space-x-1">
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
                   className="relative px-4 py-2 text-gray-300 hover:text-white 
                            transition-colors duration-200 group"
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
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 
                      text-white font-medium transition-all duration-300
                      hover:shadow-lg hover:shadow-purple-500/25 
                      hover:from-purple-400 hover:to-pink-400"
           >
             로그아웃
           </motion.button>
         </div>

         {/* Mobile Menu Button */}
         <motion.button
           whileTap={{ scale: 0.95 }}
           className="md:hidden fixed right-6 top-4 p-2 rounded-full
                    bg-black/20 backdrop-blur-lg border border-white/10"
         >
           <svg
             className="w-6 h-6 text-white"
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
   </AnimatePresence>
 );
};

export default Header;