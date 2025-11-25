import  { useState, useRef, useEffect } from "react";
import { Phone, Copy, Download, Printer, RotateCw, Bookmark, ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "./UI/Button";
import { useTheme } from "../context/ThemeContext";
import { useCards } from "../context/CardContext";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../utils/toast";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";

const dropdownVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, y: -5, transition: { duration: 0.1 } },
};

const ShareQRCode = ({ value, networkName, password, security, onGenerateNew }) => {
  const { t } = useTranslation();
  const { isLight } = useTheme();
  const { user, isConfirmed } = useAuth();
  const { cards, saveCard } = useCards();
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportRef = useRef(null);

  if (!value) return null;

  const handleCopyPassword = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    showToast({ message: t("passwordCopied"), success: true, theme: isLight ? "light" : "dark" });
  };

  const handleDownload = () => {
    fetch(value)
      .then(res => res.blob())
      .then(blob => saveAs(blob, `${networkName}-wifi-qr.png`));
    showToast({ message: t("qrDownloaded"), success: true, theme: isLight ? "light" : "dark" });
  };

  const handlePrint = () => {
    const printContainer = document.createElement("div");
    printContainer.style.position = "fixed";
    printContainer.style.top = "0";
    printContainer.style.left = "0";
    printContainer.style.width = "100%";
    printContainer.style.height = "100%";
    printContainer.style.backgroundColor = "white";
    printContainer.style.display = "flex";
    printContainer.style.flexDirection = "column";
    printContainer.style.alignItems = "center";
    printContainer.style.justifyContent = "center";
    printContainer.style.padding = "20px";
    printContainer.style.zIndex = "9999";

    printContainer.innerHTML = `
      <h2 style="margin-bottom: 20px;">${networkName} QR Code</h2>
      <img src="${value}" style="max-width: 90%; height: auto; margin-bottom: 10px" />
      <p><strong>Security:</strong> ${security || "No Password"}</p>
      ${password ? `<p><strong>Password:</strong> ${password}</p>` : ""}
    `;

    document.body.appendChild(printContainer);

    const hidden = Array.from(document.body.children).filter(el => el !== printContainer);
    hidden.forEach(el => (el.style.display = "none"));

    window.print();

    hidden.forEach(el => (el.style.display = ""));
    document.body.removeChild(printContainer);

    showToast({ message: t("printed"), success: true, theme: isLight ? "light" : "dark" });
  };

  const handleExport = (format) => {
    if (!value) return;

    switch (format) {
      case "png":
      case "jpeg":
        fetch(value).then(res => res.blob()).then(blob => saveAs(blob, `${networkName}-wifi-qr.${format}`));
        break;
      case "pdf":
        const doc = new jsPDF();
        doc.text(`${networkName} QR Code`, 10, 10);
        doc.addImage(value, "PNG", 10, 20, 100, 100);
        doc.save(`${networkName}-wifi-qr.pdf`);
        break;
    }

    setShowExportDropdown(false);
    showToast({ message: t("saved"), success: true, theme: isLight ? "light" : "dark" });
  };

  const handleSaveCard = async () => {
    if (!user || !isConfirmed) return;
    const exists = cards.some(c => c.qr_url === value);
    if (exists) {
      showToast({ message: t("cardAlreadySaved"), success: false });
      return;
    }
    await saveCard({ qr_url: value, title: networkName, password: password || "", encryption: security || "", ssid: networkName });
    showToast({ message: t("qrCardSavedSuccessfully"), success: true });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setShowExportDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const message = encodeURIComponent(`${t("shareInstructions")} "${networkName}"`);

  const buttonActions = [
    { icon: Phone, label: t("shareWhatsApp"), onClick: null, href: `https://wa.me/?text=${message} ${encodeURIComponent(value)}` },
    password && { icon: Copy, label: t("copyPassword"), onClick: handleCopyPassword },
    { icon: Download, label: t("download"), onClick: handleDownload },
    { icon: Printer, label: t("print"), onClick: handlePrint },
    { icon: RotateCw, label: t("generateNew"), onClick: onGenerateNew },
    user && isConfirmed && { icon: Bookmark, label: t("saveCard"), onClick: handleSaveCard },
  ].filter(Boolean);

  return (
    <div className="flex flex-col items-center mt-6 gap-6 text-center w-full p-0">
      <img src={value} alt={`${networkName} QR`} className="w-56 h-56 border rounded-lg border-[var(--color-text)] mx-auto" />
      <div className="flex flex-col gap-1 text-[var(--color-text)]">
        <span><strong>{t("networkName")}:</strong> {networkName}</span>
        <span><strong>{t("security")}:</strong> {security || t("nopass")}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {buttonActions.map((act, i) => (
          act.href ? (
            <Button key={i} href={act.href} target="_blank" rel="noopener noreferrer">
              <act.icon size={16} /> {act.label}
            </Button>
          ) : (
            <Button key={i} onClick={act.onClick} >
              <act.icon size={16} /> {act.label}
            </Button>
          )
        ))}

        <div className="relative" ref={exportRef}>
          <Button onClick={() => setShowExportDropdown(!showExportDropdown)}>
            <ArrowUp size={16} /> {t("exportAs")}
          </Button>
          <AnimatePresence>
            {showExportDropdown && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 mt-2 w-28 bg-[var(--color-bg)] rounded-xl shadow-lg z-50 flex flex-col"
              >
                {["png", "jpeg", "pdf"].map(fmt => (
                  <button key={fmt} onClick={() => handleExport(fmt)} className="btn-dropdown">
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ShareQRCode;
