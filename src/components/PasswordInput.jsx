import  { useState } from "react";
import { Lock, Eye, EyeOff, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./UI/Button";

const PasswordInput = ({
  label,
  placeholder,
  register,
  generateRandom,
  showStrength = false,
  strength = {},
  error
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold flex items-center gap-2 text-[var(--color-text)]">
          <Lock size={16} /> {label}
        </label>

        {generateRandom && (
          <Button
            type="button"
            onClick={generateRandom}
            className="btn-ghost flex items-center gap-1 text-xs py-1 px-2 bg-[var(--color-lightbg)] hover:bg-[var(--color-lighthover)]"
          >
            <RefreshCw size={14} /> Generate Password
          </Button>
        )}
      </div>

      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register}
          className="w-full p-4 pr-10 rounded-xl font-medium focus:outline-none focus:ring border border-[var(--color-border)]  text-[var(--color-text)]"
          />

        <Button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="btn-ghost absolute right-3 top-1/2 -translate-y-1/2 p-0 text-[var(--color-text)]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={showPassword ? "eyeoff" : "eye"}
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 180, scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>

      {showStrength && strength.label && (
        <div className="mt-2">
          <div className="flex justify-between items-center mt-3 mb-1">
            <span className="text-xs font-medium text-[var(--color-text)]">{strength.label}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--color-bg)] overflow-hidden">
            <div
              className={`${strength.color} h-2 rounded-full transition-all duration-300`}
              style={{ width: strength.width }}
            />
          </div>
        </div>
      )}

      {error && <div className="text-xs mt-1 text-red-400">{error}</div>}
    </div>
  );
};

export default PasswordInput;
