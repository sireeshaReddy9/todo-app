import React from 'react';

const ErrorMessage = ({ error, onClose }) => {
  if (!error) return null;
  
  return (
    <div className="error">
      {error}
      {onClose && (
        <button onClick={onClose} className="error-close">×</button>
      )}
    </div>
  );
};

export default ErrorMessage;