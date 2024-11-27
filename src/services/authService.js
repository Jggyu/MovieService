// src/services/authService.js
import { toast } from 'react-toastify';

export const authService = {
 tryLogin: (email, password, rememberMe = false) => {
   return new Promise((resolve, reject) => {
     try {
       const users = JSON.parse(localStorage.getItem('users') || '[]');
       const user = users.find(user => user.id === email && user.password === password);

       if (user) {
         // TMDb API 키 저장
         localStorage.setItem('TMDb-Key', user.password);
         
         // Remember Me 처리
         if (rememberMe) {
           localStorage.setItem('currentUser', email);
           localStorage.setItem('rememberMe', 'true');
         } else {
           sessionStorage.setItem('currentUser', email);
           localStorage.removeItem('rememberMe');
         }

         resolve(user);
       } else {
         reject(new Error('Login failed'));
       }
     } catch (error) {
       reject(new Error('An error occurred during login'));
     }
   });
 },

 getCurrentUser: () => {
   return localStorage.getItem('currentUser') || 
          sessionStorage.getItem('currentUser');
 },

 isRemembered: () => {
   return localStorage.getItem('rememberMe') === 'true';
 },

 logout: () => {
   localStorage.removeItem('TMDb-Key');
   if (!authService.isRemembered()) {
     localStorage.removeItem('currentUser');
   }
   sessionStorage.removeItem('currentUser');
   localStorage.removeItem('rememberMe');
 },

 tryRegister: (email, password) => {
   return new Promise((resolve, reject) => {
     try {
       const users = JSON.parse(localStorage.getItem('users') || '[]');
       
       // 이메일 중복 체크
       const userExists = users.some(existingUser => existingUser.id === email);
       if (userExists) {
         reject(new Error('Email already registered'));
         return;
       }

       // TMDb API 키 유효성 검증
       fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${password}&language=ko-KR&page=1`)
         .then(response => {
           if (!response.ok) {
             throw new Error('Invalid TMDb API key');
           }
           return response.json();
         })
         .then(() => {
           // API 키가 유효한 경우 사용자 등록
           const newUser = { id: email, password: password };
           users.push(newUser);
           localStorage.setItem('users', JSON.stringify(users));
           resolve(newUser);
         })
         .catch(() => {
           reject(new Error('Invalid TMDb API key'));
         });
     } catch (error) {
       reject(error);
     }
   });
 },

 // 자동 로그인 체크
 checkAutoLogin: () => {
   const remembered = authService.isRemembered();
   const currentUser = localStorage.getItem('currentUser');
   const apiKey = localStorage.getItem('TMDb-Key');

   return !!(remembered && currentUser && apiKey);
 }
};