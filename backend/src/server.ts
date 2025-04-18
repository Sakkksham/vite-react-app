import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes); // ✅ Ensure correct path

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
