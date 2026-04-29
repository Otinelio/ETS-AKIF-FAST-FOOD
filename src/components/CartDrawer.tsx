import React, { useState } from "react";
import { ShoppingCart, X, Trash2, MessageCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { addKitchenOrder } from "../lib/restaurantData";

import { toast } from "sonner";

export const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total, clear, scanMode } = useCart();
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const tableNumber = localStorage.getItem("tableNumber");

  const handleSend = async () => {
    if (items.length === 0) return;
    
    if (scanMode && tableNumber) {
      await addKitchenOrder({
        table_number: tableNumber,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        total,
        note: note || undefined
      });
      clear();
      setIsOpen(false);
      toast.success("Votre commande a bien été envoyée en cuisine !");
      return;
    }

    const msgItems = items.map(i => `- ${i.quantity}x ${i.name}`).join("\n");
    let msg = `Bonjour, je souhaite commander :\n\n${msgItems}\nTotal : ${total} FCFA`;
    if (note) msg += `\nNote : ${note}`;
    
    window.open(`https://wa.me/22822225519?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      <div className="fixed inset-0 bg-akif-black/35 z-[60]" onClick={() => setIsOpen(false)} />
      <div className={`fixed top-0 right-0 bottom-0 w-full md:w-[360px] bg-white border-l-2 border-akif-black z-[70] transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
        <div className="bg-akif-red px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} color="white" />
            <span className="font-bebas text-[18px] tracking-[0.15em] text-white">
              {scanMode ? `TABLE ${tableNumber}` : "MA COMMANDE"}
            </span>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <X size={20} color="white" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 opacity-50">
              <ShoppingCart size={40} className="text-akif-black/15" />
              <span className="font-lora italic text-[14px] text-akif-black">Rien ici... pour l'instant.</span>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 border-b border-akif-black/10 pb-4">
                <div className="flex justify-between items-start">
                  <span className="font-lora font-medium text-[15px]">{item.name}</span>
                  <button onClick={() => removeItem(item.id)} className="text-akif-black/30 hover:text-akif-red">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bebas text-[18px] text-akif-orange">{item.price * item.quantity} FCFA</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-[28px] h-[28px] border border-akif-black/15 flex items-center justify-center hover:bg-akif-red hover:text-white transition-colors">−</button>
                    <span className="font-lora text-[14px]">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-[28px] h-[28px] border border-akif-black/15 flex items-center justify-center hover:bg-akif-red hover:text-white transition-colors">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-paper border-t border-akif-black/10">
          <div className="flex justify-between items-center mb-4">
            <span className="font-lora text-[14px]">Sous-total</span>
            <span className="font-bebas text-[24px] text-akif-black">{total} FCFA</span>
          </div>
          <textarea
            className="w-full h-[64px] bg-paper border border-akif-black/15 p-2 font-lora text-[14px] resize-none focus:outline-none focus:border-akif-red mb-4"
            placeholder={scanMode ? "Précision pour la cuisine..." : "Précision ou adresse de livraison..."}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            onClick={handleSend}
            disabled={items.length === 0}
            className="w-full bg-akif-red text-white font-bebas text-[16px] tracking-[0.08em] py-3 rounded flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-akif-blue transition-colors"
          >
            <MessageCircle size={20} />
            {scanMode ? "ENVOYER À LA CUISINE" : "ENVOYER VIA WHATSAPP"}
          </button>
        </div>
      </div>
    </>
  );
};
