import { Request, Response } from "express";
import axios from "axios";
import User from "../../entity/apps/User";

interface OTPConfig {
    apiKey: string;
    baseUrl: string;
}

interface OTPResponse {
    success: boolean;
    message: string;
    otp?: string;
    requestId?: string;
}

class OTPService {
    private config: OTPConfig;

    constructor() {
        this.config = {
            apiKey: process.env.SMS_API_KEY || "00fd5864-72a9-11f0-a562-0200cd936042",
            baseUrl: process.env.SMS_API_URL || "https://2factor.in/API/V1"
        };

        // Axios logging for dev
        if (process.env.NODE_ENV === "development") {
            axios.interceptors.request.use(req => {
                console.log(`📤 [AXIOS] ${req.method?.toUpperCase()} ${req.url}`);
                if (req.data) console.log("   Data:", req.data);
                return req;
            });
            axios.interceptors.response.use(res => {
                console.log(`📥 [AXIOS] ${res.status} ${res.config.url}`);
                console.log("   Response:", res.data);
                return res;
            }, err => {
                console.error(`❌ [AXIOS ERROR] ${err.config?.url}`);
                console.error(err.response?.data || err.message);
                return Promise.reject(err);
            });
        }
    }

    private generateOTP(length: number = 6): string {
        const digits = "0123456789";
        let otp = "";
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * digits.length)];
        }
        return otp;
    }

    async sendOTP(phoneNumber: string, otpLength: number = 6): Promise<OTPResponse> {
        try {
            const user = await User.findOne({ where: { mobileNo: phoneNumber } });
            if (!user) {
                return { success: false, message: "User not found" };
            }

            const otp = this.generateOTP(otpLength);
            const expiry = new Date(Date.now() + 10 * 60 * 1000);

            const smsResponse = await this.sendSMS(phoneNumber, otp);

            if (smsResponse?.Status === "Success") {
                await user.update({
                    otpCode: otp,
                    otpExpiry: expiry,
                    requestId: smsResponse.Details
                });

                if (process.env.NODE_ENV === "development") {
                    console.log(`✅ OTP for ${phoneNumber}: ${otp} (Request ID: ${smsResponse.Details})`);
                }

                return {
                    success: true,
                    message: "OTP sent successfully",
                    otp, // Keep for dev
                    requestId: smsResponse.Details
                };
            }

            return { success: false, message: "Failed to send OTP" };

        } catch (error: any) {
            console.error("Error sending OTP:", error?.response?.data || error.message || error);
            return { success: false, message: "Failed to send OTP" };
        }
    }

    private async sendSMS(mobile: string, otp: string): Promise<any> {
        try {
            const url = `${this.config.baseUrl}/${this.config.apiKey}/SMS/${mobile}/${otp}/AutoreadLogin
            `;
            const { data } = await axios.get(url, {
                headers: { Authorization: `Bearer ${process.env.AUTH_TOKEN || ""}` }
            });
            return data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("SMS API Error:", err.response?.data || err.message);
            } else {
                console.error("Unexpected Error:", err);
            }
            return { success: false };
        }
    }

    async verifyOTP(phoneNumber: string, otp: string): Promise<boolean> {
        const user = await User.findOne({ where: { mobileNo: phoneNumber } });
        if (!user || !user.otpCode || !user.otpExpiry) return false;

        if (new Date() > user.otpExpiry) return false;
        if (user.otpCode !== otp) return false;

        await user.update({ isVerified: true, otpCode: null, otpExpiry: null });
        return true;
    }

    async resendOTP(phoneNumber: string, otpLength: number = 6): Promise<OTPResponse> {
        let user = await User.findOne({ where: { mobileNo: phoneNumber } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        let otp = user.otpCode;
        if (!otp || !user.otpExpiry || new Date() > user.otpExpiry) {
            otp = this.generateOTP(otpLength);
            const expiry = new Date(Date.now() + 10 * 60 * 1000);
            await user.update({ otpCode: otp, otpExpiry: expiry });
        }

        const response = await this.sendSMS(phoneNumber, otp);
        if (response.Status === "Success") {
            return { success: true, message: "OTP resent successfully", otp, requestId: response.Details };
        }
        return { success: false, message: "Failed to resend OTP" };
    }
}

// ✅ Create an instance so default import works
const otpService = new OTPService();
export default otpService;
