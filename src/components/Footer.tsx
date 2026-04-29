import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useRestaurantSettings } from "../hooks/useRestaurantData";

export const Footer = () => {
  const { data: settings } = useRestaurantSettings();

  return (
    <footer className="bg-akif-black text-white py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h2 className="font-bebas text-5xl text-akif-red">{settings?.name || "AKIF"}</h2>
          <p className="font-lora text-[14px] text-white/50">{settings?.tagline || "Fast Food · Lomé"}</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <Link to="/" className="font-bebas text-[14px] tracking-wide text-white hover:text-akif-red transition-colors">ACCUEIL</Link>
          <Link to="/menu" className="font-bebas text-[14px] tracking-wide text-white hover:text-akif-red transition-colors">MENU</Link>
          <Link to="/a-propos" className="font-bebas text-[14px] tracking-wide text-white hover:text-akif-red transition-colors">À PROPOS</Link>
          <Link to="/commander" className="font-bebas text-[14px] tracking-wide text-white hover:text-akif-red transition-colors">COMMANDER</Link>
          <Link to="/contact" className="font-bebas text-[14px] tracking-wide text-white hover:text-akif-red transition-colors">CONTACT</Link>
        </div>
        
        <div className="flex flex-col gap-4">
          {settings?.instagram && (
            <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <span className="font-lora text-[14px]">@akif.fastfood</span>
            </a>
          )}
          <div className="flex items-start gap-2 text-white/60">
            <MapPin size={20} className="shrink-0 mt-1" />
            <div className="font-lora text-[14px] flex flex-col">
              <span>{settings?.address || "Boulevard du 13 Janvier, Lomé"}</span>
              <span className="mt-2">{settings?.whatsapp}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto border-t border-white/10 mt-12 pt-6">
        <p className="font-lora text-[11px] text-white/25">© 2025 ETS AKIF · Boulevard du 13 Janvier, Lomé, Togo</p>
      </div>
    </footer>
  );
};
