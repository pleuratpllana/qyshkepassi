import  { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { X, User, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FormWrapper from "../FormWrapper";
import FormInput from "../FormInput";
import PasswordInput from "../PasswordInput";
import Button from "../UI/Button";

const backdrop = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
const modalAnim = { hidden: { opacity: 0, y: 20, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22 } }, exit: { opacity: 0, y: 20, scale: 0.96, transition: { duration: 0.18 } } };

const AuthModal = ({ isOpen, onClose }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { login: loginUser, register: registerUser } = useAuth();
  const { register, handleSubmit, watch, reset, formState: { errors, touchedFields } } = useForm({
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "" }
  });

  const watched = watch();
  const password = watched.password;

  const calculateStrength = (pwd) => {
    if (!pwd) return { width: "0%", color: "", label: "" };
    if (pwd.length < 6) return { width: "33%", color: "bg-red-400", label: "Weak" };
    if (pwd.length < 10) return { width: "66%", color: "bg-yellow-400", label: "Medium" };
    return { width: "100%", color: "bg-green-400", label: "Strong" };
  };

  const onSubmit = async (data) => {
    try {
      if (isRegisterMode) {
        await registerUser(data); 
      } else {
        await loginUser(data); 
      }
      reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.9)] backdrop-blur-sm"
        >
          <motion.div variants={modalAnim} initial="hidden" animate="visible" exit="exit" className="w-full max-w-md relative shadow-xl">
            <Button onClick={onClose} className=" p-3 btn-ghost absolute top-4 right-4 text-[var(--color-text)] bg-[var(--color-accentbg)] hover:bg-[var(--color-lightbg)] transition">
              <X size={16} />
            </Button>

            <AnimatePresence mode="wait">
              <motion.div key={isRegisterMode ? "register" : "login"} variants={modalAnim} initial="hidden" animate="visible" exit="exit">
                <FormWrapper
                  title={isRegisterMode ? "Register" : "Login"}
                  onSubmit={handleSubmit(onSubmit)}
                  submitLabel={isRegisterMode ? "Register" : "Login"}
                >
                  {({ submitted }) => (
                    <>
                      {isRegisterMode && (
                        <FormInput
                          label="Name"
                          placeholder="Enter your name"
                          value={watched.name || ""}
                          register={register("name", { required: "Name is required" })}
                          error={submitted && errors.name?.message}
                          icon={User}
                          isTouched={touchedFields.name}
                        />
                      )}
                      <FormInput
                        label="Email"
                        placeholder="Enter your email"
                        value={watched.email || ""}
                        register={register("email", {
                          required: "Email required",
                          pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: "Invalid email" }
                        })}
                        error={submitted && errors.email?.message}
                        icon={Mail}
                        isTouched={touchedFields.email}
                      />
                      <PasswordInput
                        label="Password"
                        placeholder="Enter password"
                        register={register("password", { required: "Password required" })}
                        showStrength={!!password}
                        strength={calculateStrength(password)}
                        error={submitted && errors.password?.message}
                        value={password}
                        isTouched={touchedFields.password}
                      />
                    </>
                  )}
                </FormWrapper>
              </motion.div>
            </AnimatePresence>

            <div className="text-sm text-center mt-4 text-[var(--color-text)]">
              {isRegisterMode ? (
                <span>
                  Already have an account?{" "}
                  <Button type="button" onClick={() => setIsRegisterMode(false)} className="btn-ghost underline font-semibold bg-transparent p-0">
                    Login
                  </Button>
                </span>
              ) : (
                <span>
                  Don't have an account?{" "}
                  <Button type="button" onClick={() => setIsRegisterMode(true)} className="btn-ghost underline font-semibold bg-transparent p-0">
                    Register
                  </Button>
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
