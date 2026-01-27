import { PrismaClient } from "@prisma/client";

export interface Otp {
  id: string;
  mobileNumber: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface IOtpRepository {
  save(otp: Omit<Otp, "id" | "createdAt">): Promise<Otp>;
  findLatest(mobileNumber: string, code: string): Promise<Otp | null>;
  deleteByMobileNumber(mobileNumber: string): Promise<void>;
}

export class PrismaOtpRepository implements IOtpRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(otp: Omit<Otp, "id" | "createdAt">): Promise<Otp> {
    return await this.prisma.otp.create({
      data: {
        mobileNumber: otp.mobileNumber,
        code: otp.code,
        expiresAt: otp.expiresAt,
      },
    });
  }

  async findLatest(mobileNumber: string, code: string): Promise<Otp | null> {
    return await this.prisma.otp.findFirst({
      where: {
        mobileNumber,
        code,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async deleteByMobileNumber(mobileNumber: string): Promise<void> {
    await this.prisma.otp.deleteMany({
      where: { mobileNumber },
    });
  }
}

export class InMemoryOtpRepository implements IOtpRepository {
  private otps: Otp[] = [];

  async save(otp: Omit<Otp, "id" | "createdAt">): Promise<Otp> {
    const newOtp: Otp = {
      ...otp,
      id: Math.random().toString(),
      createdAt: new Date(),
    };
    this.otps.push(newOtp);
    return newOtp;
  }

  async findLatest(mobileNumber: string, code: string): Promise<Otp | null> {
    const validOtps = this.otps.filter(
      (o) => o.mobileNumber === mobileNumber && o.code === code && o.expiresAt > new Date()
    );
    if (validOtps.length === 0) return null;
    // Return the latest one
    return validOtps.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  }

  async deleteByMobileNumber(mobileNumber: string): Promise<void> {
    this.otps = this.otps.filter((o) => o.mobileNumber !== mobileNumber);
  }
}
