"use client";

import { useState, useSyncExternalStore } from "react";
import { SplashScene } from "@/components/ui/SplashScene";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { PhaseTimeline } from "@/components/landing/PhaseTimeline";
import { RoleGateways } from "@/components/landing/RoleGateways";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

const noopSubscribe = () => () => {};

function isSplashSeenClient() {
  if (typeof window === "undefined") return true;
  return sessionStorage.getItem("boga_splash_seen") === "true";
}

export default function Home() {
  const isSplashSeen = useSyncExternalStore(
    noopSubscribe,
    isSplashSeenClient,
    () => true
  );
  const [splashDismissed, setSplashDismissed] = useState(false);

  const handleSplashLift = () => {
    sessionStorage.setItem("boga_splash_seen", "true");
    setSplashDismissed(true);
  };

  const showSplash = !isSplashSeen && !splashDismissed;

  return (
    <>
      {showSplash && <SplashScene onLift={handleSplashLift} />}
      <div className="min-h-screen bg-[#0F172A]">
        <div 
          className="relative z-10 bg-slate-900 rounded-b-[40px] overflow-hidden"
          style={{ marginBottom: "calc(100vh - 72px)" }}
        >
          <LandingNavbar />
          <HeroSection />
          <PhaseTimeline />
          <RoleGateways />
          <TestimonialSection />
          <FaqSection />
        </div>
        
        <div 
          className="fixed top-[72px] bottom-0 left-0 right-0 z-0 flex flex-col justify-center bg-[#0F172A]"
        >
          <LandingFooter />
        </div>
      </div>
    </>
  );
}
