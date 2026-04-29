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

-- Désactiver RLS sur toutes les tables (clé publishable côté client)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_orders DISABLE ROW LEVEL SECURITY;

-- Insérer la ligne de paramètres par défaut
INSERT INTO restaurant_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Catégories
INSERT INTO categories (name, position) VALUES
  ('FAST FOOD', 0),
  ('GRILLADES', 1),
  ('SHAWARMA & KAFTA', 2),
  ('BOISSONS & JUS', 3),
  ('GLACES & DESSERTS', 4)
ON CONFLICT DO NOTHING;

-- Plats (reproduire exactement le menu)
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
