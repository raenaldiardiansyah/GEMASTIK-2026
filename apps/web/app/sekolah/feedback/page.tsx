"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Camera,
  Star,
  Send,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  Sparkles,
  Utensils
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  waktu: string;
}

export default function FeedbackSekolahPage() {
  const [rating, setRating] = useState(5);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "C-1",
      sender: "bot",
      text: "Halo Ibu/Bapak Guru! Saya AI Assistant B.O.G.A. Apakah makanan matang hari ini dalam kondisi baik dan jumlah porsi sesuai?",
      waktu: "12:15 WIB"
    }
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: `C-${messages.length + 1}`,
      sender: "user",
      text: chatInput,
      waktu: "Baru saja"
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `C-${messages.length + 2}`,
        sender: "bot",
        text: "Terima kasih atas laporannya! Laporan Anda telah diproses oleh NLP Engine kami dan langsung diteruskan ke Dasbor Auditor untuk evaluasi pencairan dana SPPG.",
        waktu: "Baru saja"
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Container Mobile-First Centered */}
      <div className="w-full max-w-xl min-h-screen border-x border-border bg-card/10 flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-4 border-b border-border bg-card/60 backdrop-blur flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold text-sm leading-none">Penerimaan Makanan Matang Sekolah</h3>
              <p className="text-xs text-muted-foreground mt-0.5">SDN 164 Karang Pawulang • 460 Siswa</p>
            </div>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs">
            14 Aug 2026
          </Badge>
        </div>

        {/* Main Content */}
        <div className="p-5 space-y-6 flex-1">
          
          {/* Photo Capture Card */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              1. Ambil Foto Sampel Hidangan Hari Ini
            </label>
            <div
              onClick={() => setPhotoUploaded(true)}
              className="w-full h-44 rounded-lg border-2 border-dashed border-primary/40 hover:border-primary transition-colors bg-background/50 flex flex-col items-center justify-center cursor-pointer p-4 relative overflow-hidden"
            >
              {photoUploaded ? (
                <div className="flex flex-col items-center text-emerald-500 space-y-1">
                  <CheckCircle2 className="w-10 h-10" />
                  <span className="text-xs font-bold font-mono">FOTO SAJIAN TERVERIFIKASI AI VISION</span>
                  <span className="text-[11px] text-muted-foreground">Komposisi: Nasi, Ayam Goreng, Sayur Capcay, Buah Pisang</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-muted-foreground space-y-2">
                  <Camera className="w-8 h-8 text-primary" />
                  <span className="text-xs font-medium text-foreground">Klik untuk Ambil / Unggah Foto Makanan</span>
                  <span className="text-[11px]">Memasukkan foto mengaktifkan analisa kualitas AI Vision</span>
                </div>
              )}
            </div>
          </div>

          {/* Portion & Rating Slider */}
          <div className="space-y-3 p-4 rounded border border-border bg-background">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              2. Tingkat Kepuasan & Kesesuaian Porsi
            </label>
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition-transform focus:outline-none"
                >
                  <Star className={`w-8 h-8 ${star <= rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`} />
                </button>
              ))}
            </div>
            <p className="text-center text-xs font-mono font-semibold text-emerald-500">
              {rating === 5 ? "Sangat Memuaskan (5/5)" : `${rating}/5 Bintang`}
            </p>
          </div>

          {/* Quick Chatbot Trigger Box */}
          <div className="p-4 rounded border border-primary/30 bg-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-xs leading-none">Ada Keluhan / Ketidaksesuaian?</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">Laporkan ke AI Chatbot Assistant</p>
              </div>
            </div>
            <Button
              onClick={() => setChatOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs h-9 px-3 flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Buka Chat
            </Button>
          </div>

        </div>

        {/* Footer Submit Button */}
        <div className="p-4 border-t border-border bg-card/50">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-11 flex items-center justify-center gap-2">
            <ThumbsUp className="w-4 h-4" /> Kirim Evaluasi Sekolah ke Audit Trail
          </Button>
        </div>

      </div>

      {/* Floating Chatbot Sheet */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-x-0 bottom-0 max-w-xl mx-auto h-[75vh] bg-background border-t border-x border-border rounded-t-2xl shadow-2xl z-50 flex flex-col"
          >
            {/* Sheet Header */}
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">Chatbot AI Evaluator B.O.G.A</span>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1"
              >
                Tutup
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-card/20">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-primary text-primary-foreground font-medium"
                        : "bg-muted text-foreground border border-border"
                    }`}
                  >
                    {m.text}
                    <span className="block text-[9px] opacity-70 mt-1 text-right">{m.waktu}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-border bg-background flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ketik keluhan (misal: porsi kurang 20)..."
                className="flex-1 bg-muted/40 border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none"
              />
              <Button onClick={handleSendMessage} className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-3">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
