// src/components/auth/SignIn.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await authService.tryLogin(loginData.email, loginData.password);
      navigate('/');
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await authService.tryRegister(registerData.email, registerData.password);
      setIsLoginVisible(true);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=2574&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-blue-900/50 backdrop-blur-sm" />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-xy" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="relative w-full max-w-2xl mx-auto perspective-1000">
          {/* Glowing effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-pulse" />
          
          {/* Login Card */}
          <div 
            className={`
              absolute w-full backdrop-blur-xl bg-white/90 rounded-2xl
              shadow-[0_0_40px_rgba(8,_112,_184,_0.7)]
              p-12 transform transition-all duration-500 ease-in-out
              ${isLoginVisible 
                ? 'rotate-y-0 opacity-100 translate-z-0' 
                : 'rotate-y-180 opacity-0 -translate-z-12 pointer-events-none'}
            `}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center mb-10">
              Sign In
            </h2>
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="group">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 text-lg bg-white/50 border border-gray-200 
                           rounded-lg shadow-sm focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:border-blue-500 transition-all
                           duration-300 backdrop-blur-sm"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  placeholder="Enter your email"
                />
              </div>
              <div className="group">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Password (TMDb API Key)
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 text-lg bg-white/50 border border-gray-200 
                           rounded-lg shadow-sm focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:border-blue-500 transition-all
                           duration-300 backdrop-blur-sm"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  placeholder="Enter your TMDb API key"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 px-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600
                         hover:from-blue-700 hover:to-purple-700 text-white font-semibold 
                         rounded-lg shadow-lg transform hover:-translate-y-0.5 
                         active:scale-95 transition-all duration-300"
              >
                Login
              </button>
            </form>
            <p className="mt-8 text-center text-base text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setIsLoginVisible(false)}
                className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 
                         bg-clip-text font-semibold hover:opacity-80 transition-opacity duration-300"
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Register Card */}
          <div 
            className={`
              absolute w-full backdrop-blur-xl bg-white/90 rounded-2xl
              shadow-[0_0_40px_rgba(8,_112,_184,_0.7)]
              p-12 transform transition-all duration-500 ease-in-out backface-hidden
              ${!isLoginVisible 
                ? 'rotate-y-0 opacity-100 translate-z-0' 
                : 'rotate-y-180 opacity-0 -translate-z-12 pointer-events-none'}
            `}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center mb-10">
              Sign Up
            </h2>
            <form onSubmit={handleRegister} className="space-y-8">
              <div className="group">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 text-lg bg-white/50 border border-gray-200 
                           rounded-lg shadow-sm focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:border-blue-500 transition-all
                           duration-300 backdrop-blur-sm"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  placeholder="Enter your email"
                />
              </div>
              <div className="group">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Password (TMDb API Key)
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 text-lg bg-white/50 border border-gray-200 
                           rounded-lg shadow-sm focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:border-blue-500 transition-all
                           duration-300 backdrop-blur-sm"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  placeholder="Enter your TMDb API key"
                />
              </div>
              <div className="group">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 text-lg bg-white/50 border border-gray-200 
                           rounded-lg shadow-sm focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:border-blue-500 transition-all
                           duration-300 backdrop-blur-sm"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                  placeholder="Confirm your TMDb API key"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 px-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600
                         hover:from-blue-700 hover:to-purple-700 text-white font-semibold 
                         rounded-lg shadow-lg transform hover:-translate-y-0.5 
                         active:scale-95 transition-all duration-300"
              >
                Register
              </button>
            </form>
            <p className="mt-8 text-center text-base text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setIsLoginVisible(true)}
                className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 
                         bg-clip-text font-semibold hover:opacity-80 transition-opacity duration-300"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;