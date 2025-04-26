import React, { useState } from 'react';
import axios, { AxiosError } from "axios";
import { Link } from 'react-router-dom';

interface FormData {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

interface ApiErrors {
  username?: string[];
  email?: string[];
  password1?: string[];
  password2?: string[];
  non_field_errors?: string[];
  [key: string]: any;
}

export const RegisterPage = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<ApiErrors>({});

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
    setSuccessMessage(null);

    try {
      const response: any = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/register/`, 
        formData
      );
      
      console.log("Success!", response.data);
      setSuccessMessage("Registration Successful!");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrors>;
      console.log("Error during registration!", axiosError.response?.data);
      
      if (axiosError.response?.data) {
        setErrors(axiosError.response.data);
      } else {
        setErrors({ non_field_errors: ["An unexpected error occurred"] });
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