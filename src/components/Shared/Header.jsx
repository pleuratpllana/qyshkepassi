import { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { User, Moon, Sun, ChevronDown, Globe, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useGlobal } from "../../context/GlobalContext";
import Logo from "../../assets/Logo.svg";
import AuthModal from "./AuthModal";
import Dropdown from "../UI/Dropdown";
import DropdownItem from "../UI/DropdownItem";
import Button from "../UI/Button";

const Header = ({ onLogoutReset }) => {
  const { t, i18n } = useTranslation();
  const { isLight, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { resetQR } = useGlobal();
  const displayName = user?.user_metadata?.name || user?.email;

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = useCallback(async () => {
    try {
      await logout();
      resetQR();
      onLogoutReset?.();
      navigate("/");
    } catch (err) {
      console.error("Sign out failed", err);
      alert("Sign out failed");
    }
  }, [logout, navigate, onLogoutReset, resetQR]);

  const changeLanguage = useCallback(
    (lang) => {
      i18n.changeLanguage(lang);
      localStorage.setItem('preferredLanguage', lang);
    },
    []
  );

  return (
    <>
      <header className="sticky top-0 z-50 transition-colors duration-300 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-8 sm:px-8 lg:px-4">
          <div className="relative h-16 flex items-center justify-center w-full">

            {/* Theme toggle */}
            <div className="absolute left-0 top-6 flex items-center h-full px-2 flex-shrink-0">
              <Button
                onClick={toggleTheme}
                title={isLight ? t("darkMode") : t("lightMode")}
                variant="ghost"
                className="p-2.5 rounded-lg flex items-center justify-center"
              >
                <Sun
                  size={18}
                  className={`absolute inset-0 transition-all duration-300 text-current ${isLight ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
                />
                <Moon
                  size={18}
                  className={`absolute inset-0 transition-all duration-300 text-current ${isLight ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
                />
              </Button>
            </div>

            {/* Logo */}
            <div
  className="flex items-center justify-center gap-0 cursor-pointer"
  onClick={() => navigate("/")}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    className={`h-7 w-12 transition-colors duration-300 ${isLight ? "text-[var(--color-link)]" : "text-white"}`}
  >
    <g>
      <g>
        <path fill="currentColor" d="M42,120.9h79.1V41.8H42V120.9z M54.3,54.1h54.4v54.4H54.3V54.1z"/>
        <path fill="currentColor" d="M67.4,67.2h28.4v28.4H67.4V67.2z"/>
        <path fill="currentColor" d="M213.3,41.8h-79.1v79.1h79.1V41.8L213.3,41.8z M201,108.6h-54.5V54.1H201L201,108.6L201,108.6z"/>
        <path fill="currentColor" d="M159.6,67.2h28.4v28.4h-28.4V67.2z"/>
        <path fill="currentColor" d="M42,212.8h79.1v-79.1H42V212.8z M54.3,146h54.4v54.4H54.3V146z"/>
        <path fill="currentColor" d="M67.4,159.1h28.4v28.4H67.4V159.1z"/>
        <path fill="currentColor" d="M165.4,177.1v-13.8h13.8v-14.1h-13.8v-13.8h-14.1v13.8h-13.8v14.1h13.8v13.8H165.4z"/>
        <path fill="currentColor" d="M208.8,178.8H195v-13.8h-14.1v13.8h-13.8v14.1h13.8v13.8H195v-13.8h13.8V178.8z"/>
        <path fill="currentColor" d="M212.3,168.4v-31h-1.1v-3.7h-31v14.1h18v20.6L212.3,168.4L212.3,168.4z"/>
        <path fill="currentColor" d="M149.3,177.4h-14.1v31h1.1h13.1h18v-14.1h-18V177.4L149.3,177.4z"/>
        <path fill="currentColor" d="M14.9,59.2c2.6,0,4.6-2.1,4.6-4.6V21.2h30.8c2.6,0,4.6-2.1,4.6-4.6c0-2.6-2.1-4.6-4.6-4.6H14.9c-2.5,0-4.6,2.1-4.6,4.6v38C10.3,57.2,12.4,59.2,14.9,59.2z"/>
        <path fill="currentColor" d="M241.4,12H206c-2.6,0-4.6,2.1-4.6,4.6s2.1,4.6,4.6,4.6h30.8v33.4c0,2.6,2.1,4.6,4.6,4.6c2.6,0,4.6-2.1,4.6-4.6v-38C246,14.1,243.9,12,241.4,12z"/>
        <path fill="currentColor" d="M50,234.8H19.2v-33.4c0-2.6-2.1-4.6-4.6-4.6c-2.6,0-4.6,2.1-4.6,4.6v38c0,2.6,2.1,4.6,4.6,4.6H50c2.6,0,4.6-2.1,4.6-4.6S52.6,234.8,50,234.8z"/>
        <path fill="currentColor" d="M241.4,196.8c-2.6,0-4.6,2.1-4.6,4.6v33.4H206c-2.6,0-4.6,2.1-4.6,4.6s2.1,4.6,4.6,4.6h35.4c2.6,0,4.6-2.1,4.6-4.6v-38C246,198.8,243.9,196.8,241.4,196.8z"/>
      </g>
    </g>
  </svg>
  <span className={`font-bold text-base transition-colors duration-300 ${isLight ? "text-[var(--color-link)]" : "text-white"}`}>
    QyshKePass-i?
  </span>
</div>


            {/* Profile & Language */}
            <div className="absolute right-0 flex items-center h-full flex-shrink-0 gap-2">
              {user ? (
                <Dropdown
                  align="left"
                  width="w-40"
                  trigger={
                    <Button variant="ghost" className="flex items-center gap-1 p-0 m-0">
                      <User size={22} className="text-current" />
                      <span className="font-medium text-sm hidden sm:inline text-current">{displayName}</span>
                    </Button>
                  }
                >
                  <DropdownItem onClick={() => navigate("/profile")}>
                    <User size={16} />
                    Profile
                  </DropdownItem>

                  <DropdownItem onClick={handleSignOut}>
                    <LogOut size={16} />
                    Sign Out
                  </DropdownItem>
                </Dropdown>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  variant="ghost"
                  className="flex items-center gap-1 p-0 m-0"
                >
                  <User size={16} className="text-current" />
                  <span className="font-medium text-sm hidden sm:inline text-current">{t("login")}</span>
                </Button>
              )}

              <div className="w-px h-4 bg-[var(--color-border)] mx-2" />

              <Dropdown
                align="right"
                width="w-18"
                controlledOpen={langOpen}
                onOpenChange={setLangOpen}
                trigger={
                  <Button variant="ghost" className="flex items-center gap-1 text-xs font-semibold p-0 m-0">
                    <Globe size={14} className="text-current" />
                    <span className="text-current">{i18n.language === "en" ? "EN" : "SQ"}</span>
                    <ChevronDown
                      size={14}
                      className={`text-current transition-transform duration-200 ${langOpen ? "rotate-180" : "rotate-0"}`}
                    />
                  </Button>
                }
              >
                <DropdownItem onClick={() => changeLanguage("en")}>EN</DropdownItem>
                <DropdownItem onClick={() => changeLanguage("sq")}>SQ</DropdownItem>
              </Dropdown>
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default memo(Header);
