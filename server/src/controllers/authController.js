import { supabase } from "../config/supabaseClient.js";

export const SignIn = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            console.error("Sign-in error:", error.message);
            return {
                success: false,
                error: {
                    type: "auth_error",
                    message: error.message,
                }
            };
        }

        console.log("User signed in successfully:", data);
        return (data.session.access_token);
    } catch (err) {
        console.error("Unexpected error:", err.message);
        return {
            success: false,
            error: {
                type: "unexpected_error",
                message: "An unexpected error occurred. Please try again later.",
                details: err.message
            }
        };
    }
};
