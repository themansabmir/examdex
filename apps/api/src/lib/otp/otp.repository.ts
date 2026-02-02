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
  constructor(private prisma: PrismaClient) {}

  /**
   * Save OTP with hashed code for security
   */
  async save(userId: string, channel: string, otpData: OtpData): Promise<void> {
    const codeHash = await bcrypt.hash(otpData.code, 10);

    await this.prisma.otpStorage.upsert({
      where: {
        userId_channel: {
          userId,
          channel,
        },
      },
      create: {
        userId,
        channel,
        codeHash,
        expiresAt: otpData.expiresAt,
        attempts: otpData.attempts,
        verified: otpData.verified,
      },
      update: {
        codeHash,
        expiresAt: otpData.expiresAt,
        attempts: otpData.attempts,
        verified: otpData.verified,
        createdAt: new Date(),
      },
    });
  }

  /**
   * Get OTP data (without the actual code for security)
   */
  async get(userId: string, channel: string): Promise<OtpData | null> {
    const record = await this.prisma.otpStorage.findUnique({
      where: {
        userId_channel: {
          userId,
          channel,
        },
      },
    });

    if (!record) return null;

    return {
      code: "", // Never return the actual code
      expiresAt: record.expiresAt,
      attempts: record.attempts,
      verified: record.verified,
    };
  }

  /**
   * Verify OTP code against stored hash
   */
  async verify(userId: string, channel: string, code: string): Promise<boolean> {
    const record = await this.prisma.otpStorage.findUnique({
      where: {
        userId_channel: {
          userId,
          channel,
        },
      },
    });

    if (!record) return false;

    return bcrypt.compare(code, record.codeHash);
  }

  /**
   * Delete OTP record
   */
  async delete(userId: string, channel: string): Promise<void> {
    await this.prisma.otpStorage.deleteMany({
      where: {
        userId,
        channel,
      },
    });
  }

  /**
   * Increment verification attempts
   */
  async incrementAttempts(userId: string, channel: string): Promise<void> {
    await this.prisma.otpStorage.updateMany({
      where: {
        userId,
        channel,
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Get count of OTP generation attempts in the last N minutes (rate limiting)
   */
  async getRecentGenerationCount(userId: string, minutesAgo: number): Promise<number> {
    const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000);

    const count = await this.prisma.otpStorage.count({
      where: {
        userId,
        createdAt: {
          gte: cutoffTime,
        },
      },
    });

    return count;
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
