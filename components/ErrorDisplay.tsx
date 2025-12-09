
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onClose: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onClose }) => {
  return (
    <div className="bg-red-800/50 border-l-4 border-red-500 text-red-100 p-4 m-4 rounded-r-lg shadow-lg flex justify-between items-center" role="alert">
      <div>
        <p className="font-bold">Error</p>
        <p>{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-red-700/50 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default ErrorDisplay;
