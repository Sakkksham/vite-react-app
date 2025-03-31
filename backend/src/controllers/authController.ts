import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prismaClient"; // ✅ Correct Prisma client import

const JWT_SECRET = "your_secret_key"; // Use environment variables in production!

// ✅ User Registration
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body; // ✅ Extract `name`

    // 1️⃣ Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user in database
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }, // ✅ Save `name`
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ✅ User Login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2️⃣ Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Generate JWT Token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    // 4️⃣ Return token & user data
    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
