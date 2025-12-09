
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { Chat } from '@google/genai';
import { Message } from './types';
import { Role } from './types';
import { initializeChat, sendMessageToAI } from './services/geminiService';
import Header from './components/Header';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import ErrorDisplay from './components/ErrorDisplay';

const CHAT_STORAGE_KEY = 'gemini-chat-session';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const chatSession = useRef<Chat | null>(null);

  // Load chat on initial render
  useEffect(() => {
    try {
      const savedMessagesJSON = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMessagesJSON) {
        const savedMessages: Message[] = JSON.parse(savedMessagesJSON).map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp), // Re-hydrate Date objects
        }));
        setMessages(savedMessages);
        const historyForAI = savedMessages.map(({ role, parts }) => ({ role, parts }));
        // Remove last model response if it was an error message placeholder
        const lastMessage = historyForAI[historyForAI.length - 1];
        if(lastMessage.role === Role.MODEL && lastMessage.parts[0].text.startsWith('Sorry, I encountered an error:')){
            historyForAI.pop();
        }
        chatSession.current = initializeChat(historyForAI);
      } else {
        const initialMessage = {
          role: Role.MODEL,
          parts: [{ text: "Hello! I am a super-intelligent AI with memory. How can I assist you today?" }],
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
        chatSession.current = initializeChat();
      }
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during initialization.";
        setError(`Initialization failed: ${errorMessage}. Please check your API key.`);
    }
  }, []);

  // Auto-save chat to localStorage
  useEffect(() => {
    // Don't save if it's just the initial welcome message
    if (messages.length > 1) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: Role.USER,
      parts: [{ text }],
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      if (!chatSession.current) {
        throw new Error("Chat session is not initialized.");
      }

      const stream = await sendMessageToAI(chatSession.current, text);
      
      let modelResponse = '';
      const modelMessage: Message = {
          role: Role.MODEL,
          parts: [{ text: '' }],
          timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, modelMessage]);

      for await (const chunk of stream) {
        modelResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === Role.MODEL) {
            lastMessage.parts = [{ text: modelResponse }];
          }
          return newMessages;
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
       setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          // Replace the loading placeholder with an error message
          if (lastMessage && lastMessage.role === Role.MODEL) {
              lastMessage.parts = [{ text: `Sorry, I encountered an error: ${errorMessage}` }];
          }
          return newMessages;
       });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleNewChat = useCallback(() => {
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      const initialMessage = {
          role: Role.MODEL,
          parts: [{ text: "Hello! I am a super-intelligent AI with memory. How can I assist you today?" }],
          timestamp: new Date(),
      };
      setMessages([initialMessage]);
      chatSession.current = initializeChat();
    } catch (e) {
       const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
       setError(`Failed to start new chat: ${errorMessage}`);
    }
  }, []);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) {
      return messages;
    }
    return messages.filter(msg =>
      msg.parts.some(part =>
        part.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [messages, searchQuery]);


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <Header onNewChat={handleNewChat} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      {error && <ErrorDisplay message={error} onClose={() => setError(null)} />}
      <MessageList messages={filteredMessages} isLoading={isLoading} searchQuery={searchQuery} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
