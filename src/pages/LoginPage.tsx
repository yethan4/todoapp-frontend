import React, { useState } from 'react';
import axios, { AxiosError } from "axios";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface FormData {
  email: string;
  password: string;
}

interface ApiErrors {
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
  detail?: string;
  [key: string]: any;
}

export const LoginPage = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ApiErrors>({});

  const { checkLoggedInUser } = useAuth();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post<{
        access: string;
        refresh: string;
      }>(`${process.env.REACT_APP_API_URL}/api/login/`, formData);
      
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      checkLoggedInUser();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrors>;
        if (axiosError.response?.data) {
          setErrors(axiosError.response.data);
        }
      } else {
        setErrors({ non_field_errors: ['An unexpected error occurred'] });
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

          {errors.detail && <p className="error">{errors.detail}</p>}

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

