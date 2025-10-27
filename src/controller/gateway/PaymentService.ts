import phonePeService from './PhonePayService';
import Payment from '../../entity/apps/Payment';

interface PaymentRequest {
    merchantOrderId: string;
    amount: number;
    userId: number;
    bookingId?: string;
    expireAfter?: number;
    metaInfo?: {
        udf1?: string;
        udf2?: string;
        udf3?: string;
        udf4?: string;
        udf5?: string;
    };
    redirectUrl: string;
    callbackUrl?: string;
    message?: string;
}

interface PaymentResult {
    success: boolean;
    data?: any;
    error?: string;
    orderId?: string;
    redirectUrl?: string;
}

interface PaymentStatusResult {
    success: boolean;
    data?: any;
    error?: string;
    orderId?: string;
    state?: string;
    amount?: number;
    paymentDetails?: any[];
}

class PaymentService {
    private accessToken: string | null = null;
    private tokenExpiry: number = 0;

    constructor() {
        // Initialize token on service creation
        this.initializeToken();
    }

    private async initializeToken(): Promise<void> {
        try {
            const tokenResponse = await phonePeService.getToken();
            if (tokenResponse) {
                this.accessToken = tokenResponse.access_token;
                this.tokenExpiry = tokenResponse.expires_at;
                console.log("✅ PaymentService: Token initialized successfully");
            } else {
                console.error("❌ PaymentService: Failed to initialize token");
            }
        } catch (error) {
            console.error("❌ PaymentService: Error initializing token:", error);
        }
    }

    private async ensureValidToken(): Promise<boolean> {
        const now = Date.now();
        
        // Check if token is expired or will expire in the next 5 minutes
        if (!this.accessToken || now >= (this.tokenExpiry - 300000)) {
            console.log("🔄 PaymentService: Token expired or expiring soon, refreshing...");
            await this.initializeToken();
        }

        return !!this.accessToken;
    }

    async createPayment(paymentData: PaymentRequest): Promise<PaymentResult> {
        try {
            const hasValidToken = await this.ensureValidToken();
            if (!hasValidToken) {
                return {
                    success: false,
                    error: "Unable to obtain valid authentication token"
                };
            }

            // Create payment record in database first
            const paymentRecord = await Payment.create({
                merchantOrderId: paymentData.merchantOrderId,
                userId: paymentData.userId,
                bookingId: paymentData.bookingId,
                amount: paymentData.amount,
                currency: "INR",
                status: "PENDING",
                redirectUrl: paymentData.redirectUrl,
                callbackUrl: paymentData.callbackUrl,
                metaInfo: paymentData.metaInfo || {},
                expireAt: new Date(Date.now() + (paymentData.expireAfter || 1200) * 1000)
            });

            const phonePePaymentData = {
                merchantOrderId: paymentData.merchantOrderId,
                amount: paymentData.amount,
                expireAfter: paymentData.expireAfter || 1200, // Default 20 minutes
                metaInfo: paymentData.metaInfo || {},
                paymentFlow: {
                    type: "PG_CHECKOUT",
                    message: paymentData.message || "Payment for your order",
                    merchantUrls: {
                        redirectUrl: paymentData.redirectUrl
                    }
                }
            };

            const response = await phonePeService.createPayment(phonePePaymentData, this.accessToken!);
            
            if (response) {
                // Update payment record with PhonePe response
                await paymentRecord.update({
                    phonePeOrderId: response.orderId,
                    status: "INITIATED",
                    paymentDetails: response
                });

                return {
                    success: true,
                    data: response,
                    orderId: response.orderId,
                    redirectUrl: response.redirectUrl
                };
            } else {
                // Update payment record with failure status
                await paymentRecord.update({
                    status: "FAILED",
                    errorMessage: "Failed to create payment with PhonePe"
                });

                return {
                    success: false,
                    error: "Failed to create payment"
                };
            }
        } catch (error: any) {
            console.error("❌ PaymentService: Error creating payment:", error);
            
            // Try to update payment record if it was created
            try {
                await Payment.update(
                    { 
                        status: "FAILED", 
                        errorMessage: error.message || "Unknown error occurred" 
                    },
                    { 
                        where: { merchantOrderId: paymentData.merchantOrderId } 
                    }
                );
            } catch (updateError) {
                console.error("❌ PaymentService: Error updating payment record:", updateError);
            }

            return {
                success: false,
                error: error.message || "Unknown error occurred"
            };
        }
    }

    async getPaymentStatus(merchantOrderId: string): Promise<PaymentStatusResult> {
        try {
            const hasValidToken = await this.ensureValidToken();
            if (!hasValidToken) {
                return {
                    success: false,
                    error: "Unable to obtain valid authentication token"
                };
            }

            const response = await phonePeService.getPaymentStatus(merchantOrderId, this.accessToken!);
            
            if (response) {
                // Update payment record in database with latest status
                await Payment.update(
                    {
                        status: response.state,
                        paymentDetails: response,
                        paymentMode: response.paymentDetails?.[0]?.paymentMode,
                        phonePeTransactionId: response.paymentDetails?.[0]?.transactionId
                    },
                    {
                        where: { merchantOrderId: merchantOrderId }
                    }
                );

                return {
                    success: true,
                    data: response,
                    orderId: response.orderId,
                    state: response.state,
                    amount: response.amount,
                    paymentDetails: response.paymentDetails
                };
            } else {
                return {
                    success: false,
                    error: "Failed to fetch payment status"
                };
            }
        } catch (error: any) {
            console.error("❌ PaymentService: Error fetching payment status:", error);
            return {
                success: false,
                error: error.message || "Unknown error occurred"
            };
        }
    }

    async processPayment(paymentData: PaymentRequest): Promise<PaymentResult> {
        console.log("🚀 PaymentService: Processing payment for order:", paymentData.merchantOrderId);
        
        const result = await this.createPayment(paymentData);
        
        if (result.success) {
            console.log("✅ PaymentService: Payment created successfully");
            console.log("   Order ID:", result.orderId);
            console.log("   Redirect URL:", result.redirectUrl);
        } else {
            console.error("❌ PaymentService: Payment creation failed:", result.error);
        }
        
        return result;
    }

    // Utility method to check if payment is successful
    isPaymentSuccessful(state: string): boolean {
        return state === "SUCCESS" || state === "COMPLETED";
    }

    // Utility method to check if payment is pending
    isPaymentPending(state: string): boolean {
        return state === "PENDING" || state === "INITIATED";
    }

    // Utility method to check if payment failed
    isPaymentFailed(state: string): boolean {
        return state === "FAILED" || state === "CANCELLED" || state === "EXPIRED";
    }

    // Database utility methods
    async getPaymentByMerchantOrderId(merchantOrderId: string): Promise<Payment | null> {
        try {
            return await Payment.findOne({
                where: { merchantOrderId }
            });
        } catch (error) {
            console.error("❌ PaymentService: Error fetching payment by merchant order ID:", error);
            return null;
        }
    }

    async getPaymentsByUserId(userId: number): Promise<Payment[]> {
        try {
            return await Payment.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']]
            });
        } catch (error) {
            console.error("❌ PaymentService: Error fetching payments by user ID:", error);
            return [];
        }
    }

    async getPaymentsByBookingId(bookingId: string): Promise<Payment[]> {
        try {
            return await Payment.findAll({
                where: { bookingId },
                order: [['createdAt', 'DESC']]
            });
        } catch (error) {
            console.error("❌ PaymentService: Error fetching payments by booking ID:", error);
            return [];
        }
    }

    async updatePaymentStatus(merchantOrderId: string, status: string, errorMessage?: string): Promise<boolean> {
        try {
            await Payment.update(
                { 
                    status,
                    ...(errorMessage && { errorMessage })
                },
                { 
                    where: { merchantOrderId } 
                }
            );
            return true;
        } catch (error) {
            console.error("❌ PaymentService: Error updating payment status:", error);
            return false;
        }
    }
}

// Export singleton instance
const paymentService = new PaymentService();
export default paymentService;
