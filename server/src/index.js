import express from "express";
import { PORT } from "./config/config.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import photoRoutes from "./routes/photoRoute.js";
import sendEmail from "./routes/contactRoute.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/photos", photoRoutes);
app.use("/contacts", sendEmail);

app.listen(PORT, () => {
    console.log(`Server is running of host: ${PORT}`);
});
