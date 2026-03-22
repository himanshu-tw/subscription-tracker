import { prisma } from "db";

export abstract class SubscriptionService {
  static async createNewSubscriptions(
    userId: string,
    name: string,
    price: number,
    billingCycle: "yearly" | "monthly",
    renewalDate: Date,
    isActive: boolean,
  ): Promise<string> {
    const newSubscription = await prisma.subscriptions.create({
      data: {
        userId,
        name,
        price,
        billingCycle,
        renewalDate,
        isActive,
      },
    });

    return newSubscription.id.toString();
  }

  static async getAllSubscriptions(
    userId: string,
  ): Promise<{ success: boolean; message?: string; data?: any[] }> {
    const subscriptions = await prisma.subscriptions.findMany({
      where: {
        userId,
      },
      orderBy: {
        renewalDate: "asc",
      },
    });

    return {
      success: true,
      data: subscriptions,
    };
  }

  static async getOneSubscription(
    id: string,
    userId: string,
  ): Promise<{ success: boolean; data: any | null }> {
    const oneSubscription = await prisma.subscriptions.findFirst({
      where: {
        id,
        userId,
      },
      orderBy: {
        renewalDate: "asc",
      },
    });

    return {
      success: true,
      data: oneSubscription,
    };
  }

  static async updateSubscription(
    id: string,
    userId: string,
    updates: {
      name?: string;
      price?: number;
      billingCycle?: "monthly" | "yearly";
      renewalDate?: Date;
      isActive?: boolean;
    },
  ): Promise<{ success: boolean; message?: string; data?: any | null }> {
    const existing = await prisma.subscriptions.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing)
      return {
        success: false,
        message: "Subscription not found",
      };
    const data: any = {};

    if (updates.name !== undefined) data.name = updates.name;
    if (updates.price !== undefined) data.price = updates.price;

    if (updates.billingCycle !== undefined)
      data.billingCycle = updates.billingCycle;
    if (updates.renewalDate !== undefined)
      data.renewalDate = updates.renewalDate;
    if (updates.isActive !== undefined) data.isActive = updates.isActive;

    const updated = await prisma.subscriptions.update({
      where: { id },
      data,
    });

    return {
      success: true,
      data: updated,
    };
  }

  static async deleteSubscription(
    id: string,
    userId: string,
  ): Promise<{ message: string }> {
    const existing = await prisma.subscriptions.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing)
      return {
        message: "Subscription not found",
      };

    await prisma.subscriptions.delete({
      where: {
        id,
      },
    });

    return {
      message: "Successfully deleted subscription",
    };
  }
}
