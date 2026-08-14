"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  RotateCcw,
  FileText,
  Inbox,
  Activity,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export type FeedItemType = "success" | "warning" | "info" | "refund";

export interface FeedItem {
  id: string;
  type: FeedItemType;
  message: string;
  time: string;
  href: string;
}

const iconMap: Record<FeedItemType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4" />,
  warning: <AlertCircle className="w-4 h-4" />,
  info: <FileText className="w-4 h-4" />,
  refund: <RotateCcw className="w-4 h-4" />,
};

const colorMap: Record<FeedItemType, string> = {
  success: "bg-status-success-bg text-status-success",
  warning: "bg-status-warning-bg text-status-warning",
  info: "bg-status-info-bg text-status-info",
  refund: "bg-status-danger-bg text-status-danger",
};

const dotMap: Record<FeedItemType, string> = {
  success: "bg-status-success",
  warning: "bg-status-warning",
  info: "bg-status-info",
  refund: "bg-status-danger",
};

interface ActivityFeedProps {
  items: FeedItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  const router = useRouter();

  return (
    <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-role-primary flex items-center justify-center text-white shadow-card">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">Log Aktivitas</h2>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              Stream real-time sistem
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-role-surface rounded-full border border-border">
          <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
          <span className="text-[10px] font-bold text-role-primary uppercase tracking-wider">
            Live
          </span>
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-10 text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border flex items-center justify-center mb-2">
            <Inbox className="w-5 h-5 text-muted" />
          </div>
          <p className="text-xs font-semibold text-muted">
            Belum ada aktivitas hari ini
          </p>
        </motion.div>
      )}

      {/* Feed Items */}
      {items.length > 0 && (
        <div className="divide-y divide-border flex-1">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-muted-bg/60 transition-colors text-left group"
              >
                {/* Type Icon */}
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${colorMap[item.type]}`}
                >
                  {iconMap[item.type]}
                </div>

                {/* Dot */}
                <div
                  className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${dotMap[item.type]}`}
                />

                {/* Message */}
                <p className="flex-1 text-xs font-semibold text-slate-800 leading-snug truncate">
                  {item.message}
                </p>

                {/* Time */}
                <span className="flex-shrink-0 text-[10px] font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  {item.time}
                </span>

                {/* Arrow indicator */}
                <div className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center text-muted-foreground/50 group-hover:text-role-primary transition-colors">
                  <ChevronRight className="w-3 h-3" />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
