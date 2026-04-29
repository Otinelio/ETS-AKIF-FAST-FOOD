import React from "react";

export const MarqueeBand = () => {
  const text = "OUVERT 08H–04H · BD. 13 JANVIER BÉNIGLATO · SHAWARMA · KAFTA · BURGERS · GRILLADES · JUS NATURELS · ";
  return (
    <div className="bg-akif-red overflow-hidden py-3">
      <div className="animate-marquee whitespace-nowrap flex">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className="font-bebas text-sm tracking-[0.1em] text-white mx-4">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};
