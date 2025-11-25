import PropTypes from "prop-types";
import Button from "./Button";

const DropdownItem = ({ children, onClick, className = "", ...props }) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={`flex items-center gap-2 text-xs rounded ${className}`}
      {...props} 
    >
      {children}
    </Button>
  );
};

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default DropdownItem;
