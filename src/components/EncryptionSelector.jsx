import React from 'react';
import { Wifi, Shield } from 'lucide-react';
import Button from './UI/Button'; 

const EncryptionSelector = ({ encryption, onChange, touchEncryption, labelIcon }) => {
  const options = [
    { type: 'WPA', icon: Shield, desc: 'Most secure (recommended)' },
    { type: 'WEP', icon: Shield, desc: 'Legacy security (less secure)' },
    { type: 'OPEN', icon: Wifi, desc: 'No password required' },
  ];

  return (
    <div>
      <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-[var(--color-text)]">
        {labelIcon && React.createElement(labelIcon, { size: 16 })}
        Security Type
      </label>

      <div className="flex flex-wrap gap-3">
        {options.map(opt => {
          const isSelected = encryption === opt.type;

          return (
            <Button
              key={opt.type}
              variant="outline"
              className={`btn-outline flex-1 p-4 rounded-xl border-1 transition-all duration-300 text-left items-start justify-start
                ${isSelected
                  ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]'
                  : 'bg border-[var(--color-border)]'
                }`}
              onClick={() => {
                onChange(isSelected ? null : opt.type);
                touchEncryption && touchEncryption();
              }}
            >
              <div className="flex items-center gap-2 text-left">
                {React.createElement(opt.icon, { size: 20 })}
                <span className="font-semibold">{opt.type}</span>
              </div>

              <p className="text-xs text-left hidden sm:block">
                {opt.desc}
              </p>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default EncryptionSelector;
