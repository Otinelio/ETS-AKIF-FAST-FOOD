import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronsDown, MapPin, Star, Clock, Flame, ArrowRight } from "lucide-react";
import { MarqueeBand } from "../components/MarqueeBand";
import { ScrollReveal } from "../components/ScrollReveal";
import { Footer } from "../components/Footer";
import { useCart } from "../context/CartContext";
import {
  heroShawarma, pouletGrille, galleryKofta, galleryJuice,
  galleryBurger, galleryIce, kafta, burger, ambianceNight, akifLogo
} from "../data/menu";

export const HomePage = () => {
  const { addItem } = useCart();
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

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
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="hero-section relative overflow-hidden" style={{ minHeight: "100vh" }}>
        {/* Pure gradient background */}
        <div className="absolute inset-0 hero-bg" />
        <div className="absolute inset-0 hero-grid pointer-events-none" />

        {/* Floating glow orbs */}
        <div className="hero-orb" style={{ top: "15%", left: "10%", width: 320, height: 320, background: "radial-gradient(circle, rgba(212,43,43,0.25) 0%, transparent 70%)" }} />
        <div className="hero-orb hero-orb-delay" style={{ bottom: "20%", right: "5%", width: 280, height: 280, background: "radial-gradient(circle, rgba(240,122,42,0.2) 0%, transparent 70%)" }} />
        <div className="hero-orb" style={{ top: "60%", left: "40%", width: 200, height: 200, background: "radial-gradient(circle, rgba(27,58,140,0.2) 0%, transparent 70%)" }} />

        {/* Watermark */}
        <span className="absolute -right-10 md:-right-20 top-1/2 -translate-y-1/2 font-bebas text-[350px] md:text-[600px] text-white/[0.02] leading-none select-none pointer-events-none z-0">A</span>

        {/* Main content */}
        <div className="max-w-7xl w-full mx-auto relative z-20 px-5 md:px-12 flex flex-col justify-center" style={{ minHeight: "100vh" }}>
          <div className="flex flex-col gap-6 md:gap-0 md:grid md:grid-cols-12 md:items-center w-full py-12 md:py-20">

            {/* Left — Brand + CTA */}
            <div className="md:col-span-6 lg:col-span-6 flex flex-col">
              {/* Logo badge */}
              <div className={`flex items-center gap-3 mb-5 hero-stagger`} style={{ animationDelay: "0.2s", opacity: heroLoaded ? 1 : 0 }}>
                <div className="w-11 h-11 rounded-full border-2 border-akif-red overflow-hidden bg-white shadow-lg shadow-akif-red/20 flex-shrink-0">
                  <img src={akifLogo} alt="AKIF Logo" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bebas text-[13px] tracking-[0.3em] text-white/70">ETS AKIF</span>
                  <span className="font-lora italic text-[12px] text-white/40">Fast Food · Lomé, Togo</span>
                </div>
              </div>

              {/* Main headline */}
              <h1
                className={`font-bebas text-[80px] md:text-[140px] lg:text-[180px] leading-[0.85] text-white hero-stagger`}
                style={{ animationDelay: "0.4s", opacity: heroLoaded ? 1 : 0, textShadow: "0 4px 60px rgba(212,43,43,0.2)" }}
              >
                AKIF
              </h1>

              {/* Subtitle */}
              <div className="hero-stagger mt-1" style={{ animationDelay: "0.6s", opacity: heroLoaded ? 1 : 0 }}>
                <p className="font-bebas text-[14px] md:text-[20px] tracking-[0.2em] text-white/50">
                  <span className="text-akif-red font-bold">SHAWARMA</span>
                  <span className="mx-1.5 md:mx-2 text-white/20">·</span>GRILLADES
                  <span className="mx-1.5 md:mx-2 text-white/20">·</span>BURGERS
                  <span className="mx-1.5 md:mx-2 text-white/20">·</span>JUS FRAIS
                </p>
                <div className="hero-line-expand mt-3" />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-6 md:mt-10 hero-stagger" style={{ animationDelay: "0.8s", opacity: heroLoaded ? 1 : 0 }}>
                <Link to="/menu" className="group hero-cta-primary">
                  VOIR LE MENU
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/commander" className="hero-cta-secondary">
                  COMMANDER
                </Link>
              </div>

              {/* Info chips — hidden on mobile to save space, shown on desktop */}
              <div className="hidden md:flex flex-wrap gap-3 mt-8 hero-stagger" style={{ animationDelay: "1s", opacity: heroLoaded ? 1 : 0 }}>
                <span className="hero-chip">
                  <Clock size={13} className="text-akif-orange" />
                  08H – 04H
                </span>
                <span className="hero-chip">
                  <MapPin size={13} className="text-akif-red" />
                  BD. 13 JANVIER
                </span>
                <span className="hero-chip">
                  <Flame size={13} className="text-akif-orange" />
                  GRILLADES AU FEU
                </span>
              </div>
            </div>

            {/* Right — Bento food grid */}
            <div className="md:col-span-6 lg:col-span-6 w-full flex justify-center lg:justify-end hero-stagger" style={{ animationDelay: "0.5s", opacity: heroLoaded ? 1 : 0 }}>
              <div className="grid grid-cols-3 grid-rows-3 gap-2 md:gap-3 w-full max-w-[420px] lg:max-w-[550px] aspect-square">
                
                {/* Main featured (Shawarma) - 2x2 */}
                <div className="col-start-1 col-span-2 row-start-1 row-span-2 relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl group">
                  <img src={heroShawarma} alt="Shawarma signature" className="absolute inset-0 w-full h-full object-cover img-treatment group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
                    <div className="flex items-center gap-1 mb-1">
                      <Star size={10} className="text-akif-orange fill-akif-orange" />
                      <Star size={10} className="text-akif-orange fill-akif-orange" />
                      <Star size={10} className="text-akif-orange fill-akif-orange" />
                      <Star size={10} className="text-akif-orange fill-akif-orange" />
                      <Star size={10} className="text-akif-orange fill-akif-orange" />
                    </div>
                    <p className="font-bebas text-[18px] md:text-[26px] text-white leading-tight">SHAWARMA POULET</p>
                    <p className="font-lora italic text-[10px] md:text-[13px] text-white/60">Notre signature</p>
                  </div>
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 hero-price-badge text-[11px] md:text-[14px] px-2 py-1">2 000 F</div>
                </div>

                {/* Side top (Kafta) - 1x1 */}
                <div className="col-start-3 row-start-1 relative rounded-lg md:rounded-xl overflow-hidden group">
                  <img src={kafta} alt="Kafta" className="absolute inset-0 w-full h-full object-cover img-treatment group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-1.5 left-2 font-bebas text-[11px] md:text-[15px] text-white tracking-wide z-10">KAFTA</span>
                </div>

                {/* Side bottom (Poulet) - 1x1 */}
                <div className="col-start-3 row-start-2 relative rounded-lg md:rounded-xl overflow-hidden group">
                  <img src={pouletGrille} alt="Poulet Grillé" className="absolute inset-0 w-full h-full object-cover img-treatment group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-1.5 left-2 font-bebas text-[11px] md:text-[15px] text-white tracking-wide z-10">POULET</span>
                </div>

                {/* Bottom row 1 (Burger) - 1x1 */}
                <div className="col-start-1 row-start-3 relative rounded-lg md:rounded-xl overflow-hidden group">
                  <img src={burger} alt="Burger" className="absolute inset-0 w-full h-full object-cover img-treatment group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-1.5 left-2 font-bebas text-[11px] md:text-[15px] text-white tracking-wide z-10">BURGER</span>
                </div>

                {/* Bottom row 2 (Jus) - 1x1 */}
                <div className="col-start-2 row-start-3 relative rounded-lg md:rounded-xl overflow-hidden group">
                  <img src={galleryJuice} alt="Jus" className="absolute inset-0 w-full h-full object-cover img-treatment group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-1.5 left-2 font-bebas text-[11px] md:text-[15px] text-white tracking-wide z-10">JUS FRAIS</span>
                </div>

                {/* Bottom row 3 (Grillades) - 1x1 */}
                <div className="col-start-3 row-start-3 relative rounded-lg md:rounded-xl overflow-hidden group">
                  <img src={galleryKofta} alt="Kofta" className="absolute inset-0 w-full h-full object-cover img-treatment group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-1.5 left-2 font-bebas text-[11px] md:text-[15px] text-white tracking-wide z-10">GRILLADES</span>
                </div>

              </div>

              {/* Mobile-only chips below bento */}
              <div className="flex md:hidden flex-wrap gap-2 mt-4 hero-stagger" style={{ animationDelay: "1s", opacity: heroLoaded ? 1 : 0 }}>
                <span className="hero-chip">
                  <Clock size={12} className="text-akif-orange" />
                  08H – 04H
                </span>
                <span className="hero-chip">
                  <MapPin size={12} className="text-akif-red" />
                  BD. 13 JANVIER
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 hero-stagger"
          style={{ animationDelay: "1.4s", opacity: heroLoaded ? 1 : 0 }}>
          <span className="font-bebas text-[9px] tracking-[0.3em] text-white/30">DÉCOUVRIR</span>
          <ChevronsDown size={20} className="text-akif-red animate-bounce-soft" />
        </div>
      </section>

      <MarqueeBand />

      {/* ═══════════════════════ GALLERY ═══════════════════════ */}
      <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto w-full">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="font-bebas text-[12px] tracking-[0.3em] text-akif-red">GALERIE</span>
              <h2 className="font-bebas text-5xl md:text-[64px] text-akif-black leading-[0.95] mt-1">LA CARTE EN IMAGES</h2>
            </div>
            <Link to="/menu" className="hidden md:inline-flex items-center gap-2 font-bebas text-[13px] tracking-[0.1em] text-akif-red hover:text-red-700 transition-colors">
              TOUT VOIR <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>
        <div className="columns-2 md:columns-3 gap-3 [column-fill:_balance]">
          {[heroShawarma, pouletGrille, galleryKofta, galleryJuice, galleryBurger, galleryIce].map((src, i) => (
            <div key={i} className="mb-3 break-inside-avoid overflow-hidden rounded-lg group">
              <img src={src} alt="Gallery" loading="lazy" className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-[1.05] group-hover:brightness-110" />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ NOS INCONTOURNABLES ═══════════════════════ */}
      <section className="px-6 md:px-12 py-20 bg-paper w-full">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <span className="font-bebas text-[12px] tracking-[0.3em] text-akif-orange">À NE PAS MANQUER</span>
            <h2 className="font-bebas text-6xl md:text-[72px] text-akif-black mb-12 leading-[0.95] mt-1">NOS INCONTOURNABLES</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {indispensables.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 80}>
                <div className="bg-white rounded-xl border border-black/5 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden relative group">
                  <div className="aspect-square w-full overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover img-treatment group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="absolute top-3 left-3 bg-akif-blue/90 backdrop-blur-sm text-white font-bebas text-[10px] tracking-[0.15em] px-3 py-1.5 rounded-sm">{item.cat}</div>
                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="font-bebas text-[24px] text-akif-black leading-tight">{item.name}</h3>
                    <p className="font-lora italic text-[14px] text-akif-black/60 flex-grow">{item.desc}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bebas text-[30px] text-akif-orange">{item.price.toLocaleString()}</span>
                      <button onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })} className="bg-akif-red text-white font-bebas text-xs tracking-[0.08em] px-4 py-2 rounded-sm hover:bg-red-600 hover:scale-[1.03] transition-all">AJOUTER</button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
      <section className="bg-akif-black px-6 md:px-12 py-24 relative w-full overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[100px]" style={{ background: "#D42B2B" }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-[0.04] blur-[80px]" style={{ background: "#1B3A8C" }} />

        <div className="max-w-6xl mx-auto relative">
          <ScrollReveal>
            <span className="font-bebas text-[12px] tracking-[0.3em] text-akif-red">TÉMOIGNAGES</span>
            <h2 className="font-bebas text-5xl md:text-[56px] text-white mb-12 leading-[0.95] mt-1">CE QU'ILS EN DISENT</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {testimonials.map((t, i) => (
              <ScrollReveal key={i} delay={i * 80} className="md:mt-0" style={{ marginTop: i * 40 }}>
                <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.08] transition-colors duration-300">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={14} className="text-akif-orange fill-akif-orange" />
                    ))}
                  </div>
                  <p className="font-lora italic text-[18px] text-white/90 leading-relaxed">"{t.text}"</p>
                  <p className="font-bebas text-[14px] text-akif-red mt-4 tracking-wide">{t.author}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ ABOUT SPLIT ═══════════════════════ */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-3 bg-akif-black p-8 md:p-12 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            <div className="relative">
              <img src={ambianceNight} className="w-full max-w-[520px] aspect-[4/5] object-cover rounded-xl shadow-2xl img-treatment" loading="lazy" alt="Ambiance de nuit" />
            </div>
          </div>
          <div className="md:col-span-2 bg-paper p-8 md:p-12 flex flex-col justify-center">
            <span className="font-bebas text-[12px] tracking-[0.3em] text-akif-blue">NOTRE HISTOIRE</span>
            <h2 className="font-bebas text-5xl md:text-[56px] text-akif-red leading-[0.95] mt-2">DEPUIS DES ANNÉES SUR LE BOULEVARD</h2>
            <p className="font-lora text-[16px] text-akif-black/80 mt-6" style={{ lineHeight: 1.7 }}>
              ETS AKIF s'est installé Boulevard du 13 Janvier, quartier Béniglato — en face de Coris Bank. Des étudiants, des familles, des noctambules. Ouverts de 08h à 04h du matin, presque tous les jours. Des shawarmas, des grillades, des jus. Rien ne change parce que rien ne doit changer.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <MapPin size={18} className="text-akif-blue" />
              <span className="font-lora font-bold text-sm text-akif-black">Béniglato · Lomé, Togo</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FIGURES ═══════════════════════ */}
      <section className="px-6 md:px-12 py-20 bg-paper w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {figures.map((f, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <div className="font-bebas text-4xl md:text-6xl text-akif-red">{f.big}</div>
              <div className="font-lora text-[14px] text-akif-black/60 mt-2">{f.sub}</div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};
