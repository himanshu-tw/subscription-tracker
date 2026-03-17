import { t } from "elysia";

export namespace SubscriptionModel {
  export const createSubscriptionSchema = t.Object({
    userId: t.String(),
    name: t.String(),
    price: t.Number(),
    billingCycle: t.Union([t.Literal("monthly"), t.Literal("yearly")]),
    renewalDate: t.Date(),
    isActive: t.Boolean(),
  });

  export const createSubscriptionResponseSchema = t.Object({
    id: t.String(),
  });

  export const createSubscriptionFailResponseSchema = t.Object({
    message: t.Literal(
      "Error while creating a new subsciption. Please try again later.",
    ),
  });

  export const getAllSubscriptionSchema = t.Object({
    userId: t.String(),
  });

  export const getAllSubscriptionResponseSchema = t.Object({
    success: t.Boolean(),
    data: t.Array(createSubscriptionSchema),
  });

  export const getAllSubscriptionFailResponseSchema = t.Object({
    message: t.Literal(
      "Error while getting the subscriptions. Please try again after some time.",
    ),
  });

  export const updateSubscriptionSchema = t.Object({});

  export const deleteSubscriptionSchema = t.Object({
    id: t.String(),
    userId: t.String(),
  });

  export const deleteSubscriptionResponseSchema = t.Object({
    message: t.Literal("Subscription deleted successfully."),
  });

  export const deleteSubscriptionFailResponseSchema = t.Object({
    message: t.Literal("Subscription not found."),
  });
}
