const FormContainer = ({ children, message }) => {
  return (
    <div className="p-8 rounded-2xl bg-[var(--color-lightbg)] transition-all duration-300">
      {children}
      {message && (
        <div className="mt-4 text-sm text-center text-[var(--color-text)]">
          {message}
        </div>
      )}
    </div>
  )
}

export default FormContainer;
