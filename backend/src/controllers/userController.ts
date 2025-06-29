import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";

// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.json({ success: true, message: "User deleted successfully" });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE PASSWORD
export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { userId, newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });
        res.json({ success: true, message: "Password updated successfully" });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
