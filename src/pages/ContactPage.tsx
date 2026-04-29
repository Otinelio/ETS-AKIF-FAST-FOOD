import React from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import { ScrollReveal } from "../components/ScrollReveal";
import { Footer } from "../components/Footer";
import { useRestaurantSettings } from "../hooks/useRestaurantData";

export const ContactPage = () => {
  const { data: settings } = useRestaurantSettings();

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full items-center">
        <ScrollReveal className="w-full">
          <div className="bg-paper py-16 px-6 flex flex-col items-center text-center w-full">
            <MapPin size={32} className="text-akif-blue mb-4" />
            <h2 className="font-bebas text-4xl md:text-5xl text-akif-black">BOULEVARD DU 13 JANVIER</h2>
            <p className="font-lora text-[16px] text-akif-black/70 mt-2 max-w-4xl">{settings?.address}</p>
            <a 
              href="https://www.google.com/maps/search/Boulevard+du+13+Janvier+Béniglato+Lomé" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 font-bebas text-[14px] text-akif-blue border-b-2 border-akif-blue hover:text-akif-red hover:border-akif-red transition-colors pb-1"
            >
              OUVRIR DANS GOOGLE MAPS
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal className="w-full">
          <div className="bg-akif-blue py-16 px-6 flex flex-col items-center text-center w-full">
            <Phone size={32} className="text-white mb-4" />
            <h2 className="font-bebas text-4xl md:text-5xl text-white">(+228) 22 22 55 19 · (+228) 97 04 14 14</h2>
            <p className="font-lora text-[16px] text-white/70 mt-2 max-w-4xl">WhatsApp disponible sur les deux numéros</p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="w-full">
          <div className="bg-akif-red py-16 px-6 flex flex-col items-center text-center w-full">
            <Clock size={32} className="text-white mb-4" />
            <h2 className="font-bebas text-5xl md:text-6xl text-white">{settings?.hours}</h2>
            <p className="font-lora italic text-[14px] text-white/80 mt-2 max-w-4xl">{settings?.sunday_note}</p>
          </div>
        </ScrollReveal>
      </div>

      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15873.355152281898!2d1.2185!3d6.1366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e1c113185419%3A0x3224b5422caf411d!2sLom%C3%A9%2C%20Togo!5e0!3m2!1sfr!2sfr!4v1680000000000!5m2!1sfr!2sfr" 
        className="w-full h-[300px] border-0" 
        allowFullScreen 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Carte Lomé"
      />

      <Footer />
    </div>
  );
};
