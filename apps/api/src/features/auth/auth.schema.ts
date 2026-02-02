import { z } from "zod";

export const sendOtpSchema = z.object({
    mobileNumber: z
        .string({ required_error: "Mobile number is required" })
        .min(10, "Mobile number must be at least 10 characters")
        .max(15, "Mobile number must be at most 15 characters"),
});

export const verifyOtpSchema = z.object({
    mobileNumber: z
        .string({ required_error: "Mobile number is required" })
        .min(10, "Mobile number must be at least 10 characters")
        .max(15, "Mobile number must be at most 15 characters"),
    code: z
        .string({ required_error: "OTP code is required" })
        .length(6, "OTP code must be 6 digits"),
});
