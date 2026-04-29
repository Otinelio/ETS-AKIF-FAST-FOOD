import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dbdoajntrhqqlakuitku.supabase.co";
const SUPABASE_KEY = "sb_publishable_Mrf5Z4kf8s2Dul3ktTmEVA_yVkrHuAZ";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. Rename logo.png to akif-logo.png
if (fs.existsSync('src/assets/img/logo.png')) {
  fs.copyFileSync('src/assets/img/logo.png', 'src/assets/akif-logo.png');
  fs.copyFileSync('src/assets/img/logo.png', 'public/assets/akif-logo.png');
}

// 2. Copy all images to public/assets/img
if (!fs.existsSync('public/assets/img')) {
  fs.mkdirSync('public/assets/img', { recursive: true });
}
const files = fs.readdirSync('src/assets/img').filter(f => f.endsWith('.png') && f !== 'logo.png');
for (const file of files) {
  fs.copyFileSync(`src/assets/img/${file}`, `public/assets/img/${file}`);
}

// 3. Update DB menu_items
async function updateDb() {
  const { data, error } = await supabase.from('menu_items').select('id');
  if (error) { console.error("DB error:", error); return; }
  
  let i = 0;
  for (const item of data) {
    if (i < files.length) {
      const imgPath = `/assets/img/${files[i]}`;
      await supabase.from('menu_items').update({ image: imgPath }).eq('id', item.id);
      i++;
    }
  }
  console.log("DB updated!");
}

updateDb();
