import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import QuizEngine from './pages/QuizEngine';
import Results from './pages/Results';
import LeaderboardPage from './pages/LeaderboardPage';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <QuizEngine />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resultats"
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

