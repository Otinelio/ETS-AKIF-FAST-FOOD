import React from "react";
import { Link } from "react-router-dom";
import { ChevronsDown, MapPin, Star } from "lucide-react";
import { MarqueeBand } from "../components/MarqueeBand";
import { ScrollReveal } from "../components/ScrollReveal";
import { Footer } from "../components/Footer";
import { useCart } from "../context/CartContext";
import {
  heroFire, heroShawarma, pouletGrille, galleryKofta, galleryJuice, 
  galleryBurger, galleryIce, kafta, burger, ambianceNight
} from "../data/menu";

export const HomePage = () => {
  const { addItem } = useCart();

  const indispensables = [
    { id: "shawarma-poulet", name: "Shawarma Poulet", desc: "Poulet rôti à la broche, crudités, sauce tahin", price: 2000, image: heroShawarma, cat: "SHAWARMA" },
    { id: "kafta-plat", name: "Kafta en Plat", desc: "Viande hachée aux herbes grillée, servie avec riz", price: 3000, image: kafta, cat: "GRILLADES" },
    { id: "burger-classic", name: "Burger Classic", desc: "Boeuf haché, fromage, laitue, sauce maison", price: 2000, image: burger, cat: "FAST FOOD" },
  ];

  const testimonials = [
    { text: "Rapide, copieux, prix imbattables. On y retourne toujours.", author: "Client régulier" },
    { text: "Le meilleur shawarma du boulevard. Ouvert tard, parfait après les sorties.", author: "Étudiant, Lomé" },
    { text: "Portions généreuses, service rapide. Un classique de Béniglato.", author: "Famille locale" },
  ];

  const figures = [
    { big: "08H–04H", sub: "Ouvert tous les jours" },
    { big: "1 500", sub: "FCFA le snack dès" },
    { big: "LIVRAISON", sub: "Béniglato & alentours" },
    { big: "BD. 13", sub: "Janvier, Béniglato" },
  ];

  return (
    <div className="flex flex-col w-full">
      <section className="relative overflow-hidden flex items-center px-6 md:px-12" style={{ minHeight: "calc(100vh - 0px)" }}>
        <img src={heroFire} className="absolute inset-0 w-full h-full object-cover" alt="Hero background" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(26,26,26,0.85) 0%, rgba(212,43,43,0.6) 50%, rgba(27,58,140,0.4) 100%)" }} />
        <span className="absolute -left-8 md:-left-16 -top-20 font-bebas text-[400px] md:text-[600px] text-white/[0.05] leading-none select-none pointer-events-none z-10">A</span>
        
        <div className="max-w-6xl w-full mx-auto relative z-20 py-20 grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3">
            <h1 className="font-bebas text-[120px] md:text-[240px] leading-[0.85] text-white -mt-6 md:-mt-12 drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">AKIF</h1>
            <p className="font-lora italic text-[18px] text-white/90 mt-2">Fast Food · Lomé</p>
            <div className="mt-8">
              <Link to="/menu" className="bg-akif-red text-white font-bebas text-sm tracking-[0.08em] px-8 py-3 rounded shadow-lg hover:scale-[1.03] active:scale-[0.97] inline-block transition-transform">
                VOIR LE MENU
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["OUVERT 08H–04H", "BD. 13 JANVIER", "COMMANDE VIA WHATSAPP"].map(t => (
                <span key={t} className="font-bebas text-[11px] tracking-[0.2em] text-white px-3 py-1.5 rounded border border-white/20" style={{ background: "rgba(0,0,0,0.6)" }}>{t}</span>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2 flex justify-center md:justify-end">
            <div className="polaroid rotate-3 hover:rotate-0 transition-transform duration-300 md:translate-x-5" style={{ padding: 16 }}>
              <img src={heroShawarma} alt="Shawarma" className="w-full max-w-[420px] aspect-[420/520] object-cover img-treatment" style={{ width: 420, height: 520, maxWidth: "100%" }} />
              <div className="mt-3 text-center">
                <span className="bg-akif-red px-3 py-1 inline-flex items-center gap-1 rounded-sm">
                  <Star size={14} className="text-white" />
                  <span className="font-lora text-[12px] text-white">Depuis des années Bd. 13 Janvier</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <ChevronsDown size={28} className="text-akif-red animate-bounce-soft" />
        </div>
      </section>

      <MarqueeBand />

      <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto w-full">
        <ScrollReveal>
          <h2 className="font-bebas text-5xl md:text-[64px] text-akif-black mb-8">LA CARTE EN IMAGES</h2>
        </ScrollReveal>
        <div className="columns-2 md:columns-3 gap-3 [column-fill:_balance]">
          {[heroShawarma, pouletGrille, galleryKofta, galleryJuice, galleryBurger, galleryIce].map((src, i) => (
            <div key={i} className="mb-3 break-inside-avoid overflow-hidden rounded-lg group">
              <img src={src} alt="Gallery" loading="lazy" className="w-full h-auto object-cover transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-110" />
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 bg-paper w-full">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="font-bebas text-6xl md:text-[72px] text-akif-black mb-12">NOS INCONTOURNABLES</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {indispensables.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 60}>
                <div className="bg-white border-2 border-akif-black hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-200 overflow-hidden relative group">
                  <div className="aspect-square w-full overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover img-treatment group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="absolute top-3 left-3 bg-akif-blue text-white font-bebas text-[10px] tracking-[0.15em] px-2 py-1">{item.cat}</div>
                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="font-bebas text-[24px] text-akif-black leading-tight">{item.name}</h3>
                    <p className="font-lora italic text-[14px] text-akif-black/70 flex-grow">{item.desc}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bebas text-[30px] text-akif-orange">{item.price}</span>
                      <button onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })} className="bg-akif-red text-white font-bebas text-xs tracking-[0.08em] px-4 py-2 hover:scale-[1.03] transition-transform">AJOUTER</button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-akif-black px-6 md:px-12 py-24 relative w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 60} className="md:mt-0" style={{ marginTop: i * 40 }}>
              <div>
                <p className="font-lora italic text-[20px] text-white leading-relaxed">"{t.text}"</p>
                <p className="font-bebas text-[14px] text-akif-red mt-4 tracking-wide">{t.author}</p>
              </div>
            </ScrollReveal>
          ))}
          <div className="hidden md:block absolute bottom-[-30px] right-0 max-w-[260px] bg-akif-blue text-white p-5 shadow-xl" style={{ transform: "rotate(-2deg)" }}>
            <p className="font-lora italic text-[16px] leading-snug">"Quand on rentre tard, c'est ici qu'on s'arrête. Toujours."</p>
            <p className="font-bebas text-[12px] text-white/70 mt-3">Voisin du quartier</p>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-3 bg-akif-black p-8 md:p-12 flex items-center justify-center">
            <div className="polaroid -rotate-3" style={{ padding: 14 }}>
              <img src={ambianceNight} className="w-full max-w-[520px] aspect-[4/5] object-cover img-treatment" loading="lazy" alt="Ambiance de nuit" />
            </div>
          </div>
          <div className="md:col-span-2 bg-paper p-8 md:p-12 flex flex-col justify-center">
            <h2 className="font-bebas text-5xl md:text-[56px] text-akif-red leading-[0.95]">DEPUIS DES ANNÉES SUR LE BOULEVARD</h2>
            <p className="font-lora text-[16px] text-akif-black mt-6" style={{ lineHeight: 1.7 }}>
              ETS AKIF s'est installé Boulevard du 13 Janvier, quartier Béniglato — en face de Coris Bank. Des étudiants, des familles, des noctambules. Ouverts de 08h à 04h du matin, presque tous les jours. Des shawarmas, des grillades, des jus. Rien ne change parce que rien ne doit changer.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <MapPin size={18} className="text-akif-blue" />
              <span className="font-lora font-bold text-sm text-akif-black">Béniglato · Lomé, Togo</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 bg-paper w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {figures.map((f, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <div className="font-bebas text-4xl md:text-6xl text-akif-red">{f.big}</div>
              <div className="font-lora text-[14px] text-akif-black mt-2">{f.sub}</div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};
