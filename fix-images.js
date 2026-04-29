import { createClient } from '@supabase/supabase-js';
const supabase = createClient("https://dbdoajntrhqqlakuitku.supabase.co", "sb_publishable_Mrf5Z4kf8s2Dul3ktTmEVA_yVkrHuAZ");

async function fix() {
  const { data, error } = await supabase.from('menu_items').select('id, image');
  if (error) { console.error(error); return; }
  for (const item of data) {
    if (item.image && item.image.startsWith('/src/assets/')) {
      const newImage = item.image.replace('/src/assets/', '/assets/');
      await supabase.from('menu_items').update({ image: newImage }).eq('id', item.id);
      console.log(`Updated ${item.id} to ${newImage}`);
    }
  }
}
fix();
