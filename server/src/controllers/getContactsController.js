import { supabase } from "../config/supabaseClient.js";
import { transporter } from "../config/nodemailer.js";
import { GMAIL_EMAIL, TELEGRAM_BOT_TOKEN, CHAT_ID } from "../config/config.js";
import axios from "axios";

export const sendContactMessage = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const { data, error: dbError } = await supabase
        .from("contact_messages")
        .insert([{ name, email, message }]);

    if (dbError) {
        return res.status(400).json({
            error: "Error occured while inserting data to the supabase:",
            dbError,
        });
    }

    const mailOptions = {
        from: email,
        replyTo: email,
        to: GMAIL_EMAIL,
        subject: "New Contact Message",
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        processNewContacts();
        return res.status(200).json({ message: "Message sent successfully." });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to sent message." });
    }
};

const sendToTelegram = async (message, req, res) => {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const data = {
        chat_id: CHAT_ID,
        text: message,
    };

    try {
        await axios.post(url, data);
        console.log("Messages send to Telegram.");
    } catch (error) {
        console.error("Error while sending message to the Telegram: ", error);
    }
};

const getNewContacts = async () => {
    const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);
    if (error) {
        console.error("Error while getting data from supabase:", error);
        return [];
    }

    return data;
};

export const processNewContacts = async () => {
    const contacts = await getNewContacts();

    if (!contacts || contacts.length === 0) {
        console.log("There's no new contacts");
        return;
    }

    contacts.forEach(async (contacts) => {
        const message = `
            New message:
            Name: ${contacts.name}
            Email: ${contacts.email}
            Message: ${contacts.message}
        `;
        await sendToTelegram(message);
    });
};

function toggleMenu() {
    document.getElementById("nav-links").classList.toggle("active");
}
