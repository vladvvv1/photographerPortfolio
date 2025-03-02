import nodemailer from "nodemailer";
import { GMAIL_EMAIL, GMAIL_PASSWORD } from "./config.js";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: GMAIL_EMAIL,
        pass: GMAIL_PASSWORD,
    },
});
