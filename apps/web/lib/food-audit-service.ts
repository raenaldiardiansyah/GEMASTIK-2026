export type ChatSender = "AI" | "USER" | "SYSTEM";

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  chips?: string[];
  imageUrl?: string;
  type?: string;
}

export interface FoodAuditContext {
  overallRating: number;
  ratings: {
    [key: string]: number; // e.g. "hygiene": 2
  };
  lowRatedCriteria: string[];
  evidencePhoto: File | null;
  existingComment?: string;
}

export interface FoodAuditAIProvider {
  sendMessage(message: string, context: FoodAuditContext): Promise<{ reply: string; chips?: string[]; isDone: boolean; summaryData?: any }>;
  initConversation(context: FoodAuditContext): Promise<{ reply: string; chips?: string[] }>;
}

export class MockFoodAuditProvider implements FoodAuditAIProvider {
  private step = 0;

  private getCriteriaName(key: string): string {
    const map: Record<string, string> = {
      hygiene: "higienitas",
      capacity: "kapasitas/porsi",
      sanitation: "sanitasi alat makan",
      punctuality: "ketepatan waktu",
      accuracy: "akurasi pesanan",
    };
    return map[key] || key;
  }

  async initConversation(context: FoodAuditContext): Promise<{ reply: string; chips?: string[] }> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency
    this.step = 1;

    if (context.lowRatedCriteria.includes("PENGADUAN_MANUAL")) {
      return {
        reply: `Halo! Anda terhubung dengan layanan pengaduan dan investigasi GIZANTARA. Silakan ketik detail keluhan atau kendala yang Anda temui di lapangan. Anda bisa bercerita sebanyak yang diperlukan, dan menekan tombol Submit jika sudah selesai.`,
      };
    }

    const lowIssues = context.lowRatedCriteria.map(c => this.getCriteriaName(c)).join(" dan ");
    const issueText = lowIssues ? ` pada aspek ${lowIssues}` : "";

    return {
      reply: `Halo! Saya melihat ada rating rendah${issueText} beserta foto bukti yang Bapak/Ibu kirimkan. Bisa dijelaskan lebih detail apa masalah utamanya?`,
    };
  }

  async sendMessage(message: string, context: FoodAuditContext): Promise<{ reply: string; chips?: string[]; isDone: boolean; summaryData?: any }> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (this.step === 1) {
      this.step = 2;
      return {
        reply: `Baik, saya mencatat masalah tersebut. Apakah kondisi ini terjadi pada sebagian besar porsi yang didistribusikan hari ini, atau hanya beberapa saja?`,
        isDone: false,
      };
    }

    if (this.step === 2) {
      this.step = 3;
      return {
        reply: `Dimengerti. Sebagai tambahan, apakah Bapak/Ibu melihat masalah lainnya seperti pada kemasan atau kondisi makanan tersebut? Silakan ceritakan.`,
        isDone: false,
      };
    }

    // Continuing steps infinitely since they will manually submit
    this.step++;
    return {
      reply: `Terima kasih atas informasi tambahannya. Laporan investigasi Anda sedang direkam ke dalam sistem BGN. Anda dapat terus menambahkan detail lainnya, atau menekan tombol Submit di kanan atas jika dirasa sudah cukup lengkap.`,
      isDone: false,
    };
  }
}
