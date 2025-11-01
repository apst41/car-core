import axios, { AxiosError } from "axios";

interface EmailResult {
    id: string;
    to: string[];
    created_at?: string;
}

interface SuccessResponse {
    success: true;
    message: string;
    result: EmailResult;
}

interface ErrorResponse {
    success: false;
    error: string;
}

export async function sendResendEmail(
    emailBody: string
): Promise<SuccessResponse | ErrorResponse> {
    try {
        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            throw new Error("RESEND_API_KEY environment variable is not set");
        }

        const EMAIL_SUBJECT = "GaadiWash Booking Notification";

        const response = await axios.post<EmailResult>(
            "https://api.resend.com/emails",
            {
                from: "booking@resend.dev",
                to: "gaadiwash77@gmail.com",
                subject: EMAIL_SUBJECT,
                text: emailBody,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${resendApiKey}`,
                },
            }
        );

        console.log("✅ Email sent successfully:", response.data);

        return {
            success: true,
            message: "Email notification sent successfully",
            result: response.data,
        };
    } catch (error) {
        const err = error as AxiosError;

        console.error("❌ Error in email sending:");
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        } else {
            console.error("Message:", err.message);
        }

        return {
            success: false,
            error: "Internal server error while sending email",
        };
    }
}
