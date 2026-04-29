import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useAvailableItems, useCategories } from "../hooks/useRestaurantData";
import { useCart } from "../context/CartContext";
import { ScrollReveal } from "../components/ScrollReveal";
import { Footer } from "../components/Footer";

export const MenuPage = () => {
  const { data: items, isLoading: loadingItems, error: itemsError } = useAvailableItems();
  const { data: categories, isLoading: loadingCats } = useCategories();
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const activeCat = activeCategory || (categories?.[0]?.name);

  if (loadingItems || loadingCats) {
    return <div className="min-h-screen bg-paper flex items-center justify-center font-lora italic text-akif-black/50">Chargement du menu...</div>;
  }

  if (itemsError) {
    return <div className="min-h-screen bg-paper flex items-center justify-center font-lora text-[14px] text-akif-red/70">Erreur lors du chargement du menu.</div>;
  }

  const displayedItems = items?.filter(item => item.category === activeCat) || [];

  return (
    <div className="flex flex-col w-full">
      <div className="bg-akif-blue px-6 md:px-12 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-bebas text-6xl md:text-[96px] text-white leading-none">NOTRE MENU</h1>
          <p className="font-lora italic text-base text-white/70 mt-2">Fait à Lomé · Bd. 13 Janvier</p>
        </div>
      </div>

      <div className="sticky top-0 z-30 bg-paper border-b border-akif-black/10 px-6 md:px-12 py-3 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex gap-2">
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`font-bebas text-[13px] tracking-wide px-4 py-2 rounded whitespace-nowrap transition-colors ${activeCat === cat.name ? "bg-akif-red text-white" : "text-akif-black hover:bg-akif-black/5"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-12 py-12 min-h-[60vh] max-w-6xl mx-auto w-full">
        <ScrollReveal>
          <h2 className="font-bebas text-5xl text-akif-red -rotate-1 mb-8 inline-block border-b-2 border-akif-red pb-1">{activeCat}</h2>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {displayedItems.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 60}>
              <div className="flex items-center gap-4 py-4 px-3 border-b border-akif-black/10 hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-150 group">
                <img src={item.image} alt={item.name} className="w-[80px] h-[80px] rounded object-cover img-treatment shrink-0" loading="lazy" />
                <div className="flex flex-col flex-grow min-w-0">
                  <span className="font-lora font-semibold text-[18px] text-akif-black truncate">{item.name}</span>
                  <span className="font-lora italic text-[14px] text-akif-black/70 truncate">{item.description}</span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-bebas text-[24px] text-akif-orange whitespace-nowrap">{item.price}</span>
                  <button 
                    onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })}
                    className="w-[36px] h-[36px] rounded-full bg-akif-red text-white hover:scale-110 transition-transform flex items-center justify-center shrink-0"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};
