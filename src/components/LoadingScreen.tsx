import React, { useEffect, useState } from "react";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setTimeout(() => setStage(1), 400); // A
    setTimeout(() => setStage(2), 550); // K
    setTimeout(() => setStage(3), 700); // I
    setTimeout(() => setStage(4), 850); // F
    setTimeout(() => setStage(5), 1000); // Line
    setTimeout(() => setStage(6), 1350); // Subtitle
    setTimeout(() => setStage(7), 1900); // Fade out
    setTimeout(() => onComplete(), 2400);
  }, [onComplete]);

  if (stage >= 8) return null;

  return (
    <div className={`fixed inset-0 z-[9999] bg-paper flex flex-col items-center justify-center transition-all duration-400 ${stage >= 7 ? "animate-fade-out" : ""}`}>
      <div className="flex text-[120px] md:text-[160px] font-bebas text-akif-red leading-none">
        <span className={stage >= 1 ? "neon-buzz" : "opacity-0"}>A</span>
        <span className={stage >= 2 ? "neon-buzz" : "opacity-0"}>K</span>
        <span className={stage >= 3 ? "neon-buzz" : "opacity-0"}>I</span>
        <span className={stage >= 4 ? "neon-buzz" : "opacity-0"}>F</span>
      </div>
      <div className="flex flex-col items-center mt-2">
        <div className={`h-[2px] bg-akif-red transition-all duration-300 ${stage >= 5 ? "w-[120px]" : "w-0"}`}></div>
        <p className={`font-lora italic text-[16px] text-akif-black transition-opacity duration-300 mt-3 ${stage >= 6 ? "opacity-100" : "opacity-0"}`}>
          Fast Food · Lomé
        </p>
      </div>
    </div>
  );
};
