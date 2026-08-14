"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldAlert, ArrowRight, ArrowLeft, Image as ImageIcon, Mic } from "lucide-react";
import { FoodAuditContext, ChatMessage, MockFoodAuditProvider } from "../../lib/food-audit-service";

interface FoodAuditChatbotProps {
  context: FoodAuditContext;
  onComplete: (summaryData: any) => void;
  onBack: () => void;
}

export function FoodAuditChatbot({ context, onComplete, onBack }: FoodAuditChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Instance of our mock provider
  const providerRef = useRef(new MockFoodAuditProvider());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    let isMounted = true;
    const initChat = async () => {
      setIsTyping(true);
      const res = await providerRef.current.initConversation(context);
      if (isMounted) {
        setIsTyping(false);
        setMessages([
          {
            id: Date.now().toString(),
            sender: "AI",
            text: res.reply,
            chips: res.chips,
          }
        ]);
      }
    };
    initChat();
    return () => { isMounted = false; };
  }, [context]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Clear chips from last AI message
    setMessages(prev => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (last && last.sender === "AI") {
        last.chips = undefined;
      }
      return copy;
    });

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "USER",
      text,
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const res = await providerRef.current.sendMessage(text, context);
      
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "AI",
          text: res.reply,
          chips: res.chips,
        }
      ]);

      if (res.isDone && res.summaryData) {
        // Chatbot is done, wait a moment then trigger onComplete
        setTimeout(() => {
          onComplete(res.summaryData);
        }, 3000);
      }
    } catch (e) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          sender: "SYSTEM",
          text: "Terjadi kesalahan koneksi AI.",
        }
      ]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="w-full h-full flex flex-col bg-[#F8FAFC]"
    >
      <header className="px-4 py-3 bg-white border-b border-slate-100 flex items-center gap-3 shadow-sm z-10 shrink-0">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-indigo-500" />
        </div>
        <div className="flex-1 truncate">
          <h3 className="font-black text-slate-800 text-sm truncate">Gizantara AI Engine</h3>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest truncate">Investigator Aktif</p>
        </div>
        <button
          onClick={() => {
            const userMessages = messages.filter(m => m.sender === "USER").map(m => m.text);
            const keluhanText = userMessages.length > 0 ? userMessages.join(" | ") : "Dilaporkan manual tanpa detail teks tambahan.";
            onComplete({
              status_visual: "PENGADUAN_MANUAL",
              keluhan: keluhanText,
              risiko: "MENUNGGU_TINJAUAN"
            });
          }}
          className="ml-auto px-4 py-2 bg-indigo-600 text-white text-[11px] font-bold rounded-full shadow-md hover:bg-indigo-700 active:scale-95 transition-all shrink-0"
        >
          Submit
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-4" ref={scrollRef}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col max-w-[85%] ${
                msg.sender === "USER" ? "self-end items-end" : "self-start items-start"
              }`}
            >
              <div
                className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                  msg.sender === "USER"
                    ? "bg-indigo-600 text-white rounded-br-sm"
                    : msg.sender === "SYSTEM"
                    ? "bg-rose-50 text-rose-700 border border-rose-100 rounded-bl-sm flex gap-2 items-start"
                    : "bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-sm"
                }`}
              >
                {msg.sender === "SYSTEM" && <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />}
                <span className="whitespace-pre-wrap">{msg.text}</span>
              </div>

              {/* Bubblechat rekomendasi dihilangkan sesuai instruksi 
              {msg.chips && msg.chips.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2 mt-2"
                >
                  {msg.chips.map(chip => (
                    <button
                      key={chip}
                      onClick={() => handleSend(chip)}
                      className="px-3 py-1.5 bg-white border border-indigo-100 text-indigo-600 text-xs font-bold rounded-full hover:bg-indigo-50 active:scale-95 transition-all shadow-sm"
                    >
                      {chip}
                    </button>
                  ))}
                </motion.div>
              )}
              */}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex self-start bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-sm shadow-sm gap-1 items-center h-[52px]">
            <motion.div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
            <motion.div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
            <motion.div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
          </div>
        )}
      </main>

      <footer className="p-4 bg-white border-t border-slate-100 shrink-0">
        <div className="flex gap-2 items-center">
          <button className="text-slate-400 hover:text-indigo-600 p-2 shrink-0 transition-colors">
            <ImageIcon className="w-6 h-6" />
          </button>
          <button className="text-slate-400 hover:text-indigo-600 p-2 shrink-0 transition-colors mr-1">
            <Mic className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(inputText)}
            placeholder="Ketik keluhan..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all min-w-0"
          />
          <button
            onClick={() => handleSend(inputText)}
            disabled={!inputText.trim() || isTyping}
            className="w-12 h-12 shrink-0 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:active:scale-100 active:scale-95 transition-all"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </motion.div>
  );
}
