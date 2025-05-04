import { supabase } from "../config/supabaseClient.js";
import { transporter } from "../config/nodemailer.js";
import {COULDFARE_SECRET_KEY, GMAIL_EMAIL, TELEGRAM_BOT_TOKEN, CHAT_ID } from "../config/config.js";
import axios from "axios";
import TelegramBot from "node-telegram-bot-api"
import fs from "fs"

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {polling: true});


const loadSubscribers = () => {
    try {
        const data = fs.readFileSync("./src/controllers/subscribers.json", "utf8");
        console.log(data);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading subsricbers: ", error);
        return [];
    }
}

const saveSubscribers = (subscribers) => {
    fs.writeFileSync("./src/controllers/subscribers.json", JSON.stringify(subscribers, null, 2));
}

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log(chatId);
    let subscribers = loadSubscribers();

    if (!subscribers.includes(chatId)) {
        subscribers.push(chatId);
        saveSubscribers(subscribers);
        bot.sendMessage(chatId, "You have subscribed successfully!");
    } else {
        bot.sendMessage(chatId, bot.sendMessage(chatId, "You have already been subscribed!"));
    }
})


export const getAllSubscribers = () => loadSubscribers();


export const sendContactMessage = async (req, res) => {
    const { name, email, message} = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const { data, error: dbError } = await supabase
        .from("contact_messages")
        .insert([{ name, email, message }]);

    if (dbError) {
        return res.status(400).json({
            error: "Error occurred while inserting data into Supabase:",
            dbError,
        });
    }

    // Prepare the email to notify the team
    const mailOptions = {
        from: email,
        replyTo: email,
        to: GMAIL_EMAIL,
        subject: "New Contact Message",
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        processNewContacts(); // Trigger any additional actions like adding to a contact list
        return res.status(200).json({ message: "Message sent successfully." });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send message." });
    }
};


const sendToTelegram = async (message) => {

    const subscribers = getAllSubscribers();

    for (const chatId of subscribers) {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const data = {
            chat_id: chatId,
            text: message,
        };

        try {
            await axios.post(url, data);
            console.log("Messages send to Telegram.");
        } catch (error) {
            console.error("Error while sending message to the Telegram: ", error);
        }
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
            You have recently received a new order. Please check the details.
            Name: ${contacts.name}
            Email: ${contacts.email}
            Message: ${contacts.message}
        `;
        await sendToTelegram(message);
    });
};

