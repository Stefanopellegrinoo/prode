import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AlertProvider } from './context/AlertContext';
import { TournamentProvider } from './context/TournamentContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import PublicRoute from './components/routing/PublicRoute';
import AdminRoute from './components/routing/AdminRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Predictions = lazy(() => import('./pages/Predictions'));
const FixtureAdmin = lazy(() => import('./pages/FixtureAdmin'));
const Groups = lazy(() => import('./pages/Groups'));
const Profile = lazy(() => import('./pages/Profile'));
const MatchDetail = lazy(() => import('./pages/MatchDetail'));
const Ranking = lazy(() => import('./pages/Ranking'));
const GroupDetail = lazy(() => import("./pages/GroupDetail"))
const TournamentFixtures = lazy(() => import("./pages/TournamentFixtures"))

// const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
// const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <ThemeProvider>
      <AlertProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                {/* <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} /> */}

                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route
                  path="/predictions"
                  element={
                    <ProtectedRoute>
                      <TournamentProvider>
                        <Predictions />
                      </TournamentProvider>
                    </ProtectedRoute>
                  }
                />
                <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
                <Route
                  path="/groups/:id"
                  element={
                    <ProtectedRoute>
                      <GroupDetail />
                    </ProtectedRoute>
                  }
                />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/ranking" element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
                <Route path="/ranking/:id" element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
                <Route path="/match/:id" element={<ProtectedRoute><TournamentFixtures /></ProtectedRoute>} />

                <Route path="/admin/fixture" element={<AdminRoute><FixtureAdmin /></AdminRoute>} />

                {/* <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} /> */}
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
