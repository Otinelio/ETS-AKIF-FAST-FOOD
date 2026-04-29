import React from "react";
import { MessageCircle, Phone } from "lucide-react";
import { ScrollReveal } from "../components/ScrollReveal";
import { Footer } from "../components/Footer";

export const OrderPage = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="bg-akif-red px-6 md:px-12 py-16 relative overflow-hidden">
        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bebas text-[300px] text-white/[0.04] leading-none select-none pointer-events-none">?</span>
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="font-bebas text-6xl md:text-[80px] text-white leading-none">COMMANDER · TRAITEUR</h1>
        </div>
      </div>

      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <ScrollReveal>
          <div className="bg-white border-2 border-akif-black p-8 h-full flex flex-col">
            <h2 className="font-bebas text-4xl text-akif-black">COMMANDER</h2>
            <p className="font-lora text-[14px] text-akif-black/70 mt-1 mb-8">Sur place · À emporter · Livraison (zone Béniglato)</p>
            
            <div className="flex flex-col gap-6 flex-grow mb-8">
              <div className="flex gap-4 items-start">
                <span className="font-bebas text-6xl text-akif-red leading-none">1</span>
                <p className="font-lora text-[14px] text-akif-black/80 pt-2">Parcourez notre menu et ajoutez vos plats au panier</p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-bebas text-6xl text-akif-red leading-none">2</span>
                <p className="font-lora text-[14px] text-akif-black/80 pt-2">Vérifiez votre commande et ajoutez une note si besoin</p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-bebas text-6xl text-akif-red leading-none">3</span>
                <p className="font-lora text-[14px] text-akif-black/80 pt-2">Envoyez via WhatsApp — on prépare tout de suite</p>
              </div>
            </div>

            <a href="https://wa.me/22822225519" target="_blank" rel="noopener noreferrer" className="w-full bg-akif-red text-white font-bebas tracking-[0.08em] px-6 py-3 rounded flex items-center justify-center gap-2 hover:bg-akif-blue transition-colors">
              <MessageCircle size={20} />
              COMMANDER VIA WHATSAPP
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={60}>
          <div className="bg-akif-blue p-8 h-full flex flex-col">
            <h2 className="font-bebas text-4xl text-white">TRAITEUR</h2>
            <p className="font-lora text-[14px] text-white/70 mt-1 mb-8">Événements · Mariages · Entreprises</p>
            
            <div className="flex flex-col gap-6 flex-grow mb-8">
              <div className="flex gap-4 items-start">
                <span className="font-bebas text-6xl text-white/30 leading-none">1</span>
                <p className="font-lora text-[14px] text-white/90 pt-2">Décrivez votre événement : nombre de personnes, date, type</p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-bebas text-6xl text-white/30 leading-none">2</span>
                <p className="font-lora text-[14px] text-white/90 pt-2">On vous propose un menu sur mesure avec devis</p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-bebas text-6xl text-white/30 leading-none">3</span>
                <p className="font-lora text-[14px] text-white/90 pt-2">On livre et on s'occupe de tout le jour J</p>
              </div>
            </div>

            <a href="tel:+22822225519" className="w-full bg-white text-akif-blue font-bebas tracking-[0.08em] px-6 py-3 rounded flex items-center justify-center gap-2 hover:bg-paper transition-colors">
              <Phone size={20} />
              NOUS APPELER
            </a>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
};
