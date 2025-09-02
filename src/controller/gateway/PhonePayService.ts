import axios from "axios";

interface PhonePeConfig {
    clientId: string;
    clientSecret: string;
    clientVersion: string;
    baseUrl: string;
}

interface TokenResponse {
    access_token: string;
    encrypted_access_token: string;
    expires_in: number;
    issued_at: number;
    expires_at: number;
    session_expires_at: number;
    token_type: string;
}

class PhonePeService {
    private config: PhonePeConfig;

    constructor() {
        // Validate .env config
        if (!process.env.PHONEPE_CLIENT_ID ||
            !process.env.PHONEPE_CLIENT_SECRET ||
            !process.env.PHONEPE_CLIENT_VERSION ||
            !process.env.PHONEPE_API_URL) {
            throw new Error("PhonePe configuration missing in .env file");
        }

        this.config = {
            clientId: process.env.PHONEPE_CLIENT_ID,
            clientSecret: process.env.PHONEPE_CLIENT_SECRET,
            clientVersion: process.env.PHONEPE_CLIENT_VERSION,
            baseUrl: process.env.PHONEPE_API_URL,
        };

        // Axios logging for development
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

    async getToken(): Promise<TokenResponse | null> {
        try {
            const params = new URLSearchParams();
            params.append("client_id", this.config.clientId);
            params.append("client_secret", this.config.clientSecret);
            params.append("client_version", this.config.clientVersion);
            params.append("grant_type", "client_credentials");

            const { data } = await axios.post(`${this.config.baseUrl}/oauth/token`, params, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            if (process.env.NODE_ENV === "development") {
                console.log("✅ PhonePe Token Response:", data);
            }

            return data as TokenResponse;
        } catch (error: any) {
            console.error("Error fetching PhonePe token:", error?.response?.data || error.message || error);
            return null;
        }
    }
}

// Export instance
const phonePeService = new PhonePeService();
export default phonePeService;
