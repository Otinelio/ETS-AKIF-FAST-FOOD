import React from "react";
import { Zap, Clock } from "lucide-react";
import { ScrollReveal } from "../components/ScrollReveal";
import { Footer } from "../components/Footer";
import { restaurantInterior } from "../data/menu";

export const AboutPage = () => {
  return (
    <div className="flex flex-col w-full">
      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <ScrollReveal>
          <div className="polaroid -rotate-2">
            <img src={restaurantInterior} alt="Intérieur du restaurant" className="w-full aspect-[3/2] object-cover img-treatment" />
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={100}>
          <h1 className="font-bebas text-6xl md:text-[72px] text-akif-red leading-none">L'HISTOIRE D'AKIF</h1>
          <div className="font-lora text-[16px] text-akif-black mt-6 space-y-4" style={{ lineHeight: 1.7 }}>
            <p>Installé sur le Boulevard du 13 Janvier à Béniglato, ETS AKIF est devenu une adresse incontournable de la restauration rapide à Lomé. Portions généreuses, prix accessibles.</p>
            <p>Shawarma, kafta, burgers, grillades — chaque plat est préparé avec des ingrédients frais. Le ticket moyen ? Snack dès 1 500 FCFA, plat complet autour de 3 000 FCFA.</p>
            <p>La clientèle est à l'image du boulevard : diverse. Étudiants en pause, familles du quartier, noctambules en quête d'un repas après minuit. Akif les accueille tous, de 8h du matin à 4h.</p>
            <p className="italic text-[14px] text-akif-black/60">Note : le fonds de commerce a été cédé en 2018, ce qui explique certaines variations dans les retours clients selon les périodes.</p>
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-white px-6 md:px-12 py-20 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <ScrollReveal delay={0} className="text-center">
            <div className="flex flex-col items-center">
              <Zap size={32} className="text-akif-blue mb-4" />
              <h3 className="font-bebas text-[30px] text-akif-black">RAPIDE PAR ADN</h3>
              <p className="font-lora text-[14px] text-akif-black/70 mt-2 max-w-sm">Service express, sans compromis sur la qualité. Votre commande en quelques minutes.</p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={60} className="text-center">
            <div className="flex flex-col items-center">
              <Clock size={32} className="text-akif-blue mb-4" />
              <h3 className="font-bebas text-[30px] text-akif-black">OUVERT JUSQU'À 04H</h3>
              <p className="font-lora text-[14px] text-akif-black/70 mt-2 max-w-sm">Noctambules, étudiants, familles — Akif ne dort (presque) jamais.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};
