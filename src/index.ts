import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
import connectDB from "./db";

dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend
  credentials: true // si necesitas enviar cookies o tokens
}));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is ON");
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});