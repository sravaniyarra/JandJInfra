import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import MaterialsPage from "./pages/MaterialsPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import AdminPanel from "./pages/AdminPanel";
import LoginPage from "./pages/LoginPage";
import BudgetPlannerPage from "./pages/BudgetPlannerPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login";

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <BudgetPlannerPage />
            </ProtectedRoute>
          }
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppLayout>
  );
}
