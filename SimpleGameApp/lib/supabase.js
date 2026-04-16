import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://dboxdonmvtprflwzdkvy.supabase.co";
const supabaseAnonKey = "sb_publishable__JWl8AKJW9xClhE5ntnC_g_JGw-AzOJ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
