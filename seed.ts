import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dbdoajntrhqqlakuitku.supabase.co";
const SUPABASE_KEY = "sb_publishable_Mrf5Z4kf8s2Dul3ktTmEVA_yVkrHuAZ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const categories = [
  { name: 'FAST FOOD', position: 0 },
  { name: 'GRILLADES', position: 1 },
  { name: 'SHAWARMA & KAFTA', position: 2 },
  { name: 'BOISSONS & JUS', position: 3 },
  { name: 'GLACES & DESSERTS', position: 4 }
];

const menuItems = [
  { id: 'burger-classic', name: 'Burger Classic', description: 'Boeuf haché, fromage, laitue, tomate, sauce maison', price: 2000, category: 'FAST FOOD', image: '/assets/burger.jpg', available: true },
  { id: 'burger-double', name: 'Double Burger', description: 'Double steak, double fromage, oignons caramélisés', price: 3000, category: 'FAST FOOD', image: '/assets/burger.jpg', available: true },
  { id: 'sandwich-poulet', name: 'Sandwich Poulet', description: 'Poulet grillé, crudités, sauce blanche dans pain frais', price: 1500, category: 'FAST FOOD', image: '/assets/hero-shawarma.jpg', available: true },
  { id: 'sandwich-viande', name: 'Sandwich Viande', description: 'Viande hachée épicée, cornichons, tomate, sauce piquante', price: 1500, category: 'FAST FOOD', image: '/assets/hero-shawarma.jpg', available: true },
  { id: 'poulet-grille', name: 'Poulet Grillé', description: 'Demi-poulet mariné aux épices, grillé au charbon', price: 3500, category: 'GRILLADES', image: '/assets/poulet-grille.jpg', available: true },
  { id: 'brochettes-boeuf', name: 'Brochettes de Boeuf', description: 'Morceaux tendres marinés, grillés à la braise', price: 2500, category: 'GRILLADES', image: '/assets/brochettes.jpg', available: true },
  { id: 'poisson-grille', name: 'Poisson Grillé', description: 'Poisson entier grillé, épices locales, accompagnement', price: 3000, category: 'GRILLADES', image: '/assets/brochettes.jpg', available: true },
  { id: 'brochettes-poulet', name: 'Brochettes de Poulet', description: 'Brochettes de poulet mariné, servies avec sauce', price: 2000, category: 'GRILLADES', image: '/assets/brochettes.jpg', available: true },
  { id: 'shawarma-poulet', name: 'Shawarma Poulet', description: 'Poulet mariné rôti à la broche, crudités, sauce tahin', price: 2000, category: 'SHAWARMA & KAFTA', image: '/assets/hero-shawarma.jpg', available: true },
  { id: 'shawarma-viande', name: 'Shawarma Viande', description: 'Viande de boeuf rôtie, oignons, persil, sauce libanaise', price: 2500, category: 'SHAWARMA & KAFTA', image: '/assets/hero-shawarma.jpg', available: true },
  { id: 'kafta-plat', name: 'Kafta en Plat', description: 'Viande hachée aux herbes, grillée, servie avec riz', price: 3000, category: 'SHAWARMA & KAFTA', image: '/assets/kafta.jpg', available: true },
  { id: 'kafta-sandwich', name: 'Kafta Sandwich', description: 'Kafta grillée dans pain libanais, tomate, oignon', price: 2000, category: 'SHAWARMA & KAFTA', image: '/assets/kafta.jpg', available: true },
  { id: 'jus-mangue', name: 'Jus de Mangue', description: 'Mangue fraîche pressée, sucré naturellement', price: 1000, category: 'BOISSONS & JUS', image: '/assets/jus-naturels.jpg', available: true },
  { id: 'jus-ananas', name: 'Jus d\'Ananas', description: 'Ananas frais pressé, rafraîchissant', price: 1000, category: 'BOISSONS & JUS', image: '/assets/jus-naturels.jpg', available: true },
  { id: 'milkshake', name: 'Milkshake', description: 'Lait glacé, vanille ou chocolat, onctueux', price: 1500, category: 'BOISSONS & JUS', image: '/assets/jus-naturels.jpg', available: true },
  { id: 'cocktail-fruits', name: 'Cocktail de Fruits', description: 'Mélange de fruits frais de saison', price: 1200, category: 'BOISSONS & JUS', image: '/assets/jus-naturels.jpg', available: true },
  { id: 'glace-1boule', name: 'Glace 1 Boule', description: 'Vanille, chocolat, fraise ou mangue', price: 500, category: 'GLACES & DESSERTS', image: '/assets/glaces.jpg', available: true },
  { id: 'glace-2boules', name: 'Glace 2 Boules', description: 'Choix de deux parfums, cornet ou coupe', price: 800, category: 'GLACES & DESSERTS', image: '/assets/glaces.jpg', available: true },
  { id: 'glace-sundae', name: 'Sundae', description: 'Glace, chantilly, sauce chocolat, noisettes', price: 1500, category: 'GLACES & DESSERTS', image: '/assets/glaces.jpg', available: true }
];

const settings = {
  id: 1,
  name: 'ETS AKIF',
  tagline: 'Fast Food · Lomé',
  whatsapp: '+22822225519',
  address: 'Boulevard du 13 Janvier, Béniglato, Lomé',
  hours: '08h00 – 04h00, tous les jours',
  instagram: 'https://instagram.com/akif.fastfood',
  sunday_note: 'Dimanche : horaires variables'
};

async function seed() {
  console.log('Seeding categories...');
  for (const cat of categories) {
    const { error } = await supabase.from('categories').upsert(cat, { onConflict: 'name' });
    if (error) console.error('Error inserting category:', cat.name, error.message);
  }

  console.log('Seeding menu items...');
  for (const item of menuItems) {
    const { error } = await supabase.from('menu_items').upsert(item, { onConflict: 'id' });
    if (error) console.error('Error inserting menu item:', item.name, error.message);
  }

  console.log('Seeding settings...');
  const { error: settingsError } = await supabase.from('restaurant_settings').upsert(settings, { onConflict: 'id' });
  if (settingsError) {
    console.error('Error inserting settings:', settingsError.message);
  }

  console.log('Done!');
}

seed();
