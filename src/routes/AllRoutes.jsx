import {Routes, Route} from "react-router-dom";
import { HomePage, LoginPage, RegisterPage } from "../pages";

export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}
