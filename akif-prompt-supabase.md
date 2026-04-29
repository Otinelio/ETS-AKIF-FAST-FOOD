# PROMPT MAÎTRE — Site web ETS AKIF (Fast Food Lomé)

> Colle ce prompt entier dans Cursor / Antigravity / Windsurf. L'agent doit créer un projet React Vite TypeScript complet, identique au pixel près à ce qui est décrit ci-dessous. Aucune liberté créative. Suivre **chaque** instruction.

---

## 0. STACK & SETUP

Crée un projet **React 18 + Vite 5 + TypeScript 5 + Tailwind CSS v3 + React Router v6**.

Dépendances obligatoires :
```
react, react-dom, react-router-dom, lucide-react, @tanstack/react-query,
tailwindcss, tailwindcss-animate, class-variance-authority, clsx,
tailwind-merge, @radix-ui/react-dialog, @radix-ui/react-tooltip, sonner,
@supabase/supabase-js
```

Installer shadcn/ui (composants `tooltip`, `sonner`). Pas d'autre lib.

---

## 0-BIS. SUPABASE — CONFIGURATION CENTRALE

```ts
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dbdoajntrhqqlakuitku.supabase.co";
const SUPABASE_KEY = "sb_publishable_Mrf5Z4kf8s2Dul3ktTmEVA_yVkrHuAZ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
```

Ce fichier est le **seul endroit** où les identifiants Supabase apparaissent. Tout accès à la base de données passe par ce client.

### Schéma Supabase — créer ces tables (SQL à exécuter dans le Supabase Dashboard > SQL Editor)

```sql
-- Table des catégories
CREATE TABLE categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Table des plats
CREATE TABLE menu_items (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  price integer NOT NULL,
  category text NOT NULL REFERENCES categories(name) ON UPDATE CASCADE,
  image text,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Table des paramètres du restaurant (une seule ligne, id fixé à 1)
CREATE TABLE restaurant_settings (
  id integer PRIMARY KEY DEFAULT 1,
  name text DEFAULT 'ETS AKIF',
  tagline text DEFAULT 'Fast Food · Lomé',
  whatsapp text DEFAULT '+22822225519',
  address text DEFAULT 'Boulevard du 13 Janvier, Béniglato, Lomé',
  hours text DEFAULT '08h00 – 04h00, tous les jours',
  instagram text DEFAULT 'https://instagram.com/akif.fastfood',
  sunday_note text DEFAULT 'Dimanche : horaires variables',
  updated_at timestamptz DEFAULT now()
);

-- Insérer la ligne de paramètres par défaut
INSERT INTO restaurant_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Table des commandes cuisine
CREATE TABLE kitchen_orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_number text NOT NULL,
  items jsonb NOT NULL,
  total integer NOT NULL,
  note text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'done')),
  created_at timestamptz DEFAULT now()
);

-- Activer Realtime sur kitchen_orders
ALTER TABLE kitchen_orders REPLICA IDENTITY FULL;

-- Index pour les commandes pending
CREATE INDEX idx_kitchen_orders_status ON kitchen_orders(status);
CREATE INDEX idx_kitchen_orders_created ON kitchen_orders(created_at DESC);
```

### Row Level Security (RLS)

```sql
-- Désactiver RLS sur toutes les tables (clé publishable côté client)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_orders DISABLE ROW LEVEL SECURITY;
```

### Données initiales (seeder)

```sql
-- Catégories
INSERT INTO categories (name, position) VALUES
  ('FAST FOOD', 0),
  ('GRILLADES', 1),
  ('SHAWARMA & KAFTA', 2),
  ('BOISSONS & JUS', 3),
  ('GLACES & DESSERTS', 4)
ON CONFLICT DO NOTHING;

-- Plats (reproduire exactement le menu de la section 11)
INSERT INTO menu_items (id, name, description, price, category, image, available) VALUES
  ('burger-classic',   'Burger Classic',      'Boeuf haché, fromage, laitue, tomate, sauce maison',           2000, 'FAST FOOD',        '/assets/burger.jpg',        true),
  ('burger-double',    'Double Burger',        'Double steak, double fromage, oignons caramélisés',            3000, 'FAST FOOD',        '/assets/burger.jpg',        true),
  ('sandwich-poulet',  'Sandwich Poulet',      'Poulet grillé, crudités, sauce blanche dans pain frais',       1500, 'FAST FOOD',        '/assets/hero-shawarma.jpg', true),
  ('sandwich-viande',  'Sandwich Viande',      'Viande hachée épicée, cornichons, tomate, sauce piquante',     1500, 'FAST FOOD',        '/assets/hero-shawarma.jpg', true),
  ('poulet-grille',    'Poulet Grillé',        'Demi-poulet mariné aux épices, grillé au charbon',             3500, 'GRILLADES',        '/assets/poulet-grille.jpg', true),
  ('brochettes-boeuf', 'Brochettes de Boeuf', 'Morceaux tendres marinés, grillés à la braise',                2500, 'GRILLADES',        '/assets/brochettes.jpg',    true),
  ('poisson-grille',   'Poisson Grillé',       'Poisson entier grillé, épices locales, accompagnement',        3000, 'GRILLADES',        '/assets/brochettes.jpg',    true),
  ('brochettes-poulet','Brochettes de Poulet', 'Brochettes de poulet mariné, servies avec sauce',              2000, 'GRILLADES',        '/assets/brochettes.jpg',    true),
  ('shawarma-poulet',  'Shawarma Poulet',      'Poulet mariné rôti à la broche, crudités, sauce tahin',        2000, 'SHAWARMA & KAFTA', '/assets/hero-shawarma.jpg', true),
  ('shawarma-viande',  'Shawarma Viande',      'Viande de boeuf rôtie, oignons, persil, sauce libanaise',      2500, 'SHAWARMA & KAFTA', '/assets/hero-shawarma.jpg', true),
  ('kafta-plat',       'Kafta en Plat',        'Viande hachée aux herbes, grillée, servie avec riz',           3000, 'SHAWARMA & KAFTA', '/assets/kafta.jpg',         true),
  ('kafta-sandwich',   'Kafta Sandwich',       'Kafta grillée dans pain libanais, tomate, oignon',             2000, 'SHAWARMA & KAFTA', '/assets/kafta.jpg',         true),
  ('jus-mangue',       'Jus de Mangue',        'Mangue fraîche pressée, sucré naturellement',                  1000, 'BOISSONS & JUS',   '/assets/jus-naturels.jpg',  true),
  ('jus-ananas',       'Jus d''Ananas',         'Ananas frais pressé, rafraîchissant',                          1000, 'BOISSONS & JUS',   '/assets/jus-naturels.jpg',  true),
  ('milkshake',        'Milkshake',            'Lait glacé, vanille ou chocolat, onctueux',                    1500, 'BOISSONS & JUS',   '/assets/jus-naturels.jpg',  true),
  ('cocktail-fruits',  'Cocktail de Fruits',   'Mélange de fruits frais de saison',                            1200, 'BOISSONS & JUS',   '/assets/jus-naturels.jpg',  true),
  ('glace-1boule',     'Glace 1 Boule',        'Vanille, chocolat, fraise ou mangue',                           500, 'GLACES & DESSERTS','/assets/glaces.jpg',         true),
  ('glace-2boules',    'Glace 2 Boules',       'Choix de deux parfums, cornet ou coupe',                        800, 'GLACES & DESSERTS','/assets/glaces.jpg',         true),
  ('glace-sundae',     'Sundae',               'Glace, chantilly, sauce chocolat, noisettes',                  1500, 'GLACES & DESSERTS','/assets/glaces.jpg',         true)
ON CONFLICT DO NOTHING;
```

---

## 1. IDENTITÉ DE LA MARQUE — DONNÉES VÉRIFIÉES

```
Nom         : ETS AKIF
Tagline     : Fast Food · Lomé
Adresse     : Boulevard du 13 Janvier, quartier Béniglato, Lomé
              (repère : non loin de Coris Bank)
Téléphone 1 : (+228) 22 22 55 19
Téléphone 2 : (+228) 97 04 14 14
WhatsApp    : +22822225519
Horaires    : 08h00 – 04h00 (presque 7j/7 — dimanche variable)
Instagram   : https://instagram.com/akif.fastfood (@akif.fastfood)
Menu        : Shawarma, kafta, burgers, sandwichs, poulet grillé,
              poisson grillé, brochettes, jus naturels, milkshakes, glaces
Ticket moy  : Snack ~1 500 FCFA · Plat ~3 000 FCFA
```

⚠️ **INTERDIT** : ne jamais écrire "halal", "libanais", "certifié halal" nulle part dans l'interface ou dans les meta tags.

---

## 2. DESIGN SYSTEM

### 2.1. Palette (couleurs exactes, pas de variations)

```
--paper        : #F5F0E4   (fond crème principal)
--akif-red     : #D42B2B   (accent primaire)
--akif-blue    : #1B3A8C   (bleu royal — nav, accents)
--akif-black   : #1A1A1A   (texte, fonds sombres)
--akif-white   : #FFFFFF
--akif-orange  : #F07A2A   (prix, accents tertiaires)
```

### 2.2. Typographie

- **Headings** : `Bebas Neue` (Google Fonts) — letter-spacing variable selon contexte
- **Body** : `Lora` (Google Fonts) — italic disponible (poids 400/500/600/700)
- **Pas d'autre font.** Aucun fallback sans-serif visible.

Importer dans `src/index.css` :
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
```

### 2.3. `tailwind.config.ts`

Étendre `colors` avec : `paper: "#F5F0E4"`, `"akif-red": "#D42B2B"`, `"akif-blue": "#1B3A8C"`, `"akif-black": "#1A1A1A"`, `"akif-orange": "#F07A2A"`. Étendre `fontFamily` : `bebas: ['"Bebas Neue"', 'sans-serif']`, `lora: ['"Lora"', 'serif']`. Garder les tokens shadcn standards (border, input, ring, background, foreground, primary, secondary, destructive, muted, accent, popover, card, sidebar). `--radius: 4px`.

### 2.4. `src/index.css` — animations & utilitaires sur mesure

Ajouter dans `@layer utilities` :
```css
.polaroid {
  padding: 12px;
  background: #FFFFFF;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  border: 1px solid rgba(0,0,0,0.08);
}
.img-treatment { filter: contrast(1.05) saturate(1.1); }
```

Keyframes obligatoires :
```css
@keyframes marquee   { 0% {transform: translateX(0)} 100% {transform: translateX(-50%)} }
@keyframes neon-buzz { 0%,100% {transform: translateX(0)} 25% {transform: translateX(-1px)} 75% {transform: translateX(1px)} }
@keyframes reveal-up { from {opacity:0; transform: translateY(20px)} to {opacity:1; transform: translateY(0)} }
@keyframes badge-pop { 0%{transform:scale(1)} 50%{transform:scale(1.3)} 100%{transform:scale(1)} }
@keyframes bounce-soft { 0%,100% {transform: translateY(0)} 50% {transform: translateY(8px)} }
@keyframes shake     { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
@keyframes modal-in  { from {opacity:0; transform: scale(0.9)} to {opacity:1; transform: scale(1)} }
@keyframes fade-out  { to {opacity:0; transform: scale(0.95)} }
```

Classes utilitaires associées :
- `.animate-marquee` → marquee 30s linear infinite
- `.neon-buzz` → 80ms ease-in-out 2
- `.reveal-up` → 450ms cubic-bezier(0.16,1,0.3,1) both
- `.badge-pop` → 300ms ease
- `.animate-bounce-soft` → 1.5s ease-in-out infinite
- `.animate-shake` → 300ms ease
- `.animate-modal-in` → 300ms ease-out
- `.animate-fade-out` → 400ms ease forwards

`body { font-family: 'Lora', serif; background: #F5F0E4; color: #1A1A1A; -webkit-font-smoothing: antialiased; }`

---

## 3. ROUTING & ARCHITECTURE GLOBALE (`src/App.tsx`)

```
PUBLIQUES (avec VerticalNav + CartDrawer + main ml-20)
  /             → HomePage
  /menu         → MenuPage
  /menu/scan    → MenuScanPage  (aucun lien dans la nav)
  /a-propos     → AboutPage
  /commander    → OrderPage
  /contact      → ContactPage
  *             → NotFound

STANDALONE (pas de nav, pas de cart drawer, pas de marge)
  /admin        → AdminPage   (mot de passe akif2025)
  /kitchen      → KitchenPage (sans auth)
```

Le composant `<Shell>` (sous BrowserRouter) regarde `useLocation().pathname`. Si `/admin` ou `/kitchen` → render uniquement les Routes correspondantes. Sinon → render `<VerticalNav /> <CartDrawer /> <main className="md:ml-20 pb-16 md:pb-0"><Routes>…</Routes></main>`.

`<App>` : `QueryClientProvider > TooltipProvider > CartProvider > Sonner > {loading && <LoadingScreen onComplete=…/>} > BrowserRouter > Shell`. État `loading` (true par défaut) géré par `LoadingScreen`.

---

## 4. LOADING SCREEN (`src/components/LoadingScreen.tsx`)

Plein écran fixe `z-[9999]` fond `#F5F0E4`. Affiche les 4 lettres **A K I F** une par une à `400ms, 550ms, 700ms, 850ms`. Chaque lettre : `font-bebas text-[120px] md:text-[160px] text-akif-red`, classe `neon-buzz` à l'apparition. À `1000ms` : ligne rouge `h-[2px] bg-akif-red mt-2` qui passe de `w-0` à `w-[120px]` (transition 300ms). À `1350ms` : sous-titre Lora italic 16px noir : "Fast Food · Lomé". À `1900ms` : fade-out (opacité 0, 400ms). À `2400ms` : `onComplete()`.

---

## 5. NAV VERTICALE (`src/components/VerticalNav.tsx`)

### Desktop (≥768px)
Sidebar fixe gauche `w-20 bg-akif-blue` pleine hauteur, `z-50`. En haut : logo rond `w-12 h-12 rounded-full border-2 border-akif-red` (image `akif-logo.png`). Puis 4 items `flex flex-col items-center gap-1`, espacés en `gap-10`, hover `scale-110` :

| Icône (lucide) | Label | Path |
|---|---|---|
| Home | ACCUEIL | / |
| UtensilsCrossed | MENU | /menu |
| Info | À PROPOS | /a-propos |
| Phone | CONTACT | /contact |

Chaque item : div ronde `w-10 h-10 rounded-full` qui devient `bg-akif-red` au hover ou si `active`. Icône blanche 22px. Sous l'icône : label `font-bebas text-[10px] tracking-[0.2em] text-white`.

5e item : bouton **Panier** (`ShoppingCart`). Badge `absolute -top-1 -right-1 bg-akif-orange text-white font-bebas text-[11px] w-5 h-5 rounded-full` qui affiche `count` si > 0, et reçoit `.badge-pop` quand `badgePop=true`.

Tout en bas : lien WhatsApp `<a href="https://wa.me/22822225519">` icône `MessageCircle` 22px sur fond `bg-akif-orange` rond.

### Mobile (<768px)
Bottom bar `h-16 bg-akif-blue` fixe `z-50`. Mêmes 4 items + Panier en `flex items-center justify-around`. Icônes 20px. Active = icône rouge.

---

## 6. CART CONTEXT (`src/context/CartContext.tsx`)

```ts
interface CartItem { id: string; name: string; price: number; quantity: number; image?: string; }
interface CartContextType {
  items: CartItem[];
  addItem(i: Omit<CartItem,"quantity">): void;
  removeItem(id: string): void;
  updateQuantity(id: string, q: number): void;  // q<=0 → remove
  clear(): void;
  total: number;     // Σ price*quantity
  count: number;     // Σ quantity
  isOpen: boolean; setIsOpen(b: boolean): void;
  badgePop: boolean;
  scanMode: boolean; setScanMode(b: boolean): void;
}
```

Persistance dans `localStorage["akif-cart"]` (le panier reste local — il n'a pas besoin d'être partagé entre appareils). À chaque `addItem` : badge pop 300ms, puis ouverture du drawer 600ms après.

---

## 7. CART DRAWER (`src/components/CartDrawer.tsx`)

Drawer droit `fixed top-0 right-0 bottom-0 w-full md:w-[360px] bg-white border-l-2 border-akif-black z-[70]`. Slide via `translate-x-full` ↔ `translate-x-0`, transition 300ms cubic-bezier(0.22,1,0.36,1). Overlay `bg-akif-black/35 z-[60]`.

**Header** : barre `bg-akif-red px-4 py-3` avec icône `ShoppingCart` 18px blanc + texte Bebas Neue 18px tracking-[0.15em] :
- Mode normal : "MA COMMANDE"
- Mode scan : "TABLE {N°}"

Bouton X 20px à droite.

**Body** :
- Vide → icône ShoppingCart 40px noir/15 + Lora italic 14px noir/50 "Rien ici... pour l'instant."
- Sinon : pour chaque item, ligne avec nom Lora 15px medium, prix Bebas 18px orange, contrôles `−` `qty` `+` (boutons 28×28 border noir/15, hover bg rouge texte blanc), icône Trash2 16px noir/30 hover rouge.

**Footer** :
- Sous-total : "Sous-total" Lora 14px + total Bebas 24px noir
- Textarea 64px paper border noir/15, placeholder selon mode :
  - Normal : "Précision ou adresse de livraison..."
  - Scan : "Précision pour la cuisine..."
- Bouton plein largeur `bg-akif-red text-white font-bebas text-base tracking-[0.08em] py-3 rounded` icône `MessageCircle` :
  - Normal : "ENVOYER VIA WHATSAPP"
  - Scan : "ENVOYER À LA CUISINE"

**Logique d'envoi** :
1. Construire `msg = "Bonjour, je souhaite commander :\n\n" + items + "\nTotal : X FCFA" + (note ? "\nNote : ..." : "")`
2. Si `scanMode` → préfixer `"Commande Table N\n\n"`, appeler `addKitchenOrder({...})` (voir section 12), vider le panier (`clear()`), fermer le drawer
3. `window.open("https://wa.me/22822225519?text=" + encodeURIComponent(msg), "_blank")`

---

## 8. SCROLL REVEAL (`src/components/ScrollReveal.tsx`)

Wrapper avec `IntersectionObserver` (threshold 0.1, déconnecte au premier intersect). Style inline : `opacity 0→1`, `translateY(20px)→0`, transition 450ms cubic-bezier(0.16,1,0.3,1) avec `transitionDelay = ${delay}ms`. Prop `delay?: number`.

---

## 9. MARQUEE BAND (`src/components/MarqueeBand.tsx`)

```tsx
const text = "OUVERT 08H–04H · BD. 13 JANVIER BÉNIGLATO · SHAWARMA · KAFTA · BURGERS · GRILLADES · JUS NATURELS · ";
```

`<div className="bg-akif-red overflow-hidden py-3"><div className="animate-marquee whitespace-nowrap flex">` → 4 spans avec ce texte `font-bebas text-sm tracking-[0.1em] text-white mx-4`.

---

## 10. FOOTER (`src/components/Footer.tsx`)

Lire `settings` depuis Supabase via le hook `useRestaurantSettings()` (voir section 12). Afficher les données dynamiques (nom, adresse, instagram, etc.) plutôt que des valeurs hardcodées.

`<footer className="bg-akif-black text-white py-16 px-6 md:px-12">` → grid 3 colonnes max-w-6xl :

1. **AKIF** Bebas 5xl rouge + `settings.tagline` Lora 14px blanc/50
2. 5 liens Bebas 14px tracking-wide blanc, hover rouge : ACCUEIL, MENU, À PROPOS, COMMANDER, CONTACT
3. Icône Instagram (20px + `@akif.fastfood`) + MapPin + `settings.address` + 2 numéros Lora 14px blanc/60

Ligne légale en bas : border-top blanc/10, mt-12 pt-6, "© 2025 ETS AKIF · Boulevard du 13 Janvier, Lomé, Togo" Lora 11px blanc/25.

---

## 11. DONNÉES MENU (`src/data/menu.ts`)

Ce fichier contient uniquement les types et les assets. Les données réelles viennent de Supabase.

```ts
// Types
export interface MenuItem {
  id: string; name: string; description: string;
  price: number; category: string; image: string; available: boolean;
}
export interface RestaurantSettings {
  name: string; tagline: string; whatsapp: string; address: string;
  hours: string; instagram: string; sunday_note: string;
}
export interface KitchenOrder {
  id: number; table_number: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  total: number; note?: string;
  status: "pending" | "done";
  created_at: string;
}

// Assets importés (utilisés dans le seeder et les pages statiques)
import burger from "../assets/burger.jpg";
import heroShawarma from "../assets/hero-shawarma.jpg";
// … etc.
export { burger, heroShawarma /* … */ };
```

---

## 12. COUCHE DONNÉES SUPABASE (`src/lib/restaurantData.ts`)

Toutes les fonctions d'accès aux données sont centralisées ici. Remplace entièrement l'ancien `localStorage["restaurantData"]` et `localStorage["kitchenOrders"]`.

```ts
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
```

### Hooks React Query (`src/hooks/useRestaurantData.ts`)

```ts
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
export function useMarkOrderDone()   { const qc = useQueryClient(); return useMutation({ mutationFn: db.markOrderDone,   onSuccess: () => qc.invalidateQueries({ queryKey: ["kitchenOrders"] }) }); }
export function useClearAllOrders()  { const qc = useQueryClient(); return useMutation({ mutationFn: db.clearAllOrders,  onSuccess: () => qc.invalidateQueries({ queryKey: ["kitchenOrders"] }) }); }
export function useClearDoneOrders() { const qc = useQueryClient(); return useMutation({ mutationFn: db.clearDoneOrders, onSuccess: () => qc.invalidateQueries({ queryKey: ["kitchenOrders"] }) }); }
```

### Realtime Supabase pour la cuisine (`src/hooks/useKitchenRealtime.ts`)

```ts
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
```

---

## 13. ASSETS IMAGES (à générer)

Placer dans `src/assets/` (formats .jpg sauf logo .png) :

| Fichier | Sujet |
|---|---|
| `akif-logo.png` | Logo rond AKIF rouge sur blanc, transparent |
| `hero-fire.jpg` | 1920×1280 — Brochettes/kebab grillés sur flammes, fond noir dramatique, fumée, ambiance restaurant africain Lomé |
| `hero-shawarma.jpg` | Shawarma close-up, fond chaud |
| `kafta.jpg` | Kafta grillée |
| `burger.jpg` | Burger gourmet |
| `poulet-grille.jpg` | Demi-poulet grillé |
| `brochettes.jpg` | Brochettes braise |
| `jus-naturels.jpg` | Jus de fruits frais |
| `glaces.jpg` | Coupes de glace |
| `restaurant-interior.jpg` | Intérieur convivial du restaurant |
| `gallery-juice.jpg` | 1024×1280 — Verre de jus orange/mangue avec glace pilée |
| `gallery-kofta.jpg` | 1024×1024 — Brochette kofta sur grill avec flammes |
| `gallery-burger.jpg` | 1024×1280 — Burger stacked, coupe, sésame |
| `gallery-ice.jpg` | 1024×1024 — Glace chocolat dans cornet |
| `ambiance-night.jpg` | 1280×1600 — Stand street food africain de nuit, guirlandes lumineuses |

---

## 14. PAGE D'ACCUEIL (`src/pages/HomePage.tsx`)

### 14.1. HERO — full viewport
`<section className="relative overflow-hidden flex items-center px-6 md:px-12" style={{minHeight:"calc(100vh - 0px)"}}>`

- `<img src={heroFire}>` absolute inset-0 w-full h-full object-cover
- Overlay absolute inset-0 : `background: linear-gradient(135deg, rgba(26,26,26,0.85) 0%, rgba(212,43,43,0.6) 50%, rgba(27,58,140,0.4) 100%)`
- Filigrane "A" : `<span className="absolute -left-8 md:-left-16 -top-20 font-bebas text-[400px] md:text-[600px] text-white/[0.05] leading-none select-none pointer-events-none z-10">A</span>`

Grid 5 cols max-w-6xl `relative z-20 py-20` :
- **Col gauche (3/5)** :
  - `<h1 className="font-bebas text-[120px] md:text-[240px] leading-[0.85] text-white -mt-6 md:-mt-12 drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">AKIF</h1>` (déborde en haut)
  - Sous-titre Lora italic 18px white/90 : "Fast Food · Lomé"
  - CTA Link `/menu` : `bg-akif-red text-white font-bebas text-sm tracking-[0.08em] px-8 py-3 rounded shadow-lg hover:scale-[1.03] active:scale-[0.97]` → "VOIR LE MENU"
  - Sous le CTA, 3 badges inline (`mt-6 flex flex-wrap gap-2`) : pour chaque texte, span `font-bebas text-[11px] tracking-[0.2em] text-white px-3 py-1.5 rounded border border-white/20` style `background: rgba(0,0,0,0.6)`. Textes : "OUVERT 08H–04H", "BD. 13 JANVIER", "COMMANDE VIA WHATSAPP"
- **Col droite (2/5)** :
  - `<div className="polaroid rotate-3 hover:rotate-0 transition-transform duration-300 md:translate-x-5" style={{padding:16}}>`
  - Image `heroShawarma` `w-full max-w-[420px] aspect-[420/520] object-cover img-treatment` style `width:420 height:520 maxWidth:"100%"`
  - Sous l'image, label `bg-akif-red px-3 py-1 inline-flex items-center gap-1 rounded-sm` : icône Star 14px blanc + Lora 12px blanc "Depuis des années Bd. 13 Janvier"

Indicator scroll en bas : `<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"><ChevronsDown size={28} className="text-akif-red animate-bounce-soft"/></div>`

### 14.2. `<MarqueeBand />`

### 14.3. GALERIE IMMERSIVE
Section `px-6 md:px-12 py-16` max-w-6xl :
- ScrollReveal → `<h2 className="font-bebas text-5xl md:text-[64px] text-akif-black mb-8">LA CARTE EN IMAGES</h2>`
- Container masonry CSS columns : `<div className="columns-2 md:columns-3 gap-3 [column-fill:_balance]">`
- 6 images dans cet ordre : `heroShawarma`, `pouletGrille`, `galleryKofta`, `galleryJuice`, `galleryBurger`, `galleryIce`
- Chaque : `<div className="mb-3 break-inside-avoid overflow-hidden rounded-lg group"><img loading="lazy" className="w-full h-auto object-cover transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-110"/></div>`

### 14.4. NOS INCONTOURNABLES
Section `px-6 md:px-12 py-20 bg-paper` max-w-6xl :
- ScrollReveal → `<h2 className="font-bebas text-6xl md:text-[72px] text-akif-black mb-12">NOS INCONTOURNABLES</h2>`
- Grid 3 cols gap-8. 3 items :

```ts
[
  { id:"shawarma-poulet", name:"Shawarma Poulet", desc:"Poulet rôti à la broche, crudités, sauce tahin", price:2000, image:heroShawarma, cat:"SHAWARMA" },
  { id:"kafta-plat",      name:"Kafta en Plat",   desc:"Viande hachée aux herbes grillée, servie avec riz", price:3000, image:kafta,        cat:"GRILLADES" },
  { id:"burger-classic",  name:"Burger Classic",  desc:"Boeuf haché, fromage, laitue, sauce maison",    price:2000, image:burger,       cat:"FAST FOOD" },
]
```

Chaque carte (wrappée ScrollReveal delay i*60) : `bg-white border-2 border-akif-black hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-200 overflow-hidden`. Image carrée + badge catégorie absolute top-3 left-3 `bg-akif-blue text-white font-bebas text-[10px] tracking-[0.15em] px-2 py-1`. Padding 5 : titre Bebas 24px noir, desc Lora italic 14px noir/70, prix Bebas 30px orange + bouton "AJOUTER" `bg-akif-red text-white font-bebas text-xs tracking-[0.08em] px-4 py-2 hover:scale-[1.03]` qui appelle `addItem(...)`.

### 14.5. TÉMOIGNAGES — CASCADE + POST-IT
Section `bg-akif-black px-6 md:px-12 py-24 relative` max-w-6xl. Grid 3 cols gap-8 relative.

3 reviews :
```ts
[
  { text: "Rapide, copieux, prix imbattables. On y retourne toujours.", author: "Client régulier" },
  { text: "Le meilleur shawarma du boulevard. Ouvert tard, parfait après les sorties.", author: "Étudiant, Lomé" },
  { text: "Portions généreuses, service rapide. Un classique de Béniglato.", author: "Famille locale" },
]
```

Chaque (wrap ScrollReveal delay i*60) : div avec `style={{marginTop: i*40}}` → cascade. Texte Lora italic 20px white, auteur Bebas 14px rouge mt-4 tracking-wide.

**Post-it 4e citation** (desktop only, hidden md:block) : `absolute bottom-[-30px] right-0 max-w-[260px] bg-akif-blue text-white p-5 shadow-xl` style `transform: rotate(-2deg)`. Texte Lora italic 16px : "Quand on rentre tard, c'est ici qu'on s'arrête. Toujours." + auteur Bebas 12px white/70 mt-3 "Voisin du quartier".

### 14.6. AMBIANCE + STORY (avant footer)
Section `px-0 py-0` grid 5 cols :
- **Col gauche (3/5)** `bg-akif-black p-8 md:p-12 flex items-center justify-center` : `<div className="polaroid -rotate-3" style={{padding:14}}>` avec `<img src={ambianceNight} className="w-full max-w-[520px] aspect-[4/5] object-cover img-treatment" loading="lazy"/>`
- **Col droite (2/5)** `bg-paper p-8 md:p-12 flex flex-col justify-center` :
  - `<h2 className="font-bebas text-5xl md:text-[56px] text-akif-red leading-[0.95]">DEPUIS DES ANNÉES SUR LE BOULEVARD</h2>`
  - Paragraphe Lora 16px noir mt-6 line-height 1.7 :
    > ETS AKIF s'est installé Boulevard du 13 Janvier, quartier Béniglato — en face de Coris Bank. Des étudiants, des familles, des noctambules. Ouverts de 08h à 04h du matin, presque tous les jours. Des shawarmas, des grillades, des jus. Rien ne change parce que rien ne doit changer.
  - `<div className="flex items-center gap-2 mt-6"><MapPin size={18} className="text-akif-blue"/><span className="font-lora font-bold text-sm text-akif-black">Béniglato · Lomé, Togo</span></div>`

### 14.7. CHIFFRES
Section `px-6 md:px-12 py-20 bg-paper` max-w-6xl, grid 2/4 cols gap-8 text-center. 4 items (chacun ScrollReveal delay i*60) :

```
{ big: "08H–04H",    sub: "Ouvert tous les jours" }
{ big: "1 500",      sub: "FCFA le snack dès" }
{ big: "LIVRAISON",  sub: "Béniglato & alentours" }
{ big: "BD. 13",     sub: "Janvier, Béniglato" }
```

`big` : Bebas 4xl md:6xl rouge. `sub` : Lora 14px noir mt-2.

### 14.8. `<Footer />`

---

## 15. PAGE MENU (`src/pages/MenuPage.tsx`)

Utiliser le hook `useAvailableItems()` et `useCategories()` pour charger les données depuis Supabase. Afficher un état de chargement (spinner ou skeleton minimaliste fond paper) pendant le fetch. Afficher un message d'erreur Lora 14px rouge/70 si le fetch échoue.

Header bleu : `<div className="bg-akif-blue px-6 md:px-12 py-16">` max-w-6xl :
- `<h1 className="font-bebas text-6xl md:text-[96px] text-white leading-none">NOTRE MENU</h1>`
- `<p className="font-lora italic text-base text-white/70 mt-2">Fait à Lomé · Bd. 13 Janvier</p>`

Tabs sticky : `<div className="sticky top-0 z-30 bg-paper border-b border-akif-black/10 px-6 md:px-12">` max-w-6xl flex gap-2 py-3 overflow-x-auto. Chaque catégorie : bouton `font-bebas text-[13px] tracking-wide px-4 py-2 rounded whitespace-nowrap`. Active = `bg-akif-red text-white`. Inactive = `text-akif-black hover:bg-akif-black/5`.

Liste plats : `px-6 md:px-12 py-12 min-h-[60vh]` max-w-6xl :
- ScrollReveal → tampon catégorie `<h2 className="font-bebas text-5xl text-akif-red -rotate-1 mb-8 inline-block border-b-2 border-akif-red pb-1">{activeCategory}</h2>`
- Grid 1/2 cols gap-0. Chaque item (ScrollReveal delay i*60) :
  - `<div className="flex items-center gap-4 py-4 px-3 border-b border-akif-black/10 hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-150 group">`
  - Image 80×80 rounded img-treatment
  - Nom Lora 18px semibold + desc Lora italic 14px noir/70 truncate
  - Prix Bebas 24px orange + bouton rond 36×36 `rounded-full bg-akif-red text-white hover:scale-110` icône Plus 18px → `addItem`

`<Footer />`

---

## 16. PAGE À PROPOS (`src/pages/AboutPage.tsx`)

Section éditoriale `px-6 md:px-12 py-20` max-w-6xl, grid 2 cols items-center :
- ScrollReveal : Polaroid `-rotate-2` avec `restaurantInterior` aspect-[3/2]
- ScrollReveal delay 100 :
  - `<h1 className="font-bebas text-6xl md:text-[72px] text-akif-red leading-none">L'HISTOIRE D'AKIF</h1>`
  - Bloc Lora 16px noir leading-relaxed mt-6 space-y-4 — 4 paragraphes :
    1. "Installé sur le Boulevard du 13 Janvier à Béniglato, ETS AKIF est devenu une adresse incontournable de la restauration rapide à Lomé. Portions généreuses, prix accessibles."
    2. "Shawarma, kafta, burgers, grillades — chaque plat est préparé avec des ingrédients frais. Le ticket moyen ? Snack dès 1 500 FCFA, plat complet autour de 3 000 FCFA."
    3. "La clientèle est à l'image du boulevard : diverse. Étudiants en pause, familles du quartier, noctambules en quête d'un repas après minuit. Akif les accueille tous, de 8h du matin à 4h."
    4. (italic 14px noir/60) "Note : le fonds de commerce a été cédé en 2018, ce qui explique certaines variations dans les retours clients selon les périodes."

Section valeurs `bg-white px-6 md:px-12 py-20` max-w-6xl, grid 2 cols gap-12 :
- 2 cartes (ScrollReveal delay i*60) text-center :
  - Icône `Zap` 32px bleu mx-auto + "RAPIDE PAR ADN" Bebas 30px noir + Lora 14px noir/70 : "Service express, sans compromis sur la qualité. Votre commande en quelques minutes."
  - Icône `Clock` 32px bleu + "OUVERT JUSQU'À 04H" + "Noctambules, étudiants, familles — Akif ne dort (presque) jamais."

⚠️ **Pas de 3e carte "Halal certifié"**.

`<Footer />`

---

## 17. PAGE COMMANDER (`src/pages/OrderPage.tsx`)

Header rouge `bg-akif-red px-6 md:px-12 py-16 relative overflow-hidden` :
- Filigrane "?" : `<span className="absolute right-4 top-1/2 -translate-y-1/2 font-bebas text-[300px] text-white/[0.04] leading-none select-none pointer-events-none">?</span>`
- `<h1 className="font-bebas text-6xl md:text-[80px] text-white leading-none">COMMANDER · TRAITEUR</h1>`

Section grid 2 cols max-w-6xl `px-6 md:px-12 py-20` :

**Carte 1** ScrollReveal `bg-white border-2 border-akif-black p-8` :
- Bebas 4xl noir : "COMMANDER"
- Lora 14px noir/70 mt-1 mb-8 : "Sur place · À emporter · Livraison (zone Béniglato)"
- 3 étapes (n + texte) Bebas 60px rouge + Lora 14px noir/80 :
  1. "Parcourez notre menu et ajoutez vos plats au panier"
  2. "Vérifiez votre commande et ajoutez une note si besoin"
  3. "Envoyez via WhatsApp — on prépare tout de suite"
- CTA `<a href="https://wa.me/22822225519" target="_blank">` plein largeur `bg-akif-red text-white font-bebas tracking-[0.08em] px-6 py-3 rounded` icône MessageCircle + "COMMANDER VIA WHATSAPP"

**Carte 2** ScrollReveal delay 60 `bg-akif-blue p-8` :
- Bebas 4xl blanc : "TRAITEUR"
- Lora 14px white/70 : "Événements · Mariages · Entreprises"
- 3 étapes (chiffres Bebas 60px white/30) :
  1. "Décrivez votre événement : nombre de personnes, date, type"
  2. "On vous propose un menu sur mesure avec devis"
  3. "On livre et on s'occupe de tout le jour J"
- CTA `<a href="tel:+22822225519">` `bg-white text-akif-blue` icône Phone + "NOUS APPELER"

`<Footer />`

---

## 18. PAGE CONTACT (`src/pages/ContactPage.tsx`)

Utiliser le hook `useRestaurantSettings()` pour afficher les données dynamiques (adresse, horaires, numéros, note dimanche).

3 sections empilées (chacune ScrollReveal), text-center max-w-4xl :

1. `bg-paper py-16` : icône MapPin 32px bleu + Bebas 4xl/5xl noir "BOULEVARD DU 13 JANVIER" + Lora 16px noir/70 `{settings.address}` + lien Bebas 14px bleu border-b-2 (hover rouge) "OUVRIR DANS GOOGLE MAPS" → `https://www.google.com/maps/search/Boulevard+du+13+Janvier+Béniglato+Lomé`

2. `bg-akif-blue py-16` : icône Phone 32px blanc + Bebas 4xl/5xl blanc "(+228) 22 22 55 19 · (+228) 97 04 14 14" + Lora 16px white/70 "WhatsApp disponible sur les deux numéros"

3. `bg-akif-red py-16` : icône Clock 32px blanc + Bebas 5xl/6xl blanc `{settings.hours}` + Lora italic 14px white/80 `{settings.sunday_note}`

Iframe Google Maps `w-full h-[300px] border-0` (embed Lomé)

`<Footer />`

---

## 19. PAGE SCAN (`src/pages/MenuScanPage.tsx`)

```tsx
const MenuScanPage = () => {
  const { setScanMode } = useCart();
  const [tableNumber, setTableNumber] = useState(() => localStorage.getItem("tableNumber"));
  useEffect(() => { setScanMode(true); return () => setScanMode(false); }, []);
  if (!tableNumber) return <TableModal onConfirm={n => setTableNumber(n)} />;
  return (
    <div>
      <div className="bg-akif-blue text-white text-center py-2 font-bebas tracking-[0.15em] text-sm">
        TABLE {tableNumber} · COMMANDE SUR PLACE
      </div>
      <MenuPage />
    </div>
  );
};
```

### TableModal (`src/components/TableModal.tsx`)

⚠️ **Non-dismissable** : pas de croix, pas de clic overlay (stopPropagation), pas d'Escape, pas de lecture URL.

`<div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{background:"rgba(26,26,26,0.92)"}}>`
`<div className="bg-white rounded-2xl p-12 w-full max-w-[360px] animate-modal-in shadow-2xl">`
- Icône Hash 40px bleu mx-auto
- Bebas 4xl noir text-center mt-4 : "Votre numéro de table ?"
- Lora 14px noir/60 text-center mt-2 : "Entrez le numéro inscrit sur votre table"
- Input `type="number" min="1" autoFocus` : `mt-8 w-full h-16 text-center font-bebas text-3xl border-2 border-akif-black rounded-lg focus:border-akif-red`. Enter → submit. Placeholder "ex : 5".
- Bouton submit : `mt-4 w-full h-[52px] bg-akif-red text-white font-bebas text-base tracking-[0.08em] rounded hover:bg-akif-blue transition-colors duration-[180ms] disabled:opacity-50` → "CONFIRMER". Au clic : `localStorage.setItem("tableNumber", value)` puis `onConfirm(value)`.

---

## 20. PAGE ADMIN (`src/pages/AdminPage.tsx`)

```ts
const ADMIN_PASSWORD = "akif2025"; // ⚠️ À changer avant mise en ligne
```

### 20.1. Login
Si `sessionStorage.getItem("adminAuth") !== "1"` → afficher `<Login>` :
- Plein écran `bg-paper`, container max-w-sm centré
- Logo "AKIF" Bebas 6xl rouge text-center
- Sous-titre Lora italic 14px noir/60 text-center : "Accès réservé"
- Input `type="password" autoFocus` : `h-12 w-full px-3 border-2 rounded font-lora text-base`. Border noir par défaut, rouge si erreur. Focus border rouge. Enter → submit.
- Si erreur : container reçoit `.animate-shake` (320ms), border input rouge, message Lora 13px rouge "Mot de passe incorrect".
- Bouton "ENTRER" : h-12 plein largeur `bg-akif-red text-white font-bebas tracking-[0.1em] hover:bg-akif-blue`.
- Au succès : `sessionStorage.setItem("adminAuth","1")`.

### 20.2. Dashboard layout
Fond `#F8F9FA`. Sidebar fixe gauche `w-[220px] bg-white border-r border-[#E5E7EB]` :
- Header : Bebas 28px rouge "AKIF" + Lora 11px gris "Administration"
- Nav : 4 boutons gap-1 padding-3, items :
  - `menu` (UtensilsCrossed) "Menu"
  - `categories` (Tag) "Catégories"
  - `settings` (Settings) "Paramètres"
  - `orders` (Inbox) "Commandes" + badge rouge si nouvelles commandes
- Item actif : `bg-[#F3F4F6] text-black`, icône rouge. Inactif : `text-[#6B7280] hover:bg-[#F9FAFB]`.
- Bouton "Déconnexion" en bas (`LogOut` 16px) : retire sessionStorage, retour login.

`<main className="ml-[220px] p-8">` rendu de la section active.

Footer admin : `<p className="text-[11px] text-[#9CA3AF] italic mt-12">⚠️ Mot de passe par défaut "akif2025" — à changer avant mise en ligne.</p>`

### 20.3. Section MENU
Utiliser les hooks `useMenuItems()`, `useCreateMenuItem()`, `useUpdateMenuItem()`, `useDeleteMenuItem()` (section 12). Afficher un spinner pendant le chargement. Les mutations déclenchent automatiquement le rechargement via React Query.

- Header : "Gestion du Menu" 20px bold + bouton "Ajouter un plat" `bg-akif-red text-white px-4 py-2 rounded text-sm flex gap-2` icône Plus
- Pour chaque catégorie : titre 14px uppercase tracking-wider gris + badge rond gris (count)
- Liste `bg-white rounded-lg border divide-y` : pour chaque plat, ligne flex gap-3 p-3 :
  - Image 48×48 rounded-md
  - Nom 14px medium + desc 12px gris truncate
  - Prix Bebas 16px orange
  - Toggle disponible (40×20 rounded-full, vert `#10B981` si actif, gris `#D1D5DB` sinon, ronde blanche 16px qui glisse) → au clic, `useUpdateMenuItem()` avec `{ available: !current }`
  - Bouton Edit2 16px (hover bleu)
  - Bouton Trash2 16px (hover rouge)
- Suppression inline : sous la ligne, "Confirmer la suppression ?" + boutons "Oui" (rouge) / "Non" (gris) → `useDeleteMenuItem()`
- Modal ajout/edit : centré, fond blanc rounded-lg p-6 max-w-md. Champs : Nom, Description (textarea 80px), Prix (number) + Catégorie (select alimenté par `useCategories()`), URL image, checkbox Disponible. Boutons "Annuler" gris + "Sauvegarder" rouge → `useCreateMenuItem()` ou `useUpdateMenuItem()`. Fermeture sur X ou Escape.

### 20.4. Section CATÉGORIES
Utiliser les hooks `useCategories()`, `useCreateCategory()`, `useUpdateCategory()`, `useDeleteCategory()`.

- Liste `bg-white rounded-lg border divide-y` : par catégorie ligne flex gap-3 p-3 :
  - Input nom (rename onBlur si changé → `useUpdateCategory()`)
  - Compteur "{N} plats" (text-xs gris) — récupéré depuis `useMenuItems()` filtré par catégorie
  - ChevronUp / ChevronDown (réordonner → `useUpdateCategory()` avec `position` swappée)
  - Trash2 (désactivé si count > 0, tooltip title "Vider d'abord la catégorie")
- En bas, ajout : input + bouton "Ajouter" (rouge, icône Plus) → `useCreateCategory()`. Convertit en uppercase.

### 20.5. Section PARAMÈTRES
Utiliser le hook `useRestaurantSettings()` pour pré-remplir le formulaire et `useSaveSettings()` pour sauvegarder.

Carte blanche max-w-xl border rounded-lg p-6, formulaire avec 7 champs (label xs gris + input h-10) : `name`, `tagline`, `whatsapp`, `address`, `hours`, `instagram`, `sunday_note`. Bouton "Sauvegarder" rouge icône `Save` (+ icône Check 1.5s après save).

### 20.6. Section COMMANDES
Utiliser le hook `useKitchenRealtime()` (section 12) pour recevoir les nouvelles commandes en temps réel via Supabase Realtime — pas de polling. Utiliser `useKitchenOrders()` pour la liste initiale, `useMarkOrderDone()` et `useClearAllOrders()`.

- Header : "Commandes en cuisine" 20px bold + bouton "Tout effacer" gris (confirm) → `useClearAllOrders()`
- Pending (status pending, triées created_at desc) : grid 2 cols gap-4. Carte `bg-white border border-[#E5E7EB] border-l-4 border-l-akif-red rounded-lg p-4` :
  - Badge `bg-akif-blue text-white font-bebas text-xl px-3 py-1 rounded` "TABLE {N}" + heure Lora 13px gris droite
  - Liste items Lora 14px : "× {qty} {name}"
  - Total Bebas 18px orange + bouton "SERVIE" `bg-[#10B981] text-white font-bebas text-xs px-3 py-1.5 rounded` → `useMarkOrderDone(id)`
- Archived : titre "Servies" uppercase tracking-wider gris, mêmes cartes mais `bg-[#F9FAFB] border-l-[#D1D5DB]`, sans bouton.
- Badge "newOrders" sur sidebar : compter les commandes `pending` depuis le dernier accès à la section. Quand on entre dans la section, réinitialiser le compteur.

---

## 21. PAGE CUISINE (`src/pages/KitchenPage.tsx`)

Pas d'auth. Utiliser `useKitchenRealtime(onNewOrder)` pour les mises à jour en temps réel (Supabase Realtime — pas de polling). Utiliser `useKitchenOrders()`, `useMarkOrderDone()`, `useClearAllOrders()`, `useClearDoneOrders()`. Horloge mise à jour chaque seconde via `setInterval`.

Layout fond `#0A0A0A`, texte blanc.

**Header** sticky `flex items-center justify-between px-6 py-4 bg-[#1A1A1A] border-b border-akif-red` :
- Gauche : icône `UtensilsCrossed` 20px blanc + "AKIF · CUISINE" Bebas 24px tracking-[0.1em]
- Droite : heure (`now.toLocaleTimeString("fr-FR")`) Bebas 24px rouge + bouton "TOUT EFFACER" `bg-[#374151] hover:bg-[#4B5563] font-bebas text-xs px-3 py-2 rounded` (confirm → `useClearAllOrders()`)

**Main** `p-6` :
- Si pending vide : centré Lora italic blanc/40 "Aucune commande en attente."
- Sinon grid `grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5`. Chaque carte pending :
  - `bg-[#1A1A1A] border-2 border-akif-red rounded-xl p-5`
  - Header : "TABLE" Bebas 13px white/50 tracking-[0.15em] + numéro Bebas 56px rouge leading-none + heure Lora 12px `#9CA3AF` à droite
  - Séparateur `border-t border-white/10 my-4`
  - Liste items `space-y-1`, line-height 1.8 : flex justify-between → "× {qty} {name}" Lora 15px blanc / sous-total Bebas 15px orange
  - Séparateur identique
  - Total : "TOTAL" Bebas 13px white/50 + montant Bebas 24px orange
  - Bouton "SERVIE ✓" : `w-full h-11 bg-[#10B981] hover:bg-[#059669] rounded-lg font-bebas text-sm tracking-[0.1em] flex items-center justify-center gap-2` + icône Check 16px. Au clic : `useMarkOrderDone(id)`.

**Section Servies** (si > 0) : `bg-[#111827] rounded-xl p-5 mt-12`. Bouton toggle "▼/▶ SERVIES AUJOURD'HUI ({count})" Bebas tracking-[0.15em] white/70. Si ouvert : grid 3 cols cards `bg-[#1F2937] border-white/10 opacity-60` (table + total + résumé items Lora xs white/40). Bouton "EFFACER LES SERVIES" `bg-[#374151] font-bebas text-xs` → `useClearDoneOrders()`.

**Note bas de page** Lora italic 12px `#6B7280` text-center max-w-xl mx-auto mt-12 :
> Les commandes apparaissent ici en temps réel via Supabase Realtime. Toute commande envoyée depuis /menu/scan sur n'importe quel appareil est reçue instantanément sur cet écran.

**Titre d'onglet** : à chaque nouvelle commande reçue via Realtime, `document.title = "🔔 Nouvelle commande · AKIF Cuisine"`. Sinon "AKIF Cuisine". L'emoji n'est autorisé QUE dans le titre d'onglet (jamais dans l'UI).

---

## 22. NotFound (`src/pages/NotFound.tsx`)

Page simple plein écran, fond paper, centré : "404" Bebas 96px rouge + Lora 16px "Cette page n'existe pas" + Link "/" Bebas 14px bleu underline "← Retour à l'accueil".

---

## 23. SEO `index.html`

```html
<title>ETS AKIF — Fast Food à Lomé</title>
<meta name="description" content="ETS AKIF, fast food à Lomé. Shawarma, kafta, burgers, grillades. Boulevard du 13 Janvier, Béniglato. Ouvert 08h–04h.">
<meta property="og:type" content="website">
<meta property="og:title" content="ETS AKIF — Fast Food à Lomé">
<meta property="og:description" content="…idem…">
<meta name="twitter:card" content="summary_large_image">
```

`<html lang="fr">`. Aucune mention "halal" ou "libanais" dans les meta.

---

## 24. CONTRAINTES ABSOLUES (récapitulatif)

- ❌ Jamais de mots "halal" ou "libanais" dans l'interface ni les meta (descriptions de plats internes OK).
- ❌ Aucun lien vers `/admin`, `/kitchen`, `/menu/scan` dans la nav publique.
- ❌ Pas d'emojis dans l'UI (sauf titre d'onglet `/kitchen`).
- ❌ TableModal : non-dismissable, saisie manuelle, jamais via URL `?table=`.
- ✅ Toutes les icônes : `lucide-react`, strokeWidth par défaut (2).
- ✅ Toutes couleurs HSL/hex exactes — aucune variation.
- ✅ Polices uniquement Bebas Neue + Lora.
- ✅ Mot de passe admin hardcodé `"akif2025"` avec note visible "À changer avant mise en ligne".
- ✅ Persistance panier : `localStorage["akif-cart"]` (local uniquement).
- ✅ Numéro de table : `localStorage["tableNumber"]` (local uniquement).
- ✅ Session admin : `sessionStorage["adminAuth"]` (local uniquement).
- ✅ **Toutes les données métier (menu, catégories, paramètres, commandes) → Supabase uniquement.**
- ✅ **Supabase Realtime activé sur `kitchen_orders` → notifications instantanées sur `/kitchen` et `/admin > Commandes` sans polling.**
- ✅ `useKitchenRealtime()` utilisé dans `/kitchen` ET dans `/admin` section Commandes.
- ✅ `getRestaurantSettings()` utilisé dans `Footer`, `ContactPage` pour afficher les données dynamiques.
- ✅ `useCategories()` utilisé dans le select du formulaire d'ajout de plat en admin.

---

## 25. ORDRE D'EXÉCUTION RECOMMANDÉ

1. Init Vite React TS + Tailwind + shadcn (tooltip, sonner)
2. `tailwind.config.ts` + `src/index.css` (fonts, tokens, animations)
3. **Exécuter le SQL Supabase** (tables + RLS + données initiales)
4. `src/lib/supabase.ts` + `src/lib/restaurantData.ts`
5. `src/hooks/useRestaurantData.ts` + `src/hooks/useKitchenRealtime.ts`
6. Générer toutes les images (`src/assets/`)
7. `src/data/menu.ts` (types + assets uniquement)
8. `src/context/CartContext.tsx`
9. Composants : `LoadingScreen`, `ScrollReveal`, `MarqueeBand`, `Footer`, `VerticalNav`, `CartDrawer`, `TableModal`
10. Pages : `HomePage`, `MenuPage`, `AboutPage`, `OrderPage`, `ContactPage`, `MenuScanPage`, `AdminPage`, `KitchenPage`, `NotFound`
11. `src/App.tsx` (Shell + Routes)
12. `index.html` (SEO)
13. Vérifier `tsc --noEmit`

Le résultat doit être strictement identique aux spécifications de design. Aucune liberté visuelle.

— FIN DU PROMPT —
