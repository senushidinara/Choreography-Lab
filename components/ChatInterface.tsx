import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToCoach } from '../services/gemini';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hey dancer! I'm Maestro. I'm here to fix your form and hype up your style. Whether it's perfecting your plié or locking your popping isolation, ask me anything.",
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToCoach(messages, inputValue);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-screen bg-dark-stage relative overflow-hidden">
        {/* Background ambience */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-jazz-purple opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-kpop-blue opacity-10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 z-10">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                    <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-lg ${
                        msg.role === 'user' 
                            ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-tr-none' 
                            : 'bg-gradient-to-br from-jazz-purple to-purple-900 text-white rounded-tl-none border border-purple-700/50'
                    }`}>
                        <div className="flex items-center mb-2 opacity-70 text-xs uppercase tracking-wider font-bold">
                            {msg.role === 'user' ? <User size={12} className="mr-1"/> : <Sparkles size={12} className="mr-1 text-hiphop-neon"/>}
                            {msg.role === 'user' ? 'You' : 'Maestro'}
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.content}</p>
                    </div>
                </div>
            ))}
            {isLoading && (
                 <div className="flex justify-start">
                    <div className="bg-panel-gray rounded-2xl p-4 rounded-tl-none flex items-center space-x-2">
                        <div className="w-2 h-2 bg-hiphop-neon rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-kpop-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-panel-gray/80 backdrop-blur-md border-t border-gray-800 z-20">
            <div className="max-w-4xl mx-auto relative flex items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about technique, style, or request a quick correction..."
                    className="w-full bg-black/50 border border-gray-600 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:border-hiphop-neon focus:ring-1 focus:ring-hiphop-neon transition-all text-white placeholder-gray-500"
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !inputValue.trim()}
                    className="absolute right-2 p-2 bg-white text-black rounded-full hover:bg-hiphop-neon transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    </div>
  );
};