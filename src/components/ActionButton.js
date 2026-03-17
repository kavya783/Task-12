import React from "react";

function ActionButton({ text, icon, className, onClick }) {
  return (
    <button
      type="button"
      className={`btn ${className}`}
      onClick={onClick}
    >
      {icon && <i className={`bi ${icon} me-1`}></i>}
      {text}
    </button>
  );
}

export default ActionButton;