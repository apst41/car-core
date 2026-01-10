import { Request, Response } from 'express';
import paymentService from '../gateway/PaymentService';
import phonePeService from '../gateway/PhonePayService';
import {randomBytes} from "node:crypto";

import PhonePeOrder from "../../entity/apps/PhonePeOrder";

interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        [key: string]: any;
    };
}

export const generateMerchantOrderId = (): string => {
    // Example: ORD-<random-10-chars>
    const random = randomBytes(5).toString("hex");
    return `ORD-${Date.now()}-${random}`;
};

export const createPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }

        const  merchantOrderId = generateMerchantOrderId();

        const expireAfter = 1800

        const {
            amount,
            bookingId,
        } = req.body;

        // Validate required fields
        if (!merchantOrderId || !amount || !bookingId) {
            res.status(400).json({
                success: false,
                message: "Missing required fields: merchantOrderId, amount, redirectUrl,bookingId"
            });
            return;
        }

        if (amount <= 0) {
            res.status(400).json({
                success: false,
                message: "Amount must be greater than 0"
            });
            return;
        }

        // Get token first
        const tokenResponse = await phonePeService.getToken();
        if (!tokenResponse) {
            res.status(500).json({
                success: false,
                message: "Failed to obtain authentication token"
            });
            return;
        }

        const paymentData = {
            merchantOrderId,
            amount,
            userId,
            bookingId,
            expireAfter
        };

        const result = await paymentService.createPayment(paymentData);

        if (result.success) {
            res.status(201).json({
                success: true,
                message: "Payment created successfully",
                data: {
                    orderId: result.orderId,
                    redirectUrl: result.redirectUrl,
                    merchantOrderId: merchantOrderId,
                    amount: amount,
                    status: "INITIATED"
                }
            });
        } else {
            res.status(500).json({
                success: false,
                message: result.error || "Failed to create payment"
            });
        }
    } catch (error: any) {
        console.error("❌ PaymentController: Error creating payment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getPaymentStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }

        const { merchantOrderId } = req.params;

        if (!merchantOrderId) {
            res.status(400).json({
                success: false,
                message: "Merchant order ID is required"
            });
            return;
        }

        // Get token first
        const tokenResponse = await phonePeService.getToken();
        if (!tokenResponse) {
            res.status(500).json({
                success: false,
                message: "Failed to obtain authentication token"
            });
            return;
        }

        const result = await paymentService.getPaymentStatus(merchantOrderId);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: "Payment status retrieved successfully",
                data: {
                    orderId: result.orderId,
                    state: result.state,
                    amount: result.amount,
                    paymentDetails: result.paymentDetails,
                    merchantOrderId: merchantOrderId
                }
            });
        } else {
            res.status(500).json({
                success: false,
                message: result.error || "Failed to get payment status"
            });
        }
    } catch (error: any) {
        console.error("❌ PaymentController: Error getting payment status:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getPaymentDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }

        const { merchantOrderId } = req.params;

        if (!merchantOrderId) {
            res.status(400).json({
                success: false,
                message: "Merchant order ID is required"
            });
            return;
        }

        const payment = await paymentService.getPaymentByMerchantOrderId(merchantOrderId);

        if (!payment) {
            res.status(404).json({
                success: false,
                message: "Payment not found"
            });
            return;
        }

        if (payment.userId !== userId) {
            res.status(403).json({
                success: false,
                message: "Access denied. Payment does not belong to this user"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Payment details retrieved successfully",
            data: {
                id: payment.id,
                merchantOrderId: payment.merchantOrderId,
                phonePeOrderId: payment.phonePeOrderId,
                userId: payment.userId,
                bookingId: payment.bookingId,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                paymentMode: payment.paymentMode,
                transactionId: payment.transactionId,
                phonePeTransactionId: payment.phonePeTransactionId,
                redirectUrl: payment.redirectUrl,
                callbackUrl: payment.callbackUrl,
                expireAt: payment.expireAt,
                metaInfo: payment.metaInfo,
                paymentDetails: payment.paymentDetails,
                errorMessage: payment.errorMessage,
                createdAt: payment.createdAt,
                updatedAt: payment.updatedAt
            }
        });
    } catch (error: any) {
        console.error("❌ PaymentController: Error getting payment details:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getUserPayments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }

        const payments = await paymentService.getPaymentsByUserId(userId);

        res.status(200).json({
            success: true,
            message: "User payments retrieved successfully",
            data: payments.map(payment => ({
                id: payment.id,
                merchantOrderId: payment.merchantOrderId,
                phonePeOrderId: payment.phonePeOrderId,
                bookingId: payment.bookingId,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                paymentMode: payment.paymentMode,
                createdAt: payment.createdAt,
                updatedAt: payment.updatedAt
            }))
        });
    } catch (error: any) {
        console.error("❌ PaymentController: Error getting user payments:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getToken = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {

    const token = await phonePeService.getToken();

    if (!token) {
        res.status(500).json({ message: "Unable to fetch token" });
        return;
    }

    res.status(200).json(token);
};



export const createPhonePeSdkOrder = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        const { amount} = req.body;

        if (!amount) {
            res.status(400).json({
                success: false,
                message: "amount and expireAfter are required",
            });
            return;
        }

        // 1️⃣ Generate merchantOrderId at runtime
        const merchantOrderId = generateMerchantOrderId();

        // 🔒 Hardcode expireAt (milliseconds)
        const expireAfter = Date.now() + 12 * 1000;

        // 2️⃣ Save initial order in DB
        const order = await PhonePeOrder.create({
            merchantOrderId,
            amount,
            expireAfter,          // ✅ hardcoded here
            state: "CREATED",
        });

        // 3️⃣ Generate PhonePe access token
        const token = await phonePeService.getToken();
        if (!token) {
            res.status(500).json({
                success: false,
                message: "Failed to generate PhonePe token",
            });
            return;
        }

        // 4️⃣ Create PhonePe SDK Order
        const sdkOrder = await phonePeService.createSdkOrder(
            {
                merchantOrderId,
                amount,
                expireAfter,
                paymentFlow: {
                    type: "PG_CHECKOUT",
                },
            },
            token.access_token
        );

        if (!sdkOrder) {
            res.status(500).json({
                success: false,
                message: "Failed to create PhonePe SDK order",
            });
            return;
        }

        // 5️⃣ Update DB (DO NOT override expireAt)
        await order.update({
            orderId: sdkOrder.orderId,
            redirectUrl: sdkOrder.redirectUrl,
            state: sdkOrder.state,
        });

        res.status(201).json({
            success: true,
            message: "PhonePe SDK order created successfully",
            data: {
                merchantOrderId,
                phonePeOrderId: sdkOrder.orderId,
                redirectUrl: sdkOrder.redirectUrl,
                expireAfter,          // ✅ hardcoded value returned
                state: sdkOrder.state,
                token:sdkOrder.token
            },
        });
    } catch (error: any) {
        console.error("❌ PaymentController: Error creating PhonePe SDK order:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

