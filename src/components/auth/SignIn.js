// src/components/auth/SignIn.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('TMDb-Key');
    if (isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

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
    <div className="min-h-screen overflow-hidden bg-gray-900">
      {/* Background with overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2525&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 animate-gradient-xy" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent animate-pulse" />
        </div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="relative w-[900px] h-[600px] max-w-[95%] perspective preserve-3d">
          {/* Cards Container */}
          <motion.div 
            className="relative w-full h-full preserve-3d transition-all duration-700"
            animate={{ rotateY: isLoginVisible ? 0 : 180 }}
            transition={{ duration: 0.7, ease: [0.4, 0.0, 0.2, 1] }}
          >
            {/* Login Card */}
            <div className={`
              absolute w-full h-full backface-hidden
              bg-white/10 backdrop-blur-2xl
              rounded-2xl overflow-hidden
              shadow-[0_8px_32px_rgba(0,0,0,0.3)]
              border border-white/20
              p-16
              transition-all duration-500
            `}>
              <div className="relative z-10">
                <h2 className="text-5xl font-bold text-white text-center mb-12">
                  Sign In
                </h2>
                <form onSubmit={handleLogin} className="space-y-8">
                  <div className="group relative">
                    <input
                      type="email"
                      className="peer w-full px-4 py-4 text-lg text-white border-0 border-b-2 
                               border-white/30 bg-transparent placeholder-transparent
                               focus:outline-none focus:border-blue-400 transition-all"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      placeholder="Email"
                      required
                    />
                    <label className="absolute left-4 -top-3.5 text-white/60 text-sm 
                                    transition-all peer-placeholder-shown:text-lg 
                                    peer-placeholder-shown:text-white/60 peer-placeholder-shown:top-4
                                    peer-focus:-top-3.5 peer-focus:text-blue-400 peer-focus:text-sm">
                      Email
                    </label>
                  </div>
                  <div className="group relative">
                    <input
                      type="password"
                      className="peer w-full px-4 py-4 text-lg text-white border-0 border-b-2 
                               border-white/30 bg-transparent placeholder-transparent
                               focus:outline-none focus:border-blue-400 transition-all"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      placeholder="Password"
                      required
                    />
                    <label className="absolute left-4 -top-3.5 text-white/60 text-sm 
                                    transition-all peer-placeholder-shown:text-lg 
                                    peer-placeholder-shown:text-white/60 peer-placeholder-shown:top-4
                                    peer-focus:-top-3.5 peer-focus:text-blue-400 peer-focus:text-sm">
                      Password (TMDb API Key)
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 mt-8 text-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                             hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 
                             text-white font-semibold rounded-xl
                             shadow-[0_0_15px_rgba(59,130,246,0.5)]
                             transform hover:-translate-y-0.5 active:scale-95 
                             transition-all duration-300"
                  >
                    LOGIN
                  </button>
                </form>
                <div className="mt-10 text-center text-white/70">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLoginVisible(false)}
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              </div>
              
              {/* Background gradient effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000" />
            </div>

            {/* Register Card */}
            <div className={`
              absolute w-full h-full backface-hidden [transform:rotateY(180deg)]
              bg-white/10 backdrop-blur-2xl
              rounded-2xl overflow-hidden
              shadow-[0_8px_32px_rgba(0,0,0,0.3)]
              border border-white/20
              p-16
              transition-all duration-500
            `}>
              <div className="relative z-10">
                <h2 className="text-5xl font-bold text-white text-center mb-12">
                  Sign Up
                </h2>
                <form onSubmit={handleRegister} className="space-y-8">
                  <div className="group relative">
                    <input
                      type="email"
                      className="peer w-full px-4 py-4 text-lg text-white border-0 border-b-2 
                               border-white/30 bg-transparent placeholder-transparent
                               focus:outline-none focus:border-purple-400 transition-all"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      placeholder="Email"
                      required
                    />
                    <label className="absolute left-4 -top-3.5 text-white/60 text-sm 
                                    transition-all peer-placeholder-shown:text-lg 
                                    peer-placeholder-shown:text-white/60 peer-placeholder-shown:top-4
                                    peer-focus:-top-3.5 peer-focus:text-purple-400 peer-focus:text-sm">
                      Email
                    </label>
                  </div>
                  <div className="group relative">
                    <input
                      type="password"
                      className="peer w-full px-4 py-4 text-lg text-white border-0 border-b-2 
                               border-white/30 bg-transparent placeholder-transparent
                               focus:outline-none focus:border-purple-400 transition-all"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      placeholder="Password"
                      required
                    />
                    <label className="absolute left-4 -top-3.5 text-white/60 text-sm 
                                    transition-all peer-placeholder-shown:text-lg 
                                    peer-placeholder-shown:text-white/60 peer-placeholder-shown:top-4
                                    peer-focus:-top-3.5 peer-focus:text-purple-400 peer-focus:text-sm">
                      Password (TMDb API Key)
                    </label>
                  </div>
                  <div className="group relative">
                    <input
                      type="password"
                      className="peer w-full px-4 py-4 text-lg text-white border-0 border-b-2 
                               border-white/30 bg-transparent placeholder-transparent
                               focus:outline-none focus:border-purple-400 transition-all"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      placeholder="Confirm Password"
                      required
                    />
                    <label className="absolute left-4 -top-3.5 text-white/60 text-sm 
                                    transition-all peer-placeholder-shown:text-lg 
                                    peer-placeholder-shown:text-white/60 peer-placeholder-shown:top-4
                                    peer-focus:-top-3.5 peer-focus:text-purple-400 peer-focus:text-sm">
                      Confirm Password
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 mt-8 text-lg bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700
                             hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 
                             text-white font-semibold rounded-xl
                             shadow-[0_0_15px_rgba(147,51,234,0.5)]
                             transform hover:-translate-y-0.5 active:scale-95 
                             transition-all duration-300"
                  >
                    REGISTER
                  </button>
                </form>
                <div className="mt-10 text-center text-white/70">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLoginVisible(true)}
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              </div>
              
              {/* Background gradient effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;