// import { supabase } from "../config/supabaseClient.js";

// export const loginUser = async (email, password) => {
//     if (!email || !password) {
//         return { error: "Email and password are required." };
//     }

//     const { data, error } = await supabase.auth.signInWithPassword({
//         email: email,
//         password: password,
//     });

//     if (error) {
//         return { error: error.message };
//     }

//     if (!data.session || !data.session.access_token) {
//         return { error: "Login failed. No session created." };
//     }

//     return { token: data.session.access_token };
// };

// export const logoutUser = async () => {
//     const { data, error } = await supabase.auth.signOut();

//     if (error) throw new Error(`Error while logging out: ${error.message}`);

//     return { message: "Successfully loged out." };
// };

// export const getUser = async () => {
//     const { data, error } = await supabase.auth.getUser();

//     if (error) {
//         throw new Error(
//             `Error while getting user information: ${error.message}`
//         );
//     }

//     if (!data) {
//         return { message: "No user data found." };
//     }

//     return { data };
// };

// export const refreshToken = async () => {
//     const { data, error } = await supabase.auth.refreshSession();

//     if (error)
//         throw new Error(`Error while refreshing session: ${error.message}`);

//     if (!data.session || !data.session.access_token) {
//         return { error: "Failed to refresh session. No valid session found." };
//     }

//     return {
//         message: "Session was successfully refreshed.",
//         token: data.session.access_token,
//     };
// };
