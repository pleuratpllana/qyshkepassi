import  { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "./UI/Button";

const FormWrapper = ({
  title,
  description,
  onSubmit,
  children,
  submitLabel,
  resetLabel,
  loading,
  onReset
}) => {
  const [submitted, setSubmitted] = useState(false);
  const {user} = useAuth();

  const handleSubmitWrapper = async (data) => {
    setSubmitted(true);
    await onSubmit(data);
  };

  return (
    <div className="p-8 rounded-2xl transition-all duration-300 bg-[var(--color-lightbg)]">
      {title && (
        <div className="flex flex-col items-start gap-2 mb-6">
          <h2 className="text-lg font-bold text-[var(--color-text)]">{title}</h2>
          {description && <p className="text-[var(--color-text)]">{description}</p>}
        </div>
      )}

  
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData.entries());
          handleSubmitWrapper(data);
        }}
        className="space-y-6"
      >
        {children({ submitted })}

        <div className="flex gap-4 pt-4">
          {submitLabel && (
            <Button type="submit" className="flex-1 py-4" disabled={loading}>
              {submitLabel}
            </Button>
          )}
          {resetLabel && (
            <Button type="button" onClick={onReset}>
              {resetLabel}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormWrapper;
