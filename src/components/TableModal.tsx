import React, { useState } from "react";
import { Hash } from "lucide-react";

export const TableModal = ({ onConfirm }: { onConfirm: (n: string) => void }) => {
  const [val, setVal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val.trim()) {
      localStorage.setItem("tableNumber", val.trim());
      onConfirm(val.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(26,26,26,0.92)" }}>
      <div className="bg-white rounded-2xl p-12 w-full max-w-[360px] animate-modal-in shadow-2xl" onClick={e => e.stopPropagation()}>
        <Hash size={40} className="text-akif-blue mx-auto" />
        <h2 className="font-bebas text-4xl text-akif-black text-center mt-4">Votre numéro de table ?</h2>
        <p className="font-lora text-[14px] text-akif-black/60 text-center mt-2">Entrez le numéro inscrit sur votre table</p>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            min="1"
            autoFocus
            className="mt-8 w-full h-16 text-center font-bebas text-3xl border-2 border-akif-black rounded-lg focus:border-akif-red focus:outline-none"
            placeholder="ex : 5"
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
          <button
            type="submit"
            disabled={!val.trim()}
            className="mt-4 w-full h-[52px] bg-akif-red text-white font-bebas text-base tracking-[0.08em] rounded hover:bg-akif-blue transition-colors duration-[180ms] disabled:opacity-50"
          >
            CONFIRMER
          </button>
        </form>
      </div>
    </div>
  );
};
