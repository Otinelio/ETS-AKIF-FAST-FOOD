import { supabase } from "./supabase";
import type { MenuItem, RestaurantSettings, KitchenOrder } from "../data/menu";

// ─── MENU ITEMS ────────────────────────────────────────────────────────────────

export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("category")
    .order("name");
  if (error) throw error;
  return data as MenuItem[];
}

export async function getAvailableMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("available", true)
    .order("category")
    .order("name");
  if (error) throw error;
  return data as MenuItem[];
}

export async function createMenuItem(item: Omit<MenuItem, "available"> & { available?: boolean }): Promise<void> {
  const { error } = await supabase.from("menu_items").insert({ ...item, available: item.available ?? true });
  if (error) throw error;
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
  const { error } = await supabase.from("menu_items").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

// ─── CATEGORIES ────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<{ id: string; name: string; position: number }[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("position");
  if (error) throw error;
  return data;
}

export async function createCategory(name: string, position: number): Promise<void> {
  const { error } = await supabase.from("categories").insert({ name: name.toUpperCase(), position });
  if (error) throw error;
}

export async function updateCategory(id: string, updates: { name?: string; position?: number }): Promise<void> {
  const { error } = await supabase.from("categories").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// ─── PARAMÈTRES ────────────────────────────────────────────────────────────────

export async function getRestaurantSettings(): Promise<RestaurantSettings> {
  const { data, error } = await supabase
    .from("restaurant_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data as RestaurantSettings;
}

export async function saveRestaurantSettings(settings: Partial<RestaurantSettings>): Promise<void> {
  const { error } = await supabase
    .from("restaurant_settings")
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw error;
}

// ─── COMMANDES CUISINE ─────────────────────────────────────────────────────────

export async function getKitchenOrders(): Promise<KitchenOrder[]> {
  const { data, error } = await supabase
    .from("kitchen_orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as KitchenOrder[];
}

export async function addKitchenOrder(
  order: Omit<KitchenOrder, "id" | "status" | "created_at">
): Promise<void> {
  const { error } = await supabase.from("kitchen_orders").insert({
    table_number: order.table_number,
    items: order.items,
    total: order.total,
    note: order.note ?? null,
    status: "pending",
  });
  if (error) throw error;
}

export async function markOrderDone(id: number): Promise<void> {
  const { error } = await supabase.from("kitchen_orders").update({ status: "done" }).eq("id", id);
  if (error) throw error;
}

export async function clearAllOrders(): Promise<void> {
  const { error } = await supabase.from("kitchen_orders").delete().neq("id", 0);
  if (error) throw error;
}

export async function clearDoneOrders(): Promise<void> {
  const { error } = await supabase.from("kitchen_orders").delete().eq("status", "done");
  if (error) throw error;
}
