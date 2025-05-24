import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./config.js";

export const createSupabaseWithoutToken = createClient(SUPABASE_URL, SUPABASE_KEY);

export const createSupabaseWithToken = (accessToken) => {
  return createClient(
    SUPABASE_URL, 
    SUPABASE_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
};
