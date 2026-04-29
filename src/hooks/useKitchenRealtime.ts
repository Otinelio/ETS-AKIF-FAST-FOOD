import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export function useKitchenRealtime(onNewOrder?: () => void) {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("kitchen-orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "kitchen_orders" },
        (payload) => {
          qc.invalidateQueries({ queryKey: ["kitchenOrders"] });
          if (payload.eventType === "INSERT" && onNewOrder) {
            onNewOrder();
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [qc, onNewOrder]);
}
