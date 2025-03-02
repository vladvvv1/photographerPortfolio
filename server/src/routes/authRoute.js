// import express from "express";
// import {
//     loginUser,
//     logoutUser,
//     getUser,
//     refreshToken,
// } from "../controllers/authController.js";
// import authMiddleware from "../middlewares/authMiddleware.js";

// const router = express.Router();

// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             console.error("No email or password provided.");
//             return res
//                 .status(400)
//                 .json({ error: "No email or password provided." });
//         }

//         const loginAccount = await loginUser(email, password);

//         res.json(loginAccount);
//     } catch (error) {
//         console.error("Login error:", error);
//         return res.status(500).json({ error: "Internal server error." });
//     }
// });

// router.get("/profile", (req, res) => {
//     res.json({ user: req.user });
// });

// router.get("/getSession", async (req, res) => {
//     try {
//         const session = await getSession();
//         res.json({ session });
//     } catch (error) {
//         res.status(500).json({ error: "Failed to get session." });
//     }
// });

// export default router;
