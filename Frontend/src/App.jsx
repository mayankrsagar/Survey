import React from "react";

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminResponses from "./Admin/AdminResponses";
import Ahome from "./Admin/Ahome";
import SurveyForms from "./Admin/SurveyForms";
import UserEdit from "./Admin/UserEdit";
import Users from "./Admin/Users";
/* ---------- lazy imports ---------- */
import LoginSignup from "./components/LoginSignup";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute"; // ← NEW
import CreateSurvey from "./User/CreateSurvey";
import MyForms from "./User/MyForms";
import RespondSurvey from "./User/RespondSurvey";
import ViewResponse from "./User/ViewResponse";

const App = () => (
  <Router>
    <Routes>
      {/* ---------- PUBLIC (login only) ---------- */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginSignup />
          </PublicOnlyRoute>
        }
      />

      {/* ---------- AUTO-REDIRECT ROOT ---------- */}
      {/* <Route path="/" element={<Navigate to="/createsurvey" replace />} /> */}

      {/* ---------- USER ROUTES (any auth'd user) ---------- */}
      <Route
        path="/createsurvey"
        element={
          <ProtectedRoute>
            <CreateSurvey />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mysurveyforms"
        element={
          <ProtectedRoute>
            <MyForms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/respond/:id"
        element={
          <ProtectedRoute>
            <RespondSurvey />
          </ProtectedRoute>
        }
      />
      <Route
        path="/responses/:id"
        element={
          <ProtectedRoute>
            <ViewResponse />
          </ProtectedRoute>
        }
      />

      {/* ---------- ADMIN ROUTES ---------- */}
      <Route
        path="/ahome"
        element={
          <ProtectedRoute role="admin">
            <Ahome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute role="admin">
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/useredit/:id"
        element={
          <ProtectedRoute role="admin">
            <UserEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/surveyforms"
        element={
          <ProtectedRoute role="admin">
            <SurveyForms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adminresponses/:id"
        element={
          <ProtectedRoute role="admin">
            <AdminResponses />
          </ProtectedRoute>
        }
      />

      {/* ---------- 404 ---------- */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default App;
