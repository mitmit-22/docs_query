import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import DocumentsPage from "./features/documents/pages/DocumentsPage.jsx";
import QueryPage from "./features/query/pages/QueryPage.jsx";
import ProtectedRoute from "./lib/ProctectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
      <Route path="/query" element={<ProtectedRoute><QueryPage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/documents" replace />} />
    </Routes>
  );
}