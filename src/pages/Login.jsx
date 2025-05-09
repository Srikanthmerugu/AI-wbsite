import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { LoginBG, offRobo } from '../assets/Assets';
import { Link, useNavigate } from 'react-router-dom';
const LoginPage = () => {
  const [email, setEmail] = useState('srikanth@maven.com');
  const [password, setPassword] = useState('12345678'); 
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (login(email, password)) {
      navigate('/'); // Navigate to home on successful login
    } else {
      alert("user details miss matches ")
      setError('Invalid credentials. Please try again.');
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Video Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          className="w-full  object-contain"
        >
          <source src={LoginBG} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-sky-900 opacity-70"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative left-0  z-15  h-[500px] w-full max-w-md bg-opacity-90  rounded-xl "
      ><div>      <img src={offRobo} />
</div>

</motion.div>

      {/* Centered Login Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative right-15 z-10 w-full max-w-md bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl p-8"
      >
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sky-900 mb-2">Welcome to FinSightAI</h1>
          <p className="text-sky-600">Sign in to your financial dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-sky-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-sky-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-sky-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sky-800 placeholder-sky-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-sky-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-sky-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 border border-sky-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sky-800 placeholder-sky-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-sky-400 hover:text-sky-600" />
                ) : (
                  <FiEye className="h-5 w-5 text-sky-400 hover:text-sky-600" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-sky-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-sky-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-sky-600 hover:text-sky-500">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
          <button
  type="submit"
  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200"
>
  Sign in
</button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-sky-600">
            Don't have an account?{' '}
            <Link to="/register-page" className="font-light text-blue-700 hover:text-blue-600">
            Register
            </Link>
          </p>
        </div>

        {/* <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sky-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white bg-opacity-90 text-sky-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-sky-300 rounded-lg shadow-sm bg-white text-sm font-medium text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Google
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-sky-300 rounded-lg shadow-sm bg-white text-sm font-medium text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Microsoft
            </button>
          </div>
        </div> */}
      </motion.div>

    </div>
  );
};

export default LoginPage;