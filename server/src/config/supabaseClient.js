import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

// export const createSupabaseWithToken = (token) => {
//     createClient(SUPABASE_URL, SUPABASE_URL, {
//         global: {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             }
//         }
//     })
// }