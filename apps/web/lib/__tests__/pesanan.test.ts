import { describe, it, expect } from 'vitest';
import { getPOTab, type PO } from '../pesanan';

describe('Pesanan Logic (getPOTab)', () => {
  const basePO: PO = {
    purchaseOrderId: "TEST-001",
    sppgId: "SCHOOL-01",
    orderDate: new Date().toISOString(),
    financials: {
      totalAmount: 1000,
      paymentStatus: "MENUNGGU_KONFIRMASI",
      signatures: { qc: "PENDING", admin: "PENDING", logistik: "PENDING" }
    },
    items: []
  };

  it('harus mengembalikan status "pending" untuk pesanan baru', () => {
    const tab = getPOTab(basePO);
    expect(tab).toBe('pending');
  });

  it('harus mengembalikan status "rejected" jika vendor menolak', () => {
    const po: PO = { ...basePO, vendor_status: "REJECTED" };
    const tab = getPOTab(po);
    expect(tab).toBe('rejected');
  });

  it('harus mengembalikan status "expired" jika batas waktu terlampaui', () => {
    const po: PO = { 
      ...basePO, 
      financials: { ...basePO.financials, paymentStatus: "EXPIRED" } 
    };
    const tab = getPOTab(po);
    expect(tab).toBe('expired');
  });

  it('harus mengembalikan status "completed" jika semua tanda tangan lengkap', () => {
    const po: PO = { 
      ...basePO, 
      financials: { 
        ...basePO.financials, 
        signatures: { qc: "SIGNED", admin: "SIGNED", logistik: "SIGNED" } 
      } 
    };
    const tab = getPOTab(po);
    expect(tab).toBe('completed');
  });

  it('harus mengembalikan status "scan" jika dalam tahap SIAP_AMBIL', () => {
    const po: PO = { 
      ...basePO, 
      financials: { ...basePO.financials, paymentStatus: "SIAP_AMBIL" } 
    };
    const tab = getPOTab(po);
    expect(tab).toBe('scan');
  });

  it('harus mengembalikan status "scan" jika dalam tahap MANUAL_REVIEW', () => {
    const po: PO = { 
      ...basePO, 
      financials: { ...basePO.financials, paymentStatus: "MANUAL_REVIEW" } 
    };
    const tab = getPOTab(po);
    expect(tab).toBe('scan');
  });

  // New tests for payment flow
  it('harus mengembalikan status "pending" untuk MENUNGGU_BUKTI_TRANSFER', () => {
    const po: PO = { 
      ...basePO, 
      financials: { ...basePO.financials, paymentStatus: "MENUNGGU_BUKTI_TRANSFER" } 
    };
    const tab = getPOTab(po);
    expect(tab).toBe('pending');
  });

  it('harus mengembalikan status "scan" untuk OCR_VALIDATING', () => {
    const po: PO = { 
      ...basePO, 
      financials: { ...basePO.financials, paymentStatus: "OCR_VALIDATING" } 
    };
    const tab = getPOTab(po);
    expect(tab).toBe('scan');
  });
});
