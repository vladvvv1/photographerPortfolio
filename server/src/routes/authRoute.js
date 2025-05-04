import express from "express";
import { supabase } from "../config/supabaseClient.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "No email or password provided." });
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            return res.status(401).json({ error: error.message });
        }

        res.cookie("access_token", data.session.access_token, {
            httpOnly: true,
            sameSite: "Strict",
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000,
            path: "/"
        });

        return res.status(200).json({ success: true, user: data.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/logout", async (req, res) => {
    try {
        const token = req.cookies.access_token;
        if (token) {
            await supabase.auth.signOut(token);
        }
        res.clearCookie("access_token");
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/check-token", async (req, res) => {
    try {
        const token = req.cookies.access_token;
        // console.log(token);
        if (!token) return res.status(401).json({ error: "No token provided." });

        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data.user) return res.status(401).json({ error: "Invalid token" });
        
        res.status(200).json({ message: "Valid token", user: data.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;