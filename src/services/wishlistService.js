// src/services/wishlistService.js
export const wishlistService = {
    getWishlist: (userId) => {
      try {
        const wishlists = JSON.parse(localStorage.getItem('wishlists') || '{}');
        console.log('Wishlists data:', wishlists); // 디버깅용
        return wishlists[userId] || [];
      } catch (error) {
        console.error('Error getting wishlist:', error);
        return [];
      }
    },
  
    toggleWishlist: (userId, movie) => {
      if (!userId) return false;
      
      try {
        const wishlists = JSON.parse(localStorage.getItem('wishlists') || '{}');
        const userWishlist = wishlists[userId] || [];
        
        const existingIndex = userWishlist.findIndex(item => item.id === movie.id);
        if (existingIndex >= 0) {
          userWishlist.splice(existingIndex, 1);
        } else {
          userWishlist.push(movie);
        }
        
        wishlists[userId] = userWishlist;
        localStorage.setItem('wishlists', JSON.stringify(wishlists));
        
        return existingIndex < 0;
      } catch (error) {
        console.error('Error toggling wishlist:', error);
        return false;
      }
    },
  
    removeFromWishlist: (userId, movieId) => {
      if (!userId) return;
      
      try {
        const wishlists = JSON.parse(localStorage.getItem('wishlists') || '{}');
        const userWishlist = wishlists[userId] || [];
        
        wishlists[userId] = userWishlist.filter(movie => movie.id !== movieId);
        localStorage.setItem('wishlists', JSON.stringify(wishlists));
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    },
  
    isInWishlist: (userId, movieId) => {
      if (!userId) return false;
      
      try {
        const wishlists = JSON.parse(localStorage.getItem('wishlists') || '{}');
        const userWishlist = wishlists[userId] || [];
        return userWishlist.some(movie => movie.id === movieId);
      } catch (error) {
        console.error('Error checking wishlist:', error);
        return false;
      }
    }
  };