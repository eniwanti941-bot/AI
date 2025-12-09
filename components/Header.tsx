
import React, { useState } from 'react';

interface HeaderProps {
  onNewChat: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNewChat, searchQuery, onSearchChange }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 p-4 shadow-lg flex justify-between items-center">
      <div className="flex-1"></div> {/* Left Spacer */}
      <div className="flex-1 text-center">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-500 text-transparent bg-clip-text animate-pulse">
          Gemini Memory Chat
        </h1>
        <p className="text-sm text-gray-400 mt-1">Your Super-Intelligent AI Companion</p>
      </div>
      <div className="flex-1 flex justify-end items-center gap-2">
        <div className="flex items-center transition-all duration-300 ease-in-out">
          <div className={`transition-all duration-300 ease-in-out ${isSearchVisible ? 'w-36 md:w-48' : 'w-0'}`}>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className={`bg-gray-800 border border-gray-600 rounded-lg p-2 w-full transition-opacity duration-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none ${isSearchVisible ? 'opacity-100' : 'opacity-0'}`}
              aria-label="Search conversation"
            />
          </div>
          <button
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50"
            title="Search Conversation"
            aria-label="Search Conversation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        <button
          onClick={onNewChat}
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50"
          title="Start New Chat"
          aria-label="Start New Chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
