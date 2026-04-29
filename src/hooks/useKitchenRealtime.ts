import { useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

/**
 * Generates a short beep sound using the Web Audio API.
 * No external audio files needed.
 */
export function playBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    // ── First tone (high) ──
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, ctx.currentTime);       // A5
    gain1.gain.setValueAtTime(0.5, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.15);

    // ── Second tone (higher, with slight delay) ──
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1175, ctx.currentTime + 0.18); // D6
    gain2.gain.setValueAtTime(0.5, ctx.currentTime + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.18);
    osc2.stop(ctx.currentTime + 0.35);

    // ── Third tone (highest) ──
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(1397, ctx.currentTime + 0.38); // F6
    gain3.gain.setValueAtTime(0.6, ctx.currentTime + 0.38);
    gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(ctx.currentTime + 0.38);
    osc3.stop(ctx.currentTime + 0.6);

    // Clean up the AudioContext after all tones finish
    setTimeout(() => ctx.close(), 1000);
  } catch {
    // AudioContext not available — silent fallback
  }
}

/**
 * Hook that listens for real-time changes on `kitchen_orders` via
 * Supabase Realtime (postgres_changes). On every INSERT:
 *  – Invalidates the react-query cache so the UI updates instantly
 *  – Plays a notification beep
 *  – Calls the optional `onNewOrder` callback
 *
 * Also includes a 10-second fallback poll to cover scenarios where the
 * WebSocket is momentarily disconnected.
 */
export function useKitchenRealtime(onNewOrder?: () => void) {
  const qc = useQueryClient();
  const stableOnNewOrder = useRef(onNewOrder);
  stableOnNewOrder.current = onNewOrder;

  const handleInsert = useCallback(() => {
    qc.invalidateQueries({ queryKey: ["kitchenOrders"] });
    playBeep();
    stableOnNewOrder.current?.();
  }, [qc]);

  useEffect(() => {
    const channel = supabase
      .channel("kitchen-orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "kitchen_orders" },
        (payload) => {
          console.log("[KitchenRealtime] event:", payload.eventType, payload);

          // Always invalidate on any change
          qc.invalidateQueries({ queryKey: ["kitchenOrders"] });

          // Only beep + callback for new orders
          if (payload.eventType === "INSERT") {
            handleInsert();
          }
        }
      )
      .subscribe((status, err) => {
        console.log("[KitchenRealtime] subscription status:", status, err ?? "");
        if (status === "CHANNEL_ERROR") {
          console.warn("[KitchenRealtime] channel error, will rely on fallback polling");
        }
      });

    // ── Fallback: poll every 10 s in case realtime is down ──────────────
    const pollInterval = setInterval(() => {
      qc.invalidateQueries({ queryKey: ["kitchenOrders"] });
    }, 10_000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [qc, handleInsert]);
}
