import { toast } from "react-toastify";
import { Check } from "lucide-react";

export const showToast = ({ message, success = true, theme = "dark" }) => {
  const iconColor = "var(--color-accentbg)";

  toast(
    <div className="flex items-center gap-2">
      {success && <Check size={20} className={`text-[${iconColor}]`} />}
      <span>{message}</span>
    </div>,
    {
      position: "top-right",
      autoClose: 2000,
      toastClassName: "Toastify__toast",
      progressClassName: "Toastify__progress-bar",
      theme, 
    }
  );
};
