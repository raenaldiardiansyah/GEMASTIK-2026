import { Star } from "lucide-react";

interface OverallRatingDisplayProps {
  score: number;
  maxScore?: number;
  className?: string;
}

/**
 * READ-ONLY.
 * This component is NOT a rating input.
 * User rating is provided exclusively through
 * the existing emoji slider in FoodRatingModal.
 */
export function OverallRatingDisplay({ score, maxScore = 4, className = "" }: OverallRatingDisplayProps) {
  // Calculate how many full, half, and empty stars to show
  // We normalize to a 5-star display conceptually, or just render maxScore stars.
  // Since maxScore is 4 based on our 1-4 scale mapping:
  const normalizedScore = Math.min(Math.max(score, 0), maxScore);
  
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {Array.from({ length: maxScore }).map((_, i) => {
          const isFilled = i < Math.round(normalizedScore);
          return (
            <Star
              key={i}
              className={`w-6 h-6 transition-colors ${
                isFilled ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"
              }`}
            />
          );
        })}
      </div>
      <div className="text-sm font-black text-slate-700 tracking-tight">
        {normalizedScore.toFixed(1)} <span className="text-slate-400 font-bold">/ {maxScore.toFixed(1)}</span>
      </div>
    </div>
  );
}
