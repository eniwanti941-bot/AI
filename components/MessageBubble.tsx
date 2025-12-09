
import React, { useEffect, useRef } from 'react';
import { Message, Role } from '../types';

// Let TypeScript know that these libraries are loaded globally from the HTML
declare var marked: { parse(markdown: string): string };
declare var hljs: { highlightElement(element: HTMLElement): void };


interface MessageBubbleProps {
  message: Message;
  searchQuery: string;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const ModelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.24a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-.477-2.387a2 2 0 01.547-1.806z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.572 8.572a2 2 0 00.547 1.806l.477 2.387a6 6 0 003.86.517l.318.158a6 6 0 013.86.517l2.387-.477a2 2 0 001.022-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86L15.95 4.76a2 2 0 00-1.806-.547a2 2 0 00-1.022.547l-2.387.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L4.023 6.766a2 2 0 00-.547 1.806z" />
    </svg>
);


const MessageBubble: React.FC<MessageBubbleProps> = ({ message, searchQuery }) => {
  const isModel = message.role === Role.MODEL;
  const textContent = message.parts.map(part => part.text).join('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && isModel && typeof hljs !== 'undefined') {
      const codeBlocks = contentRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [textContent, isModel]);

  const highlightMatches = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) {
      return text;
    }
    // Using a try-catch block to prevent invalid regex from crashing the app
    try {
      const regex = new RegExp(`(${query})`, 'gi');
      const parts = text.split(regex);
  
      return (
        <>
          {parts.map((part, i) =>
            regex.test(part) ? (
              <mark key={i} className="bg-cyan-400/50 text-white rounded px-1 py-0.5">
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </>
      );
    } catch (error) {
      console.error("Invalid regex in search query:", error);
      return text; // Fallback to unhighlighted text
    }
  };
  
  const bubbleClasses = isModel
    ? 'bg-gray-800'
    : 'bg-indigo-600/80';
  
  const containerClasses = isModel 
    ? 'justify-start' 
    : 'justify-end';

  const renderContent = () => {
    if (isModel && typeof marked !== 'undefined') {
      let processedText = textContent;
      if (searchQuery.trim()) {
        try {
          // Escape special characters for regex
          const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`(${escapedQuery})`, 'gi');
          // Wrap matches with a mark tag that marked will preserve
          processedText = processedText.replace(regex, `<mark class="bg-cyan-400/50 text-white rounded px-1 py-0.5">$1</mark>`);
        } catch (error) {
          console.error("Invalid regex in search query:", error);
          // Fallback to original text if regex is bad
        }
      }
      const rawMarkup = marked.parse(processedText);
      return (
        <div
          ref={contentRef}
          className="prose prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2"
          dangerouslySetInnerHTML={{ __html: rawMarkup }}
        />
      );
    }
    // For user messages or if marked isn't loaded
    return <div className="whitespace-pre-wrap">{highlightMatches(textContent, searchQuery)}</div>;
  };

  return (
    <div className={`flex items-start gap-3 ${containerClasses}`}>
      {isModel && <div className="flex-shrink-0 mt-1"><ModelIcon /></div>}
      <div className={`max-w-xl md:max-w-2xl rounded-lg p-4 shadow-md ${bubbleClasses}`}>
        {renderContent()}
      </div>
      {!isModel && <div className="flex-shrink-0 mt-1"><UserIcon /></div>}
    </div>
  );
};

export default MessageBubble;
