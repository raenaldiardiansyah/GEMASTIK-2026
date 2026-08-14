"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Image as ImageIcon, Trash2, ArrowRight } from "lucide-react";
import { OverallRatingDisplay } from "../ui/OverallRatingDisplay";

interface FoodAuditEvidenceStepProps {
  overallScore: number;
  onContinue: (file: File) => void;
}

export function FoodAuditEvidenceStep({ overallScore, onContinue }: FoodAuditEvidenceStepProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (photo) {
      const url = URL.createObjectURL(photo);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [photo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 w-full flex flex-col items-center justify-center py-4"
    >
      <div className="mb-6">
        <OverallRatingDisplay score={overallScore} maxScore={4} />
      </div>

      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2 px-4 leading-tight text-center">
        Mohon Unggah Bukti Foto
      </h2>
      <p className="text-sm font-medium text-slate-500 mb-8 text-center px-6">
        Karena adanya indikasi rating rendah, sistem memerlukan foto makanan sebagai bukti untuk investigasi lebih lanjut.
      </p>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {!previewUrl ? (
        <div className="w-full max-w-[280px] flex flex-col gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-4 rounded-2xl font-bold transition-colors border border-indigo-200"
          >
            <Camera className="w-5 h-5" />
            Buka Kamera
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold transition-colors border border-slate-200"
          >
            <ImageIcon className="w-5 h-5" />
            Pilih dari Galeri
          </button>
        </div>
      ) : (
        <div className="w-full max-w-[280px] flex flex-col items-center">
          <div className="relative w-full h-[180px] rounded-2xl overflow-hidden shadow-md border-4 border-white mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Bukti Makanan" className="w-full h-full object-cover" />
            <button
              onClick={clearPhoto}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => onContinue(photo!)}
            className="w-full flex items-center justify-center gap-2 bg-[#1A1C29] text-white py-4 rounded-2xl font-black shadow-xl active:scale-95 transition-transform"
          >
            Lanjutkan ke Investigasi AI
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
