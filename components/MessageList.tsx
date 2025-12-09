
import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  searchQuery: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, searchQuery }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {messages.length === 0 && searchQuery ? (
        <div className="text-center text-gray-400 mt-10">
          <p className="text-xl font-semibold">No Results Found</p>
          <p>Your search for "{searchQuery}" did not match any messages.</p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <MessageBubble key={`${index}-${msg.timestamp.toISOString()}`} message={msg} searchQuery={searchQuery} />
        ))
      )}
      {isLoading && <LoadingIndicator />}
      <div ref={messagesEndRef} />
    </main>
  );
};

export default MessageList;
