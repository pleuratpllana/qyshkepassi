// src/components/Dropdown/Dropdown.jsx
import React, { useState, useRef, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const dropdownVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.12 } },
};

const Dropdown = forwardRef(function Dropdown(
  {
    trigger,
    children,
    align = "right",
    width = "w-40",
    controlledOpen,
    onOpenChange,
    closeOnItemClick = true,
    className = "",
  },
  forwardedRef
) {
  const internalRef = useRef(null);
  const ref = forwardedRef || internalRef;

  const [openInternal, setOpenInternal] = useState(false);
  const isControlled = typeof controlledOpen === "boolean";
  const open = isControlled ? controlledOpen : openInternal;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) {
        if (isControlled) onOpenChange?.(false);
        else {
          setOpenInternal(false);
          onOpenChange?.(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, isControlled, onOpenChange]);

  const toggle = (next) => {
    const newState = typeof next === "boolean" ? next : !open;
    if (isControlled) onOpenChange?.(newState);
    else {
      setOpenInternal(newState);
      onOpenChange?.(newState);
    }
  };

  const clonedTrigger = React.cloneElement(trigger, {
    onClick: (e) => {
      e?.stopPropagation();
      trigger.props.onClick?.(e);
      toggle();
    },
    "aria-expanded": open,
    "aria-haspopup": "true",
    "data-dropdown-open": open, 
  });

  const alignClass = align === "left" ? "left-0" : "right-0";

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      {clonedTrigger}

      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            className={`absolute mt-2 ${alignClass} ${width} rounded-xl shadow-md z-50 flex flex-col space-y-2 items-start bg-[var(--color-lightbg)] p-2`}
            onClick={() => closeOnItemClick && toggle(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Dropdown.propTypes = {
  trigger: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(["left", "right"]),
  width: PropTypes.string,
  controlledOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  closeOnItemClick: PropTypes.bool,
  className: PropTypes.string,
};

export default Dropdown;
