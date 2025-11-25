import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Shared/Header.jsx";
import Footer from "../components/Shared/Footer.jsx";
import { useAuth } from "../context/AuthContext";
import { useCards } from "../context/CardContext";

const MAX_CARDS = 10;

const SharedLayout = ({ children, resetLanding }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { cards } = useCards();

  const message = useMemo(() => {
    if (!user) return t("registerToSaveCards");

    const count = cards?.length || 0;
    const remaining = MAX_CARDS - count;

    if (remaining <= 0) return t("maxCardsReached");
    return t("youCanSaveMoreCards", { count: remaining });
  }, [user, cards, t]);

  return (
    <div className="relative flex flex-col min-h-screen bg-[var(--color-bg)] transition-colors duration-300 overflow-hidden">
      <Header onLogoutReset={resetLanding} />
      <main className="flex-1 w-full flex justify-center items-center relative z-10">
        <div className="w-full max-w-7xl px-4 flex flex-col items-center">
          {children}
          <div className="mt-6 text-sm text-center text-[var(--color-text)]">{message}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default memo(SharedLayout);
  