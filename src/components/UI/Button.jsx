const Button = ({
  children,
  onClick,
  href,
  target,
  rel,
  className = "",
  disabled = false,
  variant = "default", 
  size = "default", 
  ...props
}) => {
  const baseClass = "btn";
  const variantClass = variant !== "default" ? `btn-${variant}` : "";
  const sizeClass = size !== "default" ? `btn-${size}` : "";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  const combinedClass = `${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${className}`.trim();

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={combinedClass}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={combinedClass}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
