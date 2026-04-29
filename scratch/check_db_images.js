
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dbdoajntrhqqlakuitku.supabase.co";
const SUPABASE_KEY = "sb_publishable_Mrf5Z4kf8s2Dul3ktTmEVA_yVkrHuAZ";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  const { data, error } = await supabase.from('menu_items').select('id, name, image');
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

check();
