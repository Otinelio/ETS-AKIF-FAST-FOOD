import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 text-center">
      <h1 className="font-bebas text-[96px] text-akif-red leading-none">404</h1>
      <p className="font-lora text-[16px] text-akif-black mt-4">Cette page n'existe pas</p>
      <Link to="/" className="font-bebas text-[14px] text-akif-blue underline hover:text-akif-red transition-colors mt-6">
        ← Retour à l'accueil
      </Link>
    </div>
  );
};
