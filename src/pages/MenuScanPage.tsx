import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { TableModal } from "../components/TableModal";
import { MenuPage } from "./MenuPage";

export const MenuScanPage = () => {
  const { setScanMode } = useCart();
  const [tableNumber, setTableNumber] = useState(() => localStorage.getItem("tableNumber"));

  useEffect(() => {
    setScanMode(true);
    return () => setScanMode(false);
  }, [setScanMode]);

  if (!tableNumber) return <TableModal onConfirm={n => setTableNumber(n)} />;

  return (
    <div className="flex flex-col w-full min-h-screen relative">
      <div className="bg-akif-blue text-white text-center py-2 font-bebas tracking-[0.15em] text-sm">
        TABLE {tableNumber} · COMMANDE SUR PLACE
      </div>
      <MenuPage />
    </div>
  );
};
