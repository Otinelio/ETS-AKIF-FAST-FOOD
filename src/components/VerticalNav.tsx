import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, Info, Phone, ShoppingCart, MessageCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { akifLogo } from "../data/menu";

export const VerticalNav = () => {
  const location = useLocation();
  const { count, setIsOpen, badgePop } = useCart();

  const navItems = [
    { icon: Home, label: "ACCUEIL", path: "/" },
    { icon: UtensilsCrossed, label: "MENU", path: "/menu" },
    { icon: Info, label: "À PROPOS", path: "/a-propos" },
    { icon: Phone, label: "CONTACT", path: "/contact" },
  ];

  const isMenuScan = location.pathname === "/menu/scan";

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:flex fixed top-0 left-0 h-full w-20 bg-akif-blue z-50 flex-col items-center py-6">
        <div className="w-12 h-12 rounded-full border-2 border-akif-red overflow-hidden bg-white mb-10 flex-shrink-0">
          <img src={akifLogo} alt="AKIF Logo" className="w-full h-full object-cover" />
        </div>
        
        <div className="flex flex-col gap-10 flex-grow">
          {!isMenuScan && navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 group hover:scale-110 transition-transform">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive ? "bg-akif-red" : "group-hover:bg-akif-red"}`}>
                  <Icon size={22} color="white" />
                </div>
                <span className="font-bebas text-[10px] tracking-[0.2em] text-white">{item.label}</span>
              </Link>
            );
          })}

          <button onClick={() => setIsOpen(true)} className="flex flex-col items-center gap-1 group hover:scale-110 transition-transform relative mt-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-akif-red transition-colors relative">
              <ShoppingCart size={22} color="white" />
              {count > 0 && (
                <span className={`absolute -top-1 -right-1 bg-akif-orange text-white font-bebas text-[11px] w-5 h-5 rounded-full flex items-center justify-center ${badgePop ? "badge-pop" : ""}`}>
                  {count}
                </span>
              )}
            </div>
            <span className="font-bebas text-[10px] tracking-[0.2em] text-white">PANIER</span>
          </button>
        </div>

        <a href="https://wa.me/22822225519" target="_blank" rel="noopener noreferrer" className="mt-auto group hover:scale-110 transition-transform">
          <div className="w-10 h-10 rounded-full bg-akif-orange flex items-center justify-center">
            <MessageCircle size={22} color="white" />
          </div>
        </a>
      </nav>

      {/* Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-akif-blue z-50 flex items-center justify-around px-2 pb-safe">
        {isMenuScan && (
          <div className="w-10 h-10 rounded-full border-2 border-akif-red overflow-hidden bg-white flex-shrink-0">
            <img src={akifLogo} alt="AKIF Logo" className="w-full h-full object-cover" />
          </div>
        )}
        {!isMenuScan && navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center p-2">
              <Icon size={20} className={isActive ? "text-akif-red" : "text-white"} />
            </Link>
          );
        })}
        <button onClick={() => setIsOpen(true)} className="flex flex-col items-center p-2 relative">
          <ShoppingCart size={20} className="text-white" />
          {count > 0 && (
            <span className={`absolute top-0 right-0 bg-akif-orange text-white font-bebas text-[9px] w-4 h-4 rounded-full flex items-center justify-center ${badgePop ? "badge-pop" : ""}`}>
              {count}
            </span>
          )}
        </button>
      </nav>
    </>
  );
};
