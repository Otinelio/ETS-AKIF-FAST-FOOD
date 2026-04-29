import React, { useState, useEffect } from "react";
import { UtensilsCrossed, Tag, Settings as SettingsIcon, Inbox, LogOut, Plus, Edit2, Trash2, Check, Save } from "lucide-react";
import { 
  useMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem,
  useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory,
  useRestaurantSettings, useSaveSettings,
  useKitchenOrders, useMarkOrderDone, useClearAllOrders
} from "../hooks/useRestaurantData";
import { useKitchenRealtime } from "../hooks/useKitchenRealtime";
import { MenuItem } from "../data/menu";

const ADMIN_PASSWORD = "akif2025";

export const AdminPage = () => {
  const [auth, setAuth] = useState(sessionStorage.getItem("adminAuth") === "1");
  const [activeTab, setActiveTab] = useState("menu");
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  useKitchenRealtime(() => {
    if (activeTab !== "orders") setNewOrdersCount(prev => prev + 1);
  });

  useEffect(() => {
    if (activeTab === "orders") setNewOrdersCount(0);
  }, [activeTab]);

  if (!auth) return <Login onLogin={() => setAuth(true)} />;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <div className="fixed top-0 left-0 h-full w-[220px] bg-white border-r border-[#E5E7EB] flex flex-col">
        <div className="p-6">
          <h1 className="font-bebas text-2xl text-akif-red">AKIF</h1>
          <p className="font-lora text-[11px] text-gray-500">Administration</p>
        </div>
        <div className="flex flex-col gap-1 px-3 flex-grow">
          <NavBtn active={activeTab === "menu"} icon={UtensilsCrossed} label="Menu" onClick={() => setActiveTab("menu")} />
          <NavBtn active={activeTab === "categories"} icon={Tag} label="Catégories" onClick={() => setActiveTab("categories")} />
          <NavBtn active={activeTab === "settings"} icon={SettingsIcon} label="Paramètres" onClick={() => setActiveTab("settings")} />
          <NavBtn active={activeTab === "orders"} icon={Inbox} label="Commandes" onClick={() => setActiveTab("orders")} badge={newOrdersCount} />
        </div>
        <div className="p-4 border-t border-[#E5E7EB]">
          <button 
            onClick={() => { sessionStorage.removeItem("adminAuth"); setAuth(false); }}
            className="flex items-center gap-2 text-[#6B7280] hover:text-akif-black text-sm w-full"
          >
            <LogOut size={16} /> Déconnexion
          </button>
          <p className="text-[11px] text-[#9CA3AF] italic mt-12 leading-tight">
            ⚠️ Mot de passe par défaut "akif2025" — à changer avant mise en ligne.
          </p>
        </div>
      </div>
      <main className="ml-[220px] p-8 flex-grow">
        {activeTab === "menu" && <SectionMenu />}
        {activeTab === "categories" && <SectionCategories />}
        {activeTab === "settings" && <SectionSettings />}
        {activeTab === "orders" && <SectionOrders />}
      </main>
    </div>
  );
};

const NavBtn = ({ active, icon: Icon, label, onClick, badge }: any) => (
  <button onClick={onClick} className={`flex items-center justify-between p-3 rounded-md transition-colors ${active ? "bg-[#F3F4F6] text-black" : "text-[#6B7280] hover:bg-[#F9FAFB]"}`}>
    <div className="flex items-center gap-2">
      <Icon size={18} className={active ? "text-akif-red" : ""} />
      <span className="text-sm font-medium">{label}</span>
    </div>
    {badge > 0 && <span className="bg-akif-red text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{badge}</span>}
  </button>
);

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuth", "1");
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 320);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className={`w-full max-w-sm ${error ? "animate-shake" : ""}`}>
        <h1 className="font-bebas text-6xl text-akif-red text-center">AKIF</h1>
        <p className="font-lora italic text-[14px] text-akif-black/60 text-center mb-8">Accès réservé</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            autoFocus
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className={`h-12 w-full px-3 border-2 rounded font-lora text-base focus:outline-none ${error ? "border-akif-red" : "border-akif-black focus:border-akif-red"}`}
            placeholder="Mot de passe"
          />
          {error && <p className="font-lora text-[13px] text-akif-red -mt-2">Mot de passe incorrect</p>}
          <button type="submit" className="h-12 w-full bg-akif-red text-white font-bebas tracking-[0.1em] hover:bg-akif-blue rounded transition-colors">
            ENTRER
          </button>
        </form>
      </div>
    </div>
  );
};

const SectionMenu = () => {
  const { data: items, isLoading } = useMenuItems();
  const { data: categories } = useCategories();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();
  const [editing, setEditing] = useState<Partial<MenuItem> | null>(null);

  if (isLoading) return <div className="text-sm text-gray-500">Chargement...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold">Gestion du Menu</h2>
        <button onClick={() => setEditing({ available: true })} className="bg-akif-red text-white px-4 py-2 rounded text-sm flex items-center gap-2 hover:bg-akif-blue">
          <Plus size={16} /> Ajouter un plat
        </button>
      </div>

      <div className="space-y-8">
        {categories?.map(cat => {
          const catItems = items?.filter(i => i.category === cat.name) || [];
          if (catItems.length === 0) return null;
          return (
            <div key={cat.id}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-[14px] uppercase tracking-wider text-gray-500 font-semibold">{cat.name}</h3>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{catItems.length}</span>
              </div>
              <div className="bg-white rounded-lg border divide-y">
                {catItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                    <div className="flex flex-col flex-grow min-w-0">
                      <span className="text-[14px] font-medium truncate">{item.name}</span>
                      <span className="text-[12px] text-gray-500 truncate">{item.description}</span>
                    </div>
                    <span className="font-bebas text-[16px] text-akif-orange whitespace-nowrap">{item.price} F</span>
                    <button 
                      onClick={() => updateItem.mutate({ id: item.id, u: { available: !item.available } })}
                      className={`w-10 h-5 rounded-full relative transition-colors ${item.available ? "bg-[#10B981]" : "bg-[#D1D5DB]"}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${item.available ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                    <button onClick={() => setEditing(item)} className="text-gray-400 hover:text-akif-blue p-2"><Edit2 size={16} /></button>
                    <button onClick={() => { if(window.confirm("Confirmer la suppression ?")) deleteItem.mutate(item.id); }} className="text-gray-400 hover:text-akif-red p-2"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {editing && <ModalItem item={editing} onClose={() => setEditing(null)} />}
    </div>
  );
};

const ModalItem = ({ item, onClose }: any) => {
  const isNew = !item.id;
  const createItem = useCreateMenuItem();
  const updateItem = useUpdateMenuItem();
  const { data: categories } = useCategories();
  const [form, setForm] = useState({
    id: item.id || Math.random().toString(36).substr(2, 9),
    name: item.name || "",
    description: item.description || "",
    price: item.price || 0,
    category: item.category || (categories?.[0]?.name || ""),
    image: item.image || "",
    available: item.available ?? true,
  });

  const handleSave = () => {
    if (isNew) createItem.mutate(form as any, { onSuccess: onClose });
    else updateItem.mutate({ id: item.id, u: form }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-lg font-bold mb-4">{isNew ? "Ajouter un plat" : "Modifier le plat"}</h2>
        <div className="flex flex-col gap-3">
          <input className="border p-2 rounded w-full text-sm" placeholder="Nom" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <textarea className="border p-2 rounded w-full h-[80px] text-sm resize-none" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <input className="border p-2 rounded w-full text-sm" type="number" placeholder="Prix" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
          <select className="border p-2 rounded w-full text-sm" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            {categories?.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <input className="border p-2 rounded w-full text-sm" placeholder="URL Image" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.available} onChange={e => setForm({...form, available: e.target.checked})} /> Disponible
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded text-sm">Annuler</button>
          <button onClick={handleSave} className="px-4 py-2 bg-akif-red text-white rounded text-sm">Sauvegarder</button>
        </div>
      </div>
    </div>
  );
};

const SectionCategories = () => {
  const { data: categories } = useCategories();
  const { data: items } = useMenuItems();
  const createCat = useCreateCategory();
  const updateCat = useUpdateCategory();
  const deleteCat = useDeleteCategory();
  const [newCat, setNewCat] = useState("");

  const handleAdd = () => {
    if (newCat.trim()) {
      createCat.mutate({ name: newCat.trim(), pos: categories ? categories.length : 0 });
      setNewCat("");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Catégories</h2>
      <div className="bg-white rounded-lg border divide-y max-w-xl">
        {categories?.map((cat, idx) => {
          const count = items?.filter(i => i.category === cat.name).length || 0;
          return (
            <div key={cat.id} className="flex items-center gap-3 p-3">
              <input 
                className="flex-grow border-0 focus:ring-0 p-1 text-sm font-medium bg-transparent" 
                defaultValue={cat.name} 
                onBlur={e => {
                  if (e.target.value !== cat.name) updateCat.mutate({ id: cat.id, u: { name: e.target.value.toUpperCase() } });
                }} 
              />
              <span className="text-xs text-gray-500 w-[60px] text-right">{count} plats</span>
              <button 
                onClick={() => {
                  if (idx > 0) {
                    const prev = categories[idx - 1];
                    updateCat.mutate({ id: cat.id, u: { position: prev.position } });
                    updateCat.mutate({ id: prev.id, u: { position: cat.position } });
                  }
                }}
                disabled={idx === 0}
                className="text-gray-400 hover:text-black disabled:opacity-30"
              >
                ↑
              </button>
              <button 
                onClick={() => {
                  if (idx < categories.length - 1) {
                    const next = categories[idx + 1];
                    updateCat.mutate({ id: cat.id, u: { position: next.position } });
                    updateCat.mutate({ id: next.id, u: { position: cat.position } });
                  }
                }}
                disabled={idx === categories.length - 1}
                className="text-gray-400 hover:text-black disabled:opacity-30"
              >
                ↓
              </button>
              <button 
                disabled={count > 0} 
                title={count > 0 ? "Vider d'abord la catégorie" : "Supprimer"}
                onClick={() => deleteCat.mutate(cat.id)}
                className="text-gray-400 hover:text-akif-red disabled:opacity-30 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
        <div className="p-3 flex gap-2">
          <input 
            value={newCat} 
            onChange={e => setNewCat(e.target.value)} 
            placeholder="Nouvelle catégorie" 
            className="flex-grow border p-2 rounded text-sm uppercase"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} className="bg-akif-red text-white px-4 py-2 rounded flex items-center gap-2 text-sm hover:bg-akif-blue">
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionSettings = () => {
  const { data: settings } = useRestaurantSettings();
  const saveSettings = useSaveSettings();
  const [form, setForm] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings && !form) setForm(settings);
  }, [settings]);

  if (!form) return null;

  const handleSave = () => {
    saveSettings.mutate(form, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Paramètres</h2>
      <div className="bg-white border rounded-lg p-6 max-w-xl flex flex-col gap-4">
        {["name", "tagline", "whatsapp", "address", "hours", "instagram", "sunday_note"].map(field => (
          <div key={field} className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 capitalize">{field.replace("_", " ")}</label>
            <input 
              className="h-10 border rounded px-3 text-sm focus:border-akif-red focus:outline-none" 
              value={form[field] || ""} 
              onChange={e => setForm({...form, [field]: e.target.value})} 
            />
          </div>
        ))}
        <button onClick={handleSave} className="mt-4 bg-akif-red text-white h-10 rounded flex items-center justify-center gap-2 hover:bg-akif-blue transition-colors">
          {saved ? <Check size={18} /> : <Save size={18} />}
          {saved ? "Sauvegardé" : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
};

const SectionOrders = () => {
  const { data: orders } = useKitchenOrders();
  const markDone = useMarkOrderDone();
  const clearAll = useClearAllOrders();

  const pending = orders?.filter(o => o.status === "pending") || [];
  const archived = orders?.filter(o => o.status === "done") || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Commandes en cuisine</h2>
        <button 
          onClick={() => { if(window.confirm("Tout effacer ?")) clearAll.mutate(); }}
          className="bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded hover:bg-gray-300"
        >
          Tout effacer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {pending.map(o => (
          <div key={o.id} className="bg-white border border-[#E5E7EB] border-l-4 border-l-akif-red rounded-lg p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="bg-akif-blue text-white font-bebas text-xl px-3 py-1 rounded leading-none pt-1.5">TABLE {o.table_number}</span>
              <span className="font-lora text-[13px] text-gray-500">{new Date(o.created_at).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <ul className="font-lora text-[14px] text-gray-800 space-y-1">
              {o.items.map((item: any) => (
                <li key={item.id}>× {item.quantity} {item.name}</li>
              ))}
            </ul>
            {o.note && <p className="text-sm bg-yellow-50 p-2 border border-yellow-200 rounded text-yellow-800">📝 {o.note}</p>}
            <div className="flex justify-between items-center mt-2 border-t pt-3">
              <span className="font-bebas text-[18px] text-akif-orange">{o.total} F</span>
              <button 
                onClick={() => markDone.mutate(o.id)}
                className="bg-[#10B981] text-white font-bebas text-xs px-3 py-1.5 rounded hover:bg-[#059669]"
              >
                SERVIE
              </button>
            </div>
          </div>
        ))}
      </div>

      {archived.length > 0 && (
        <div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4">Servies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
            {archived.map(o => (
              <div key={o.id} className="bg-[#F9FAFB] border border-[#E5E7EB] border-l-4 border-l-[#D1D5DB] rounded-lg p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bebas text-lg text-gray-500">TABLE {o.table_number}</span>
                  <span className="font-lora text-[12px] text-gray-400">{new Date(o.created_at).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="font-lora text-[13px] text-gray-500 truncate">
                  {o.items.map((i:any) => `${i.quantity}x ${i.name}`).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
