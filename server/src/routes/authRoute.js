import express from "express";
import { createSupabaseWithToken } from "../config/supabaseClient.js";

const router = express.Router();

// LOGIN ROUTE
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "No email or password provided." });
        }

        // Supabase instance without token needed for login
        const supabase = createSupabaseWithToken(null);

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            return res.status(401).json({ error: error.message });
        }

        const accessToken = data.session.access_token;

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            sameSite: "Lax",
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000, // 1 hour
            path: "/"
        });
        
        return res.status(200).json({ success: true, user: data.user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// LOGOUT ROUTE
router.post("/logout", async (req, res) => {
    try {
        const token = req.cookies.access_token;
        if (token) {
            const supabase = createSupabaseWithToken(token);
            await supabase.auth.signOut(); // no token argument needed here
        }
        res.clearCookie("access_token");
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// CHECK TOKEN ROUTE
router.get("/check-token", async (req, res) => {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({ error: "No token provided." });
        }

        const supabase = createSupabaseWithToken(token);
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        res.status(200).json({ message: "Valid token", user: data.user });
    } catch (error) {
        console.error("Check token error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
