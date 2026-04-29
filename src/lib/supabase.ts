import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dbdoajntrhqqlakuitku.supabase.co";
const SUPABASE_KEY = "sb_publishable_Mrf5Z4kf8s2Dul3ktTmEVA_yVkrHuAZ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
