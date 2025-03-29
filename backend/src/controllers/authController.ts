import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prismaClient"; // ✅ Correct relative path
 // ✅ Correct import


 // Ensure Prisma client is correctly imported

const JWT_SECRET = "your_secret_key"; // Store this securely (use environment variables)

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    res.status(201).json({ message: "User registered successfully", user });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("🔹 Extracted Email:", email);

    // 1️⃣ Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("✅ User Found:", user);

    // 2️⃣ Compare password (use bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Incorrect Password");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Generate JWT Token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    // 4️⃣ Successful login
    console.log("✅ Login Successful!");
    res.json({ message: "Login successful", token, user });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
