import  { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../entity/User";
import {Op} from "sequelize"; // Import your user model
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response): Promise<any> => {
    const {name, username, email, password} = req.body;

    try {
        // Check if user already exists by email or username
        const existingUser = await User.findOne({where: {email}});
        const existingUsername = await User.findOne({where: {username}});

        if (existingUser || existingUsername) {
            return res.status(400).json({message: "Email or Username already in use"});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Hardcoded OTP
        const otp = "123456"; // Hardcoded OTP for simplicity
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        // Create new user
        await User.create({
            name,
            username,
            email,
            passwordHash: hashedPassword,
            otpCode: otp,
            otpExpiry,
        });

        // Send OTP email (using hardcoded OTP)
        // await transporter.sendMail({
        //     from: process.env.EMAIL_USER, // sender address
        //     to: email, // recipient address
        //     subject: "Your OTP Code",
        //     text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
        // });

        res.status(200).json({message: "Registration successful. OTP sent to your email."});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
    res.status(200).json({message: 'Hello from Example API!'});
};

export const verifyOtp  = async (req: Request, res: Response): Promise<any> => {
    const { email, otp }: { email: string, otp: string } = req.body;

    try {
        // Check if the user exists by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if OTP exists and is correct
        if (user.otpCode !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check if OTP has expired
        const now = new Date();
        // @ts-ignore
        if (user.otpExpiry < now) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // OTP is valid and not expired, proceed with your logic (e.g., update user status, etc.)
        // Optionally, clear OTP from the database after successful verification
        user.otpCode = null;
        user.otpExpiry = null;
        user.isVerified = true;
        await user.save();

        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json({message: 'Hello from Example API!'});
};


export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password }: { email: string, password: string } = req.body;

    try {
        // Find the user by email or username (you can modify this to support both)
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username: email }] // Allow login via email or username
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare entered password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token (you can adjust the payload as needed)
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'your_secret_key', // Use a secret key for signing the token
            { expiresIn: '1h' } // Token expiry time (e.g., 1 hour)
        );

        // Send the response with the token
        return res.status(200).json({
            message: 'Login successful',
            token: token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
