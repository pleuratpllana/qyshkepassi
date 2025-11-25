import { memo } from "react";

const LandingLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-[var(--color-bg)] p-4">
      <div className="w-full h-full max-h-[90vh] flex justify-center items-center">
        {children}
      </div>
    </div>
  );
};

export default memo(LandingLayout);
