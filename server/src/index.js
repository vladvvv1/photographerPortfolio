import express from "express";
import { PORT } from "./config/config.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import photoRoutes from "./routes/photoRoute.js";
import sendEmail from "./routes/contactRoute.js";
import authRoutes from "./routes/authRoute.js";
import path from "path"

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5500",
    credentials: true,
}));

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '../client')));

app.use("/photos", photoRoutes);
app.use("/contacts", sendEmail);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running of host: ${PORT}`);
});
