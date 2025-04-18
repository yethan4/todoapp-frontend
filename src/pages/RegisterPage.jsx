import React, { useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errors, setErrors] = useState({});

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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/register/`, formData);
      console.log("Success!", response.data);
      setSuccessMessage("Registration Successful!");
    } catch (error) {
      console.log("Error during registration!", error.response?.data);
      if (error.response && error.response.data) {
        setErrors(error.response.data); 
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="form-page">
        {successMessage && <p className="success">{successMessage}</p>}
        <h2>Create Account</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

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
            <label htmlFor="password1">Password:</label>
            <input
              type="password"
              name="password1"
              value={formData.password1}
              onChange={handleChange}
              placeholder="Create a password"
            />
            {errors.password1 && <p className="error">{errors.password1}</p>}
          </div>

          <div>
            <label htmlFor="password2">Confirm Password:</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              placeholder="Repeat your password"
            />
            {errors.password2 && <p className="error">{errors.password2}</p>}
          </div>

          {errors.non_field_errors && <p className="error">{errors.non_field_errors}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-link">
          <Link to="/login">Already have an account? Log in</Link>
        </p>
      </div>
    </main>
  );
};