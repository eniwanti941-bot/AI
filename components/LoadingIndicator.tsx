
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-start gap-3">
        <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.24a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-.477-2.387a2 2 0 01.547-1.806z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.572 8.572a2 2 0 00.547 1.806l.477 2.387a6 6 0 003.86.517l.318.158a6 6 0 013.86.517l2.387-.477a2 2 0 001.022-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86L15.95 4.76a2 2 0 00-1.806-.547a2 2 0 00-1.022.547l-2.387.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L4.023 6.766a2 2 0 00-.547 1.806z" />
            </svg>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center space-x-2">
                <span className="text-gray-400">Gemini is thinking</span>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            </div>
        </div>
    </div>
  );
};

export default LoadingIndicator;
