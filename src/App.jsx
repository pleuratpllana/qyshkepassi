// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, Navigate, BrowserRouter as Router } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { GlobalProvider, useGlobal } from "./context/GlobalContext.jsx";
import { CardProvider } from "./context/CardContext.jsx";
import LandingLayout from "./layouts/Landing.jsx";
import SharedLayout from "./layouts/Shared.jsx";
import MainPage from "./pages/Main.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SavedCardsPage from "./pages/SaveCardsPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import EmailVerificationScreen from "./components/EmailVerificationScreen.jsx";
import SlideToStart from "./components/SlideToStart.jsx";
import reactionLottie from "./assets/wifi.json";
import { ToastContainer } from "react-toastify";
import { showToast } from "./utils/toast";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CardProvider>
            <GlobalProvider>
              <Router>
                <AppContent />
              </Router>
            </GlobalProvider>
          </CardProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const AppContent = () => {
  const { user, loading, isConfirmed } = useAuth();
  const { isLight } = useTheme();
  const { setFormVisible } = useGlobal();
  const toastShownRef = useRef(false);

  const [phase, setPhase] = useState(() => {
    const landingDone = localStorage.getItem("landingCompleted");
    return landingDone ? "main" : "landing";
  });

  const handleLandingComplete = () => {
    localStorage.setItem("landingCompleted", "true");
    setPhase("lottie");
    setTimeout(() => {
      setFormVisible(true);
      if (user && !isConfirmed) setPhase("emailVerification");
      else setPhase("main");
    }, 2000);
  };

  useEffect(() => {
    if (!loading && user && !isConfirmed) setPhase("emailVerification");
    else if (!loading && user && isConfirmed) setPhase("main");
  }, [loading, user, isConfirmed]);

  useEffect(() => {
    if (!loading && user && isConfirmed && !toastShownRef.current) {
      toastShownRef.current = true;
      const toastKey = `toast-shown-${user.id}`;
      if (!localStorage.getItem(toastKey)) {
        setTimeout(() => {
          const userName = user.user_metadata?.name || user.email;
          showToast({
            message: `Welcome, ${userName.split("@")[0]}! Your email is confirmed.`,
            success: true,
            theme: isLight ? "light" : "dark",
          });
          localStorage.setItem(toastKey, "true");
        }, 100);
      }
    }
  }, [loading, user, isConfirmed, isLight]);

  if (loading) return null;

  return (
    <div className="relative w-full min-h-screen bg-[var(--color-bg)]">
      <AnimatePresence mode="wait">
        {phase === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full h-full"
          >
            <LandingLayout>
              <SlideToStart onComplete={handleLandingComplete} />
            </LandingLayout>
          </motion.div>
        )}

        {phase === "lottie" && (
          <motion.div
            key="lottie"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
          >
            <Lottie
              animationData={reactionLottie}
              loop={false}
              style={{ width: 200, height: 200 }}
            />
          </motion.div>
        )}

        {phase === "emailVerification" && (
          <motion.div
            key="emailVerification"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full h-full"
          >
            <SharedLayout>
              <EmailVerificationScreen />
            </SharedLayout>
          </motion.div>
        )}

        {phase === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 w-full h-full"
          >
            <SharedLayout>
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/saved-cards"
                  element={user && isConfirmed ? <SavedCardsPage /> : <Navigate to="/" />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SharedLayout>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme={isLight ? "light" : "dark"}
      />
    </div>
  );
};
