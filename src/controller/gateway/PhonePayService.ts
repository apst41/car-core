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

interface PaymentRequest {
    merchantOrderId: string;
    amount: number;
    expireAfter: number;
    metaInfo: {
        udf1?: string;
        udf2?: string;
        udf3?: string;
        udf4?: string;
        udf5?: string;
    };
    paymentFlow: {
        type: string;
        message: string;
        merchantUrls: {
            redirectUrl: string;
        };
    };
}

interface PaymentResponse {
    orderId: string;
    state: string;
    expireAt: number;
    redirectUrl: string;
}

interface PaymentStatusResponse {
    orderId: string;
    state: string;
    amount: number;
    expireAt: number;
    metaInfo: {
        udf1?: string;
        udf2?: string;
        udf3?: string;
        udf4?: string;
        udf5?: string;
    };
    paymentDetails: Array<{
        paymentMode: string;
        transactionId: string;
        timestamp: number;
        amount: number;
        state: string;
    }>;
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

    async createPayment(paymentData: PaymentRequest, accessToken: string): Promise<PaymentResponse | null> {
        try {
            const { data } = await axios.post(
                `${this.config.baseUrl}/apis/pg-sandbox/checkout/v2/pay`,
                paymentData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `O-Bearer ${accessToken}`
                    }
                }
            );

            if (process.env.NODE_ENV === "development") {
                console.log("✅ PhonePe Payment Response:", data);
            }

            return data as PaymentResponse;
        } catch (error: any) {
            console.error("Error creating PhonePe payment:", error?.response?.data || error.message || error);
            return null;
        }
    }

    async getPaymentStatus(merchantOrderId: string, accessToken: string): Promise<PaymentStatusResponse | null> {
        try {
            const { data } = await axios.get(
                `${this.config.baseUrl}/apis/pg-sandbox/checkout/v2/order/${merchantOrderId}/status`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `O-Bearer ${accessToken}`
                    }
                }
            );

            if (process.env.NODE_ENV === "development") {
                console.log("✅ PhonePe Payment Status Response:", data);
            }

            return data as PaymentStatusResponse;
        } catch (error: any) {
            console.error("Error fetching PhonePe payment status:", error?.response?.data || error.message || error);
            return null;
        }
    }
}

// Export instance
const phonePeService = new PhonePeService();
export default phonePeService;
