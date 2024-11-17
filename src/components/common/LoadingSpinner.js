// src/components/common/LoadingSpinner.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
      <FontAwesomeIcon
        icon={faSpinner}
        className="text-6xl text-blue-500 animate-spin"
      />
    </div>
  );
};

export default LoadingSpinner;