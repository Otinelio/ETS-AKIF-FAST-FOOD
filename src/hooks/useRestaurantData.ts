import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as db from "../lib/restaurantData";

export const useMenuItems      = () => useQuery({ queryKey: ["menuItems"],      queryFn: db.getMenuItems });
export const useAvailableItems = () => useQuery({ queryKey: ["availableItems"], queryFn: db.getAvailableMenuItems });
export const useCategories     = () => useQuery({ queryKey: ["categories"],     queryFn: db.getCategories });
export const useRestaurantSettings = () => useQuery({ queryKey: ["settings"],   queryFn: db.getRestaurantSettings });
export const useKitchenOrders  = () => useQuery({ queryKey: ["kitchenOrders"],  queryFn: db.getKitchenOrders, refetchInterval: false });

export function useCreateMenuItem()  { const qc = useQueryClient(); return useMutation({ mutationFn: db.createMenuItem,  onSuccess: () => qc.invalidateQueries({ queryKey: ["menuItems"] }) }); }
export function useUpdateMenuItem()  { const qc = useQueryClient(); return useMutation({ mutationFn: ({id,u}:{id:string,u:Parameters<typeof db.updateMenuItem>[1]}) => db.updateMenuItem(id,u), onSuccess: () => { qc.invalidateQueries({ queryKey: ["menuItems"] }); qc.invalidateQueries({ queryKey: ["availableItems"] }); } }); }
export function useDeleteMenuItem()  { const qc = useQueryClient(); return useMutation({ mutationFn: db.deleteMenuItem,  onSuccess: () => qc.invalidateQueries({ queryKey: ["menuItems"] }) }); }
export function useCreateCategory()  { const qc = useQueryClient(); return useMutation({ mutationFn: ({name,pos}:{name:string,pos:number}) => db.createCategory(name,pos), onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }) }); }
export function useUpdateCategory()  { const qc = useQueryClient(); return useMutation({ mutationFn: ({id,u}:{id:string,u:Parameters<typeof db.updateCategory>[1]}) => db.updateCategory(id,u), onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }) }); }
export function useDeleteCategory()  { const qc = useQueryClient(); return useMutation({ mutationFn: db.deleteCategory,  onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }) }); }
export function useSaveSettings()    { const qc = useQueryClient(); return useMutation({ mutationFn: db.saveRestaurantSettings, onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }) }); }
export function useMarkOrderPreparing() { const qc = useQueryClient(); return useMutation({ mutationFn: db.markOrderPreparing, onSuccess: () => qc.invalidateQueries({ queryKey: ["kitchenOrders"] }) }); }
export function useMarkOrderDone()   { const qc = useQueryClient(); return useMutation({ mutationFn: db.markOrderDone,   onSuccess: () => qc.invalidateQueries({ queryKey: ["kitchenOrders"] }) }); }
export function useClearAllOrders()  { const qc = useQueryClient(); return useMutation({ mutationFn: db.clearAllOrders,  onSuccess: () => qc.invalidateQueries({ queryKey: ["kitchenOrders"] }) }); }
export function useClearDoneOrders() { const qc = useQueryClient(); return useMutation({ mutationFn: db.clearDoneOrders, onSuccess: () => qc.invalidateQueries({ queryKey: ["kitchenOrders"] }) }); }
