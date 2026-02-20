import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { OtpData } from "./otp.types";

export interface IOtpRepository {
  save(userId: string, channel: string, otpData: OtpData): Promise<void>;
  get(userId: string, channel: string): Promise<OtpData | null>;
  verify(userId: string, channel: string, code: string): Promise<boolean>;
  delete(userId: string, channel: string): Promise<void>;
  incrementAttempts(userId: string, channel: string): Promise<void>;
  getRecentGenerationCount(userId: string, minutesAgo: number): Promise<number>;
}

export class PrismaOtpRepository implements IOtpRepository {
  constructor(private prisma: PrismaClient) { }

  async save(userId: string, channel: string, otpData: OtpData): Promise<void> {
    console.log("Mocking OTP save for:", userId, channel, otpData.code);
  }

  async get(userId: string, channel: string): Promise<OtpData | null> {
    return null;
  }

  async verify(userId: string, channel: string, code: string): Promise<boolean> {
    return true;
  }

  async delete(userId: string, channel: string): Promise<void> { }

  async incrementAttempts(userId: string, channel: string): Promise<void> { }

  async getRecentGenerationCount(userId: string, minutesAgo: number): Promise<number> {
    return 0;
  }
}

// In-memory implementation for testing
export class InMemoryOtpRepository implements IOtpRepository {
  private storage = new Map<string, { codeHash: string; data: OtpData }>();

  private getKey(userId: string, channel: string): string {
    return `${userId}:${channel}`;
  }

  async save(userId: string, channel: string, otpData: OtpData): Promise<void> {
    const codeHash = await bcrypt.hash(otpData.code, 10);
    this.storage.set(this.getKey(userId, channel), {
      codeHash,
      data: { ...otpData, code: "" }, // Don't store plain code
    });
  }

  async get(userId: string, channel: string): Promise<OtpData | null> {
    const record = this.storage.get(this.getKey(userId, channel));
    return record ? { ...record.data } : null;
  }

  async verify(userId: string, channel: string, code: string): Promise<boolean> {
    const record = this.storage.get(this.getKey(userId, channel));
    if (!record) return false;
    return bcrypt.compare(code, record.codeHash);
  }

  async delete(userId: string, channel: string): Promise<void> {
    this.storage.delete(this.getKey(userId, channel));
  }

  async incrementAttempts(userId: string, channel: string): Promise<void> {
    const key = this.getKey(userId, channel);
    const record = this.storage.get(key);
    if (record) {
      record.data.attempts += 1;
      this.storage.set(key, record);
    }
  }

  async getRecentGenerationCount(userId: string, minutesAgo: number): Promise<number> {
    const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000);
    let count = 0;

    for (const [key, record] of this.storage.entries()) {
      if (key.startsWith(`${userId}:`) && record.data.expiresAt >= cutoffTime) {
        count++;
      }
    }

    return count;
  }

  clear(): void {
    this.storage.clear();
  }
}
