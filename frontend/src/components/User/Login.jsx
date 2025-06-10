// ✅ FIXED Login.jsx + UserContext.js
// Uses Vite env variable correctly, fallback safe

import React, { useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, setIsLogin } = useUserContext();
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_Backend_URL ?? 'http://localhost:4000';

  const googleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (!user.success) {
        setError(user.message);
        toast.error(user.message);
        navigate('/register');
      } else {
        setIsLogin(true);
        setError('');
        toast.success('You are logged in');
        navigate('/');
      }
    } catch {
      setError('Login failed.');
      toast.error('Error logging in.');
    }
  };

  return (
    <div className="flex h-[700px] w-full">
      <div className="w-full hidden md:inline-block">
        <img
          className="h-full"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="leftSideImage"
        />
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="md:w-96 w-80 flex flex-col items-center justify-center">
          <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
          <p className="text-sm text-gray-500/90 mt-3">Welcome back! Please sign in to continue</p>

          <button
            onClick={googleLogin}
            type="button"
            className="cursor-pointer w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full"
          >
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="googleLogo"
            />
          </button>

          <div className="flex items-center gap-4 w-full my-5">
            <div className="w-full h-px bg-gray-300/90"></div>
            <p className="w-full text-nowrap text-sm text-gray-500/90">or sign in with email</p>
            <div className="w-full h-px bg-gray-300/90"></div>
          </div>

          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full pl-6 gap-2">
            <input
              type="email"
              placeholder="Email id"
              name="email"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center mt-6 w-full border border-gray-300/60 h-12 rounded-full pl-6 gap-2">
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
            <div className="flex items-center gap-2">
              <input className="h-5" type="checkbox" id="checkbox" />
              <label className="text-sm" htmlFor="checkbox">Remember me</label>
            </div>
            <a className="text-sm underline" href="#">Forgot password?</a>
          </div>

          <button type="submit" className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity">
            Login
          </button>
          <Link to="/register">
            <p className="text-gray-500/90 text-sm mt-4">Don’t have an account? Sign up</p>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
