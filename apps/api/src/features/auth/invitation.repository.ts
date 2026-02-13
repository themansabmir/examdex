import { PrismaClient, AdminTeamInvite } from "@prisma/client";

export interface IInvitationRepository {
  create(data: {
    email: string;
    role: string;
    token: string;
    expiresAt: Date;
    invitedBy: string;
  }): Promise<AdminTeamInvite>;
  findByToken(token: string): Promise<AdminTeamInvite | null>;
  findByEmail(email: string): Promise<AdminTeamInvite | null>;
  delete(id: string): Promise<void>;
  deleteByEmail(email: string): Promise<void>;
}

export class PrismaInvitationRepository implements IInvitationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: {
    email: string;
    role: string;
    token: string;
    expiresAt: Date;
    invitedBy: string;
  }): Promise<AdminTeamInvite> {
    return this.prisma.adminTeamInvite.create({
      data: {
        email: data.email,
        role: data.role as any,
        token: data.token,
        expiresAt: data.expiresAt,
        invitedBy: data.invitedBy,
      },
    });
  }

  async findByToken(token: string): Promise<AdminTeamInvite | null> {
    return this.prisma.adminTeamInvite.findUnique({
      where: { token },
    });
  }

  async findByEmail(email: string): Promise<AdminTeamInvite | null> {
    return this.prisma.adminTeamInvite.findUnique({
      where: { email },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.adminTeamInvite.delete({
      where: { id },
    });
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.prisma.adminTeamInvite.deleteMany({
      where: { email },
    });
  }
}
