import React, { useState } from "react";
import { Pen, Check, Eye, EyeOff } from "lucide-react";

const EditableField = ({ label, value, onSave, type = "text", placeholder = "" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = async () => {
    if (inputValue === value) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(inputValue);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-semibold text-[var(--color-text)]">{label}</label>

      <div className="relative w-full">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : "text"}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          disabled={!isEditing}
          className={`w-full p-3 pr-12 rounded-lg border border-[var(--color-border)] bg-[var(--color-lightbg)] text-[var(--color-text)] focus:outline-none focus:ring focus:ring-primary transition ${
            !isEditing ? "cursor-pointer hover:shadow-sm" : ""
          }`}
        />

        {/* Eye toggle for password */}
        {type === "password" && isEditing && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-[var(--color-text)]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {/* Pencil / Check button */}
        <button
          type="button"
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={isEditing && (isSaving || inputValue === value)}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-text)] flex items-center justify-center"
        >
          {isEditing ? (
            <Check size={18} className={`${isSaving ? "animate-pulse" : ""}`} />
          ) : (
            <Pen size={18} />
          )}
        </button>
      </div>
    </div>
  );
};

export default EditableField;
