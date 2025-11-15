// router/Router.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "pages/HomePage";
import DashboardPage from "pages/DashboardPage";
import AdminPage from "pages/AdminPage";
import AuthPage from "pages/AuthPage";
import PostPage from "pages/PostPage";
import NotFoundPage from "pages/NotFoundPage";

import WithLayout from "layouts/WithLayout";
import WithoutLayout from "layouts/WithoutLayout";
import ProtectedRoute from "router/ProtectedRoute/ProtectedRoute";
import AuthRedirect from "./ProtectedRoute/AuthRedirect";

function Router() {
  return (
    <Routes>
      {/* === صفحات با هدر و فوتر === */}
      <Route element={<WithLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* === صفحات بدون هدر و فوتر === */}
      <Route element={<WithoutLayout />}>
        <Route
          path="/auth"
          element={
            <AuthRedirect>
              <AuthPage />
            </AuthRedirect>
          }
        />{" "}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default Router;
