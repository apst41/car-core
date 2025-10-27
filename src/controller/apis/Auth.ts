import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../entity/apps/User";
import {myCache} from "../middleware/AuthMiddleware";
import otpService from "./OTPController";
import jwt from "jsonwebtoken";


export const registerOrSendOtp = async (req: Request, res: Response): Promise<any> => {
    const { name, username, email, password, mobileNo } = req.body;

    if (!mobileNo) {
        return res.status(400).json({ message: "Mobile number is required" });
    }

    // 📌 Static OTP config
    const staticOtpNumbers: number[] = [
        7017658313,
        9999999999,
        8920115341,
        9899741739,
        9958630516
    ];
    const STATIC_OTP = "123456";

    try {
        let user = await User.findOne({ where: { mobileNo } });

        // 🔹 Static OTP path
        if (staticOtpNumbers.includes(Number(mobileNo))) {
            const staticRequestId = `STATIC-${Date.now()}`;

            if (!user) {
                // Create static OTP user
                const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
                user = await User.create({
                    name,
                    username,
                    email,
                    passwordHash: hashedPassword,
                    mobileNo,
                    otpCode: STATIC_OTP,
                    otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
                    requestId: staticRequestId
                });
            } else {
                // Update existing user with static OTP
                await user.update({
                    otpCode: STATIC_OTP,
                    otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
                    requestId: staticRequestId
                });
            }

            return res.status(200).json({
                message: "Static OTP set successfully",
                requestId: staticRequestId,
                otp: STATIC_OTP // ⚠ Remove in production
            });
        }

        // 🔹 Normal flow: user exists → just send OTP
        if (user) {
            const sendResult = await otpService.sendOTP(mobileNo);
            if (!sendResult.success) {
                return res.status(500).json({ message: "Failed to send OTP" });
            }
            return res.status(200).json({
                message: "OTP sent successfully",
                requestId: sendResult.requestId
            });
        }

        // 🔹 New user creation checks
        if (email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }
        if (username) {
            const existingUsername = await User.findOne({ where: { username } });
            if (existingUsername) {
                return res.status(400).json({ message: "Username already in use" });
            }
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        // Create user (normal flow)
        user = await User.create({
            name,
            username,
            email,
            passwordHash: hashedPassword,
            mobileNo
        });

        // Send OTP (normal flow, handled inside sendOTP)
        const sendResult = await otpService.sendOTP(mobileNo);
        if (!sendResult.success) {
            return res.status(500).json({ message: "User registered but failed to send OTP" });
        }

        return res.status(200).json({
            message: "User registered & OTP sent successfully",
            requestId: sendResult.requestId
        });

    } catch (error) {
        console.error("Register/Send OTP Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
    const { requestId, otpCode } = req.body;
    const isNonProd = process.env.PROFILE !== "prod";

    if (isNonProd) {
        console.log("🔍 [VERIFY OTP] Incoming request:", { requestId, otpCode });
    }

    try {
        // 1️⃣ Find user by requestId
        const user = await User.findOne({ where: { requestId } });

        if (!user) {
            if (isNonProd) {
                console.warn(`⚠️ [VERIFY OTP] No user found for requestId: ${requestId}`);
            }
            return res.status(400).json({ success: false, message: "Invalid requestId" });
        }

        // 2️⃣ Check if OTP matches
        if (user.otpCode !== otpCode) {
            if (isNonProd) {
                console.warn(`⚠️ [VERIFY OTP] OTP mismatch for requestId: ${requestId}. Expected: ${user.otpCode}, Got: ${otpCode}`);
            }
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // 3️⃣ Check if OTP is expired
        if (!user.otpExpiry || user.otpExpiry < new Date()) {
            if (isNonProd) {
                console.warn(`⏳ [VERIFY OTP] OTP expired for requestId: ${requestId}. Expiry: ${user.otpExpiry}`);
            }
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        // Generate JWT token valid for 70 days
        const token = jwt.sign(
            { mobileNo: user.mobileNo },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "70d" }
        );

        const tokenExpiry = new Date(Date.now() + 70 * 24 * 60 * 60 * 1000); // 70 days in ms

        // 4️⃣ Update user: verified + clear OTP + set token + tokenExpiry + clear requestId
        await user.update({
            isVerified: true,
            otpCode: null,
            otpExpiry: null,
            requestId: null,
            token: token,
            tokenExpiry: tokenExpiry,
        });

        if (isNonProd) {
            console.log(`✅ [VERIFY OTP] User verified successfully. User ID: ${user.id}`);
        }

        // 5️⃣ Return success response with token and user id
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user_id: user.id,
        });

    } catch (error) {
        console.error("❌ [VERIFY OTP] Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


 export const fetchTokenDetails = async (req: Request, res: Response): Promise<any> => {

    const { token }: { token: string} = req.body;

    if(!token){
        return res.status(400).json({ message: 'Token is  required' });
    }

    const user = await User.findOne({
        where: {
            token: token
        }
    });

    if(!user){
        return res.status(400).json({ message: 'Invalid token' });
    }

    if(user.tokenExpiry && new Date() > user.tokenExpiry){
        return res.status(400).json({ message: 'Token expired' });
    }

    return res.status(200).json({ message: 'Token is valid' });

 }

export const logout = async (req: Request, res: Response): Promise<any> => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(200).json({ message: 'Token is required' });
    }

    try {
        const user = await User.findOne({ where: { token } });

        if (!user) {
            return res.status(200).json({ message: 'Invalid token or already logged out' });
        }

        myCache.del(token);
        await user.update({
            token: null,
            tokenExpiry: null,
        });

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
