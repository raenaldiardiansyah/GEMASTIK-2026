"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Send, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FoodAuditEvidenceStep } from "./FoodAuditEvidenceStep";
import { FoodAuditChatbot } from "./FoodAuditChatbot";
import { FoodAuditContext } from "../../lib/food-audit-service";
import { OverallRatingDisplay } from "../ui/OverallRatingDisplay";

interface FoodRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  startMode?: "RATING" | "PENGADUAN";
  onSubmitSuccess?: (data: any) => void;
}

const RATING_DATA = [
  {
    label: "Very bad",
    emoji: "☹️",
    color: "bg-[#FFD1D1]", // Soft Pink/Red
    accent: "bg-[#FF4D4D]",
    textColor: "text-[#B30000]",
    description: "Sangat buruk",
  },
  {
    label: "Bad",
    emoji: "😕",
    color: "bg-[#EBD9FF]", // Soft Purple/Lavender
    accent: "bg-[#A855F7]",
    textColor: "text-[#6B21A8]",
    description: "Buruk",
  },
  {
    label: "Very Good",
    emoji: "😊",
    color: "bg-[#D1F7FF]", // Soft Teal/Cyan
    accent: "bg-[#06B6D4]",
    textColor: "text-[#164E63]",
    description: "Sangat baik",
  },
  {
    label: "Excellent",
    emoji: "🤩",
    color: "bg-[#D1FFD6]", // Soft Light Green
    accent: "bg-[#22C55E]",
    textColor: "text-[#14532D]",
    description: "Sangat luar biasa",
  },
];

type FlowState = "RATING" | "EVIDENCE" | "ANALYZING" | "CHATBOT" | "SUMMARY" | "COMMENT";

export const FoodRatingModal = ({ isOpen, onClose, startMode = "RATING", onSubmitSuccess }: FoodRatingModalProps) => {
  const [flowState, setFlowState] = useState<FlowState>("RATING");
  const [currentStep, setCurrentStep] = useState(0);
  const [ratings, setRatings] = useState<Record<number, number>>({ 0: 2, 1: 2, 2: 2, 3: 2, 4: 2 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  const [auditContext, setAuditContext] = useState<FoodAuditContext | null>(null);
  const [summaryData, setSummaryData] = useState<any>(null);

  // Initialize flow based on startMode when modal opens
  useEffect(() => {
    if (isOpen) {
      if (startMode === "PENGADUAN") {
        setFlowState("CHATBOT");
        setAuditContext({
          overallRating: 3,
          ratings: {},
          lowRatedCriteria: ["PENGADUAN_MANUAL"],
          evidencePhoto: null,
        });
      } else {
        setFlowState("RATING");
        setCurrentStep(0);
        setRatings({ 0: 2, 1: 2, 2: 2, 3: 2, 4: 2 });
        setAuditContext(null);
        setSummaryData(null);
        setComment("");
      }
    }
  }, [isOpen, startMode]);

  // Criteria according to the overhaul plan
  const STEPS = [
    { label: "Higienitas", desc: "Bagaimana kebersihan makanan hari ini?" },
    { label: "Kapasitas", desc: "Apakah porsi yang diberikan sudah cukup?" },
    { label: "Sanitasi", desc: "Bagaimana kebersihan alat makan & lingkungan?" },
    { label: "Penyajian Tepat Waktu", desc: "Apakah makanan disajikan sesuai jadwal?" },
    { label: "Akurasi Pesanan", desc: "Apakah menu yang diterima sudah benar?" },
  ];

  const SUGGEST_BUBBLES = [
    "Makanannya enak tidak hari ini?",
    "Ada yang perlu diperbaiki dari kebersihannya?",
    "Pelayanannya sudah tepat waktu?",
  ];

  useEffect(() => {
    if (flowState === "ANALYZING") {
      const timer = setTimeout(() => {
        setFlowState("CHATBOT");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [flowState]);

  const currentRating = ratings[currentStep] ?? 2;
  const currentData = RATING_DATA[currentRating];

  const handleNext = () => {
    if (flowState === "RATING") {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Step 4 is the final rating (5th criteria)
        // Calculate average and check low criteria
        const values = Object.values(ratings).map(r => r + 1); // map 0-3 to 1-4
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / 5;
        
        const lowCriteriaKeys: string[] = [];
        Object.entries(ratings).forEach(([stepStr, val]) => {
          if (val <= 1) { // 0 or 1 maps to 1 or 2
            const stepNum = parseInt(stepStr);
            if (stepNum === 0) lowCriteriaKeys.push("hygiene");
            else if (stepNum === 1) lowCriteriaKeys.push("capacity");
            else if (stepNum === 2) lowCriteriaKeys.push("sanitation");
            else if (stepNum === 3) lowCriteriaKeys.push("punctuality");
            else if (stepNum === 4) lowCriteriaKeys.push("accuracy");
          }
        });

        // Decision Engine based on user requirement
        if (avg <= 3.0 || lowCriteriaKeys.length > 0) {
          setAuditContext({
            overallRating: avg,
            ratings: {
              hygiene: (ratings[0] || 0) + 1,
              capacity: (ratings[1] || 0) + 1,
              sanitation: (ratings[2] || 0) + 1,
              punctuality: (ratings[3] || 0) + 1,
              accuracy: (ratings[4] || 0) + 1,
            },
            lowRatedCriteria: lowCriteriaKeys,
            evidencePhoto: null
          });
          setFlowState("EVIDENCE");
        } else {
          setFlowState("COMMENT");
        }
      }
    } else if (flowState === "COMMENT" || flowState === "SUMMARY") {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (flowState === "RATING") {
      if (currentStep > 0) {
        setCurrentStep(prev => prev - 1);
      } else {
        onClose();
      }
    } else if (flowState === "COMMENT") {
      setFlowState("RATING");
    } else if (flowState === "EVIDENCE") {
      setFlowState("RATING");
    } else if (flowState === "CHATBOT") {
      // Cannot go back easily from active chat without resetting, but we can allow it
      setFlowState("EVIDENCE");
    }
  };

  const handleSuggestClick = (text: string) => {
    setComment(prev => prev ? `${prev} ${text}` : text);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSubmitSuccess && summaryData) {
        onSubmitSuccess(summaryData);
      }
      onClose();
      toast.success("Laporan berhasil dikirim!");
    }, 1500);
  };

  // Determine background color based on flow state
  const getBackgroundColor = () => {
    if (flowState === "COMMENT" || flowState === "SUMMARY") return "#F8FAFF";
    if (flowState === "EVIDENCE" || flowState === "CHATBOT" || flowState === "ANALYZING") return "#F1F5F9";
    return currentRating === 0 ? "#FFD1D1" : currentRating === 1 ? "#EBD9FF" : currentRating === 2 ? "#D1F7FF" : "#D1FFD6";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[100] border-x border-slate-200"
        >
          {/* Animated Background Overlay */}
          <motion.div
            animate={{ backgroundColor: getBackgroundColor() }}
            className="absolute inset-0 transition-colors duration-500"
          />

          {/* Subtle Stripes Background Effect */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 100%' }}
          />

          <div className="relative h-full flex flex-col p-6 overflow-hidden">
            {/* Header (Hidden during CHATBOT so chatbot UI can take over fully) */}
            {flowState !== "CHATBOT" && (
              <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBack}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-slate-800 hover:bg-white/30 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600/60 leading-none mb-1">Audit Sekolah</span>
                    <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">
                      {flowState === "RATING" ? STEPS[currentStep].label : flowState === "COMMENT" ? "Komentar & Saran" : flowState === "EVIDENCE" ? "Unggah Bukti" : "Ringkasan"}
                    </span>
                  </div>
                </div>
                {flowState === "RATING" && (
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <div key={s} className={`h-1 rounded-full transition-all duration-300 ${s <= currentStep ? 'w-4 bg-indigo-500' : 'w-1.5 bg-slate-300/40'}`}></div>
                    ))}
                  </div>
                )}
              </header>
            )}

            {/* Main Content */}
            <main className={`flex-1 flex flex-col ${flowState === "CHATBOT" ? 'w-[calc(100%+3rem)] h-[calc(100%+3rem)] -m-6' : 'items-center justify-center text-center relative'}`}>
              <AnimatePresence mode="wait">
                {flowState === "RATING" && (
                  <motion.div
                    key={`rating-step-${currentStep}`}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    className="w-full flex flex-col items-center"
                  >
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-12 px-4 leading-tight">
                      {STEPS[currentStep].desc}
                    </h2>

                    <div className="relative w-full flex flex-col items-center mb-16">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentRating}
                          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          exit={{ scale: 1.5, opacity: 0, rotate: 10 }}
                          transition={{ type: "spring", damping: 15 }}
                          className="text-[120px] leading-none mb-4 drop-shadow-2xl"
                        >
                          {currentData.emoji}
                        </motion.div>
                      </AnimatePresence>

                      <motion.div
                        key={`label-${currentRating}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-2xl font-black ${currentData.textColor} tracking-tight`}
                      >
                        {currentData.label}
                      </motion.div>
                    </div>

                    {/* Custom Slider Overlay */}
                    <div className="w-full max-w-xs relative mb-8">
                      <div className="absolute inset-0 flex items-center px-1">
                        <div className="w-full h-1 bg-black/5 rounded-full flex justify-between">
                          {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="w-1 h-1 bg-black/10 rounded-full mt-[-1px]"></div>
                          ))}
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="1"
                        value={currentRating}
                        onChange={(e) => setRatings({ ...ratings, [currentStep]: parseInt(e.target.value) })}
                        className="relative z-10 w-full appearance-none bg-transparent cursor-pointer h-8 accent-transparent
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-xl 
                          [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-indigo-500"
                      />
                      {/* Visual Thumb Overlay */}
                      <motion.div
                        animate={{ left: `${(currentRating / 3) * 100}%` }}
                        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-[6px] border-white shadow-xl pointer-events-none transition-colors duration-300 ${currentData.accent}`}
                      />
                    </div>
                  </motion.div>
                )}

                {flowState === "EVIDENCE" && auditContext && (
                  <FoodAuditEvidenceStep 
                    key="evidence-step"
                    overallScore={auditContext.overallRating} 
                    onContinue={(file) => {
                      setAuditContext({...auditContext, evidencePhoto: file});
                      setFlowState("ANALYZING");
                    }}
                  />
                )}

                {flowState === "ANALYZING" && (
                  <motion.div
                    key="analyzing-step"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="w-full flex-1 flex flex-col items-center justify-center"
                  >
                     <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-indigo-600" />
                       <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                     </div>
                     <h3 className="text-xl font-black text-slate-800 mb-2">Menganalisis Bukti...</h3>
                     <p className="text-sm text-slate-500 font-medium text-center px-8">Gizantara AI sedang memproses foto dan menginisialisasi sesi investigasi.</p>
                  </motion.div>
                )}

                {flowState === "CHATBOT" && auditContext && (
                  <motion.div 
                    key="chatbot-step"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full h-full flex flex-col" 
                  >
                    <FoodAuditChatbot 
                      context={auditContext}
                      onBack={() => {
                        if (startMode === "PENGADUAN") {
                          onClose();
                        } else {
                          setFlowState("EVIDENCE");
                        }
                      }}
                      onComplete={(summary) => {
                        setSummaryData(summary);
                        setFlowState("SUMMARY");
                      }}
                    />
                  </motion.div>
                )}

                {flowState === "SUMMARY" && summaryData && auditContext && (
                  <motion.div
                    key="summary-step"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full flex flex-col items-center px-4"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                       <Send className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Investigasi Selesai</h2>
                    <p className="text-sm text-slate-500 mb-8">Laporan telah disiapkan oleh sistem AI.</p>
                    
                    <div className="w-full bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-left mb-6">
                      <div className="flex justify-between border-b border-slate-100 pb-3 mb-3">
                         <span className="text-slate-500 font-medium text-sm">Rating Keseluruhan</span>
                         <OverallRatingDisplay score={auditContext.overallRating} maxScore={4} className="scale-75 origin-right !gap-0" />
                      </div>
                      <div className="flex flex-col border-b border-slate-100 pb-3 mb-3">
                         <span className="text-slate-500 font-medium text-sm mb-1">Status Visual AI</span>
                         <span className="text-emerald-600 font-bold text-sm">{summaryData.status_visual}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-slate-500 font-medium text-sm mb-1">Skor Risiko Laporan</span>
                         <span className="text-rose-600 font-bold text-sm">{summaryData.risiko}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {flowState === "COMMENT" && (
                  <motion.div
                    key="comment-step"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="w-full flex flex-col"
                  >
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8 px-4 leading-tight">
                      Ada masukan tambahan untuk kami?
                    </h2>

                    {/* Suggest Bubbles - Vertical Layout for Mobile */}
                    <AnimatePresence>
                      {!isFocused && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-col gap-2 mb-4 overflow-hidden"
                        >
                          {SUGGEST_BUBBLES.map((text, idx) => (
                            <motion.button
                              key={idx}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: idx * 0.1 }}
                              onClick={() => handleSuggestClick(text)}
                              className="w-full text-left bg-white px-4 py-3 rounded-2xl border border-slate-100 text-[11px] font-black text-indigo-600/80 shadow-sm active:scale-95 transition-transform"
                            >
                              💡 "{text}"
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Text Area */}
                    <div className="w-full">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Detail laporan tambahan..."
                        className="w-full bg-white rounded-3xl p-5 text-[13px] font-black text-slate-800 placeholder:text-slate-400 outline-none border border-slate-100 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 shadow-sm transition-all resize-none min-h-[140px]"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Footer Action */}
            {(flowState === "RATING" || flowState === "COMMENT" || flowState === "SUMMARY") && (
              <footer className="mt-8 z-10 shrink-0">
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="w-full bg-[#1A1C29] text-white py-5 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all overflow-hidden relative"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      {flowState === "COMMENT" || flowState === "SUMMARY" ? "Kirim Audit" : "Lanjutkan"} 
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                        {flowState === "COMMENT" || flowState === "SUMMARY" ? <Send className="w-3 h-3" /> : "→"}
                      </div>
                    </>
                  )}
                </button>
                
                <p className="text-center mt-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Audit GIZANTARA · Transparansi Gizi Nasional
                </p>
              </footer>
            )}

            {/* Decoration Stars */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-1/4 left-10 text-indigo-400 text-xl"
              >✦</motion.div>
              <motion.div
                animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
                transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                className="absolute top-1/3 right-12 text-blue-400 text-lg"
              >✦</motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
