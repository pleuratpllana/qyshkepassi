import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const FormInput = ({ label, placeholder, error, register, icon: Icon, value }) => {
  const [hasBlurred, setHasBlurred] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (hasBlurred && value && value.trim() !== "") {
      setShowCheck(true);
    } else {
      setShowCheck(false);
    }
  }, [hasBlurred, value]);

  return (
    <div className="relative">
      <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-[var(--color-text)]">
        {Icon && <Icon size={18} />}
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        {...register}
        onBlur={() => setHasBlurred(true)}
        className="w-full p-4 pr-10 rounded-xl font-medium focus:outline-none focus:ring border border-[var(--color-border)]  text-[var(--color-text)]"
      />
      {showCheck && (
        <div className="absolute right-3 top-14 -translate-y-1/2 p-1 rounded-full bg-[var(--color-midbg)]">
          <Check size={16} className="text-[var(--color-primary)]" />
        </div>
      )}
      {error && <div className="text-xs mt-1 text-red-400">{error}</div>}
    </div>
  );
};

export default FormInput;
