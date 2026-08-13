/**
 * Logic Utility for Order Management (GIZANTARA)
 * Berisi logika penentuan status pesanan dan kategori tab.
 * Status pembayaran mengikuti alur: Transfer Manual SPPG → OCR Validasi → Ledger Audit.
 */

export interface POItem { 
  item_name: string; 
  quantity: number; 
  unit: string; 
  price_at_purchase: number; 
  subtotal: number; 
}

export interface Signatures { 
  qc: "SIGNED" | "PENDING" | "REVISION"; 
  admin: "SIGNED" | "PENDING" | "REVISION"; 
  logistik: "SIGNED" | "PENDING" | "REVISION"; 
}

export interface PO {
  purchaseOrderId: string;
  sppgId: string;
  orderDate: string;
  financials: { 
    totalAmount: number; 
    paymentStatus: string; 
    signatures: Signatures;
  };
  items: POItem[];
  pickup_pin?: string;
  vendor_status?: "REJECTED";
  revision_note?: string;
}

export type Tab = "all" | "pending" | "scan" | "completed" | "expired" | "rejected";

/**
 * Menentukan kategori tab berdasarkan status pesanan dan tanda tangan digital.
 * Logic ini krusial untuk alur Zero-Trust.
 */
export function getPOTab(po: PO): Tab {
  // 1. Prioritas: Penolakan Vendor
  if (po.vendor_status === "REJECTED") return "rejected";
  
  // 2. Prioritas: Batas waktu verifikasi terlampaui
  if (po.financials.paymentStatus === "EXPIRED") return "expired";
  
  const sigs = po.financials.signatures;
  
  // 3. Status: Selesai (Multi-Sig Lengkap)
  const isDone = sigs.qc === "SIGNED" && sigs.admin === "SIGNED" && sigs.logistik === "SIGNED";
  if (isDone) return "completed";
  
  // 4. Status: Proses (Sedang di-scan/verifikasi atau dalam review manual)
  if (["SIAP_AMBIL", "OCR_VALIDATING", "MANUAL_REVIEW"].includes(po.financials.paymentStatus)) {
    return "scan";
  }
  
  // 5. Default: Menunggu Konfirmasi Vendor
  return "pending";
}
