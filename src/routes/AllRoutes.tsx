import {Routes, Route} from "react-router-dom";
import { HomePage, LoginPage, RegisterPage } from "../pages";
import { PrivateRoute, PublicRoute } from "./PrivateRoute";
import { ReactElement } from 'react';

export const AllRoutes = (): ReactElement => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
      <Route path="/index.html" element={<PrivateRoute element={<HomePage />} />} />

      <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
      <Route path="/register" element={<PublicRoute element={<RegisterPage />} />} />
    </Routes>
  );
};