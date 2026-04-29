import React, { useState, useEffect } from "react";
import { UtensilsCrossed, Check } from "lucide-react";
import { useKitchenOrders, useMarkOrderDone, useClearAllOrders, useClearDoneOrders } from "../hooks/useRestaurantData";
import { useKitchenRealtime } from "../hooks/useKitchenRealtime";

export const KitchenPage = () => {
  const { data: orders } = useKitchenOrders();
  const markDone = useMarkOrderDone();
  const clearAll = useClearAllOrders();
  const clearDone = useClearDoneOrders();
  const [time, setTime] = useState(new Date());
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useKitchenRealtime(() => {
    document.title = "🔔 Nouvelle commande · AKIF Cuisine";
  });

  useEffect(() => {
    const handleFocus = () => { document.title = "AKIF Cuisine"; };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const pending = orders?.filter(o => o.status === "pending") || [];
  const archived = orders?.filter(o => o.status === "done") || [];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#1A1A1A] border-b border-akif-red">
        <div className="flex items-center gap-3">
          <UtensilsCrossed size={20} className="text-white" />
          <span className="font-bebas text-[24px] tracking-[0.1em] text-white leading-none pt-1">AKIF · CUISINE</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-bebas text-[24px] text-akif-red leading-none pt-1">{time.toLocaleTimeString("fr-FR")}</span>
          <button 
            onClick={() => { if(window.confirm("Tout effacer ?")) clearAll.mutate(); }}
            className="bg-[#374151] hover:bg-[#4B5563] font-bebas text-xs px-3 py-2 rounded transition-colors"
          >
            TOUT EFFACER
          </button>
        </div>
      </header>

      <main className="p-6 flex-grow flex flex-col">
        {pending.length === 0 ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="font-lora italic text-white/40">Aucune commande en attente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {pending.map(o => (
              <div key={o.id} className="bg-[#1A1A1A] border-2 border-akif-red rounded-xl p-5 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bebas text-[13px] text-white/50 tracking-[0.15em]">TABLE</div>
                    <div className="font-bebas text-[56px] text-akif-red leading-none mt-1">{o.table_number}</div>
                  </div>
                  <div className="font-lora text-[12px] text-[#9CA3AF]">{new Date(o.created_at).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</div>
                </div>

                <div className="border-t border-white/10 my-4" />

                <ul className="space-y-1 flex-grow">
                  {o.items.map((item: any) => (
                    <li key={item.id} className="flex justify-between items-center" style={{ lineHeight: 1.8 }}>
                      <span className="font-lora text-[15px] text-white">× {item.quantity} {item.name}</span>
                      <span className="font-bebas text-[15px] text-akif-orange">{item.price * item.quantity} F</span>
                    </li>
                  ))}
                </ul>
                
                {o.note && <div className="mt-3 p-3 bg-white/5 rounded text-sm text-white/90 border border-white/10">📝 {o.note}</div>}

                <div className="border-t border-white/10 my-4" />

                <div className="flex justify-between items-center mb-4">
                  <span className="font-bebas text-[13px] text-white/50">TOTAL</span>
                  <span className="font-bebas text-[24px] text-akif-orange">{o.total} F</span>
                </div>

                <button 
                  onClick={() => markDone.mutate(o.id)}
                  className="w-full h-11 bg-[#10B981] hover:bg-[#059669] rounded-lg font-bebas text-sm tracking-[0.1em] flex items-center justify-center gap-2 transition-colors"
                >
                  SERVIE <Check size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {archived.length > 0 && (
          <div className="bg-[#111827] rounded-xl p-5 mt-12">
            <button 
              onClick={() => setShowDone(!showDone)}
              className="w-full text-left font-bebas tracking-[0.15em] text-white/70 hover:text-white transition-colors flex items-center gap-2"
            >
              {showDone ? "▼" : "▶"} SERVIES AUJOURD'HUI ({archived.length})
            </button>
            
            {showDone && (
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {archived.map(o => (
                    <div key={o.id} className="bg-[#1F2937] border border-white/10 rounded-lg p-4 opacity-60">
                      <div className="flex justify-between mb-2">
                        <span className="font-bebas text-white/80">TABLE {o.table_number}</span>
                        <span className="font-bebas text-akif-orange/80">{o.total} F</span>
                      </div>
                      <div className="font-lora text-xs text-white/40 truncate">
                        {o.items.map((i:any) => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => { if(window.confirm("Effacer toutes les commandes servies ?")) clearDone.mutate(); }}
                  className="bg-[#374151] hover:bg-[#4B5563] font-bebas text-xs px-4 py-2 rounded text-white transition-colors"
                >
                  EFFACER LES SERVIES
                </button>
              </div>
            )}
          </div>
        )}

        <p className="font-lora italic text-[12px] text-[#6B7280] text-center max-w-xl mx-auto mt-12 mb-4">
          Les commandes apparaissent ici en temps réel via Supabase Realtime. Toute commande envoyée depuis /menu/scan sur n'importe quel appareil est reçue instantanément sur cet écran.
        </p>
      </main>
    </div>
  );
};
