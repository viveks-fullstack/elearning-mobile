import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./modules/dashboard/Dashboard";
import StudentList from "./modules/students/StudentList";
import TeacherList from "./modules/teachers/TeacherList";
import ClassList from "./modules/classes/ClassList";
import CourseList from "./modules/courses/CourseList";
import Profile from "./modules/profile/Profile";
import Login from "./modules/auth/Login";
import { useAuth } from "./app/authContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layout/AdminLayout";

export default function Router() {
  const { isAuthenticated } = useAuth();

  console.log("Router - isAuthenticated:", isAuthenticated);
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        {/* Protected Layout Route */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/teachers" element={<TeacherList />} />
          <Route path="/classes" element={<ClassList />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
