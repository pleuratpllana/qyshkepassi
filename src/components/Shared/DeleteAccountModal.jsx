import { motion, AnimatePresence } from "framer-motion";
import Button from "../UI/Button";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalAnim = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, y: 20, scale: 0.96, transition: { duration: 0.18 } }
};

const DeleteAccountModal = ({ isOpen, onClose, onDelete }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.8)] backdrop-blur-sm"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="w-full max-w-md bg-[var(--color-lightbg)] rounded-xl p-6 shadow-lg text-[var(--color-text)]"
            variants={modalAnim}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-xl font-semibold mb-4">Confirm Account Deletion</h2>
            <p className="text-sm mb-6 opacity-80">
              This will permanently delete your account and all saved cards. Are you sure?
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                className="btn-ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={onDelete}
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAccountModal;
