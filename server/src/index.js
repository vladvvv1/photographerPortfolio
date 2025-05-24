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

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true , limit: '50mb'}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5500",
    credentials: true,
}));

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "../client/src/")));
app.use(express.static(path.join(__dirname, '../client/src/htmlforms/')));
app.use(express.static(path.join(__dirname, '../client/src/htmlforms/home')));
app.use(express.static(path.join(__dirname, "../client/src/htmlforms/about")));
app.use(express.static(path.join(__dirname, "../client/src/htmlforms/testimonials")));
app.use(express.static(path.join(__dirname, "../client/src/htmlforms/portfolio/couples")));
app.use(express.static(path.join(__dirname, "../client/src/htmlforms/portfolio/weddings")));
app.use(express.static(path.join(__dirname, "../client/src/htmlforms/portfolio/individual")));
app.use(express.static(path.join(__dirname, "../client/src/htmlforms/portfolio/family")));
app.use(express.static(path.join(__dirname, "../client/src/htmlforms/portfolio/pregnancy")));
app.use(express.static(path.join(__dirname, "../client/src/htmlforms/portfolio/foods")));
app.use(express.static(path.join(__dirname, "../client/src/htmlforms/portfolio/christening")));
app.use(express.static(path.join(__dirname, "../client/src/htmlforms/contact")));

app.use("/photos", photoRoutes);
app.use("/contacts", sendEmail);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/src/htmlforms/home/index.html'))
})
app.get("/about", (req,res) => {
    res.sendFile(path.join(__dirname, '../client/src/htmlforms/about/about.html'))
})
app.get("/testimonials", (req,res) => {
    res.sendFile(path.join(__dirname, '../client/src/htmlforms/testimonials/testimonials.html'))
})

app.get("/portfolio/:category", (req, res) => {
  const category = req.params.category;
  const filePath = path.join(__dirname, `../client/src/htmlforms/portfolio/${category}/${category}.html`);
  res.sendFile(filePath);
});

app.get("/contact", (req,res) => {
    res.sendFile(path.join(__dirname, '../client/src/htmlforms/contact/contact.html'))
})

app.get("/adminka", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/src/htmlforms/adminka/adminka.html"))
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/src/htmlforms/adminka/loginForm.html"))
})

app.listen(PORT, () => {
    console.log(`Server is running of host: ${PORT}`);
});
