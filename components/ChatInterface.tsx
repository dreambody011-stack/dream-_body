import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { generateFitnessAdvice } from '../services/geminiService';
import { Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const ChatInterface: React.FC<{ user: User }> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: `## ELITE COACH ONLINE\n\nWelcome, **${user.name}**.\n\nI have analyzed your profile:\n- Weight: **${user.currentWeight}kg**\n- Height: **${user.height}cm**\n\nI am ready to optimize your programming. State your objective.` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const userContext = `
      Name: ${user.name}
      Gender: ${user.gender}
      Weight: ${user.currentWeight}kg
      Height: ${user.height}cm
      Age (approx): ${user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : 'Unknown'}
      Current Diet Plan Summary: ${user.dietPlan ? user.dietPlan.substring(0, 300) : 'None assigned'}...
      Current Workout Plan Summary: ${user.workoutPlan ? user.workoutPlan.substring(0, 300) : 'None assigned'}...
    `;

    const responseText = await generateFitnessAdvice(userMsg.text, userContext);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: responseText }]);
  };

  // Helper to render markdown-like structures (Headers, Bold, Lists)
  const renderMessageText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimLine = line.trim();
      
      // Empty lines as spacers
      if (!trimLine) return <div key={i} className="h-3" />;
      
      // H2 Headers (##)
      if (trimLine.startsWith('## ')) {
        return (
          <h2 key={i} className="text-xl font-bold text-white mt-4 mb-2 border-b border-slate-700 pb-2">
            {trimLine.replace(/^##\s+/, '')}
          </h2>
        );
      }

      // H3 Headers (###)
      if (trimLine.startsWith('### ')) {
        return (
          <h3 key={i} className="text-lg font-bold text-cyan-400 mt-3 mb-1 uppercase tracking-wide">
            {trimLine.replace(/^###\s+/, '')}
          </h2>
        );
      }

      // Lists
      const isList = trimLine.startsWith('- ') || trimLine.startsWith('* ');
      
      return (
        <div key={i} className={`text-slate-200 leading-relaxed ${isList ? 'pl-4 relative mb-1' : 'mb-2'}`}>
          {isList && <span className="absolute left-0 text-cyan-500 font-bold">•</span>}
          {/* Bold Parsing */}
          {trimLine.replace(/^[-*]\s+/, '').split(/(\*\*.*?\*\*)/).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="text-cyan-300 font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </div>
      );
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[600px] shadow-2xl overflow-hidden">
       {/* Header */}
       <div className="p-4 border-b border-slate-800 flex items-center bg-slate-950">
          <div className="relative">
            <div className="h-12 w-12 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-cyan-900/50">
               <Bot className="text-white h-7 w-7" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-slate-900"></div>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg tracking-wide">AI HEAD COACH</h3>
            <div className="text-xs text-cyan-400 flex items-center font-medium bg-cyan-950/30 px-2 py-0.5 rounded-full w-fit mt-1">
              <Sparkles className="h-3 w-3 mr-1" />
              PERFORMANCE OPTIMIZED
            </div>
          </div>
       </div>

       {/* Messages Area */}
       <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] rounded-2xl p-5 shadow-lg backdrop-blur-sm ${
                  msg.sender === 'user' 
                  ? 'bg-cyan-600 text-white rounded-tr-sm' 
                  : 'bg-slate-800 border border-slate-700 rounded-tl-sm'
               }`}>
                  {msg.sender === 'ai' ? renderMessageText(msg.text) : msg.text}
               </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start animate-pulse">
               <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm p-4 flex space-x-2 items-center">
                  <div className="text-xs text-cyan-400 font-mono">ANALYZING BIOMETRICS...</div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
       </div>

       {/* Input Area */}
       <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex gap-3">
             <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="Request workout plan, diet adjustments, or motivation..."
               className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none placeholder-slate-500 transition-all"
             />
             <button 
               onClick={handleSend}
               disabled={!input.trim() || isTyping}
               className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-white p-4 rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center aspect-square"
             >
               <Send className="h-5 w-5" />
             </button>
          </div>
       </div>
    </div>
  );
};

export default ChatInterface;