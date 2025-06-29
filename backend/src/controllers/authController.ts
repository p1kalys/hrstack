import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "hrBlogs";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, isAdmin = false } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: hashedPassword, isAdmin });

        res.status(201).json({ success: true, message: "User registered successfully", user: { name: user.name, email: user.email } });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log("No user found for", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch for", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "3h" });

        return res.json({ success: true, message: "Login successful", token, id: user._id });
    } catch (err: any) {
        console.error("Login error:", err.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

