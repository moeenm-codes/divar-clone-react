import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "pages/HomePage";
import DashboardLayout from "pages/dashboard/DashboardLayout";
import MyPosts from "pages/dashboard/MyPosts";
import FavoritesPage from "pages/dashboard/FavoritesPage";
import SupportPage from "pages/dashboard/SupportPage";

import AdminPage from "pages/AdminPage";
import AuthPage from "pages/AuthPage";
import PostPage from "pages/PostPage";
import NotFoundPage from "pages/NotFoundPage";

import WithLayout from "layouts/WithLayout";
import WithoutLayout from "layouts/WithoutLayout";
import ProtectedRoute from "router/ProtectedRoute/ProtectedRoute";
import AuthRedirect from "./ProtectedRoute/AuthRedirect";
import AddPost from "components/Templates/AddPost";
import EditPost from "components/Templates/EditPost";
import SettingsPage from "pages/dashboard/SettingsPage";

function Router() {
  return (
    <Routes>
      {/* صفحات اصلی با هدر و فوتر */}
      <Route element={<WithLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostPage />} />

        <Route
          path="/addpost"
          element={
            <ProtectedRoute>
              <AddPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editpost/:postId"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />
        {/* داشبورد  -  دیوار */}
        <Route
          path="/my-divar"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/my-divar/my-posts" replace />} />
          <Route path="my-posts" element={<MyPosts />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* پنل ادمین */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* صفحات بدون layout */}
      <Route element={<WithoutLayout />}>
        <Route
          path="/auth"
          element={
            <AuthRedirect>
              <AuthPage />
            </AuthRedirect>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default Router;
