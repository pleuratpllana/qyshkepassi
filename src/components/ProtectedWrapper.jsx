import React, { memo } from "react";
import { useAuth } from "../context/AuthContext";
import EmailVerificationScreen from "./EmailVerificationScreen";

const ProtectedWrapper = ({ children }) => {
  const { user, loading, isConfirmed } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        Loading Authentication...
      </div>
    );
  }

  if (user && !isConfirmed) {
    return <EmailVerificationScreen />;
  }

  return children;
};

export default memo(ProtectedWrapper);
