"use client";

import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle2, QrCode, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

export function QRScannerModal({ isOpen, onClose, onScan }: QRScannerModalProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [scannedData, setScannedData] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setScannedData(null);

      // Auto-simulate scan completion after 1.8 seconds
      const timer = setTimeout(() => {
        const dummyCode = "MANIFEST-MBG-2026-GEOFENCE-50M-VERIFIED";
        setScannedData(dummyCode);
        setIsScanning(false);
        onScan(dummyCode);
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onScan]);

  const handleManualScan = () => {
    const dummyCode = "MANIFEST-MBG-2026-GEOFENCE-50M-VERIFIED";
    setScannedData(dummyCode);
    setIsScanning(false);
    onScan(dummyCode);
  };

  const resetScanner = () => {
    setIsScanning(true);
    setScannedData(null);
    setTimeout(() => {
      const dummyCode = "MANIFEST-MBG-2026-GEOFENCE-50M-VERIFIED";
      setScannedData(dummyCode);
      setIsScanning(false);
      onScan(dummyCode);
    }, 1800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-black flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              Pindai QR Serah Terima
            </DialogTitle>
            <Badge variant="outline" className="text-[10px] font-mono text-emerald-400 border-emerald-500/40 bg-emerald-500/10">
              Mode Simulasi
            </Badge>
          </div>
          <DialogDescription className="text-slate-400 text-xs">
            Mendeteksi kode QR manifest paket makanan di titik koordinat sekolah.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {isScanning ? (
            <div className="relative aspect-square w-full bg-slate-950 rounded-2xl border-2 border-dashed border-emerald-500/40 flex flex-col items-center justify-center overflow-hidden">
              {/* Animated Laser Scanning Line */}
              <motion.div 
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981]"
                animate={{
                  top: ["10%", "90%", "10%"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              />

              {/* QR Mock Center */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-32 h-32 rounded-xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-xs flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-emerald-400/80 animate-pulse" />
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-bold">
                  <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
                  Memindai Dokumen Surat Jalan...
                </div>
              </div>

              {/* Quick bypass button */}
              <button 
                onClick={handleManualScan}
                className="absolute bottom-3 text-[10px] text-slate-400 hover:text-emerald-300 underline font-medium z-20"
              >
                Klik untuk verifikasi instan
              </button>
            </div>
          ) : (
            <div className="aspect-square w-full bg-emerald-950/30 rounded-2xl border-2 border-emerald-500/40 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-3">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-base font-black text-white mb-1">Verifikasi Berhasil</h4>
              <p className="text-xs text-slate-300 mb-2">
                Manifest dan koordinat GPS telah tervalidasi di dalam radius 50m.
              </p>
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-lg p-2.5 mb-4 w-full text-left">
                <p className="text-[9px] font-mono uppercase text-slate-400 font-bold">Payload QR:</p>
                <p className="text-[11px] text-emerald-400 font-mono font-bold truncate">
                  {scannedData}
                </p>
              </div>
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1 bg-slate-800 border-slate-700 hover:bg-slate-700 text-white text-xs h-9" 
                  onClick={resetScanner}
                >
                  Pindai Ulang
                </Button>
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 shadow-md" 
                  onClick={onClose}
                >
                  Konfirmasi Selesai
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
