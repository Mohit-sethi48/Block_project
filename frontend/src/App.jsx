import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import BlogsPage from './pages/BlogsPage.jsx';
import BlogDetailsPage from './pages/BlogDetailsPage.jsx';
import PublicHomePage from './pages/PublicHomePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ListsPage from './pages/ListsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import UsersPage from './pages/UsersPage.jsx';

const App = () => (
  <Routes>
    <Route index element={<PublicHomePage />} />
    <Route path="/blogs/:slug" element={<BlogDetailsPage />} />
    <Route path="/admin/login" element={<LoginPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route index element={<DashboardPage />} />
      <Route path="blogs" element={<BlogsPage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="lists" element={<ListsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
