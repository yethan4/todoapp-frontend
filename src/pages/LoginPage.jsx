import React, { useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { checkLoggedInUser } = useAuth();
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post("http://localhost:8000/api/login/", formData);
      console.log("Success!", response.data);
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      await checkLoggedInUser();
    } catch (error) {
      console.log("Error during login!", error.response?.data);
      if (error.response && error.response.data) {
        setErrors(error.response.data); 
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main>
      <div className="form-page login-page">
        <h2>Login</h2>
        <form className="register-form login-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          {errors.non_field_errors && <p className="error">{errors.non_field_errors}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-link">
          <Link to="/register">Don't have an account? Sign up</Link>
        </p>
      </div>
    </main>
  );
};

