import { Elysia } from "elysia";
import jwt from "@elysiajs/jwt";

import { SubscriptionService } from "./service";
import { SubscriptionModel } from "./model";
import { verifyJWT } from "../../lib/verifyJWT";

const auth = new Elysia().derive(async ({ cookie, status }) => {
  const token = cookie.auth?.value;

  if (!token) {
    return status(401, {
      message: "Unauthorized",
    });
  }

  try {
    const payload = await verifyJWT(jwt, token.toString());
    return {
      user: payload,
    };
  } catch {
    return status(401, {
      message: "Invalid token",
    });
  }
});

export const subscription = new Elysia({ prefix: "/subscription" })
  .use(auth)
  .post(
    "/",
    async (ctx) => {
      const { body, status } = ctx;

      const date = new Date(body.renewalDate);

      const res = await SubscriptionService.createNewSubscriptions(
        body.userId,
        body.name,
        body.price,
        body.billingCycle,
        date,
        body.isActive
      );

      if (!res) {
        return status(400, {
          message:
            "Error while creating a new subsciption. Please try again later.",
        });
      }

      return status(200, {
        id: res,
      });
    },
    {
      body: SubscriptionModel.createSubscriptionSchema,
      response: {
        200: SubscriptionModel.createSubscriptionResponseSchema,
        400: SubscriptionModel.createSubscriptionFailResponseSchema,
      },
    }
  )
  .get(
    "/",
    async (ctx: any) => {
      const { body, status } = ctx;

      const res = await SubscriptionService.getAllSubscriptions(
        body.userId
      );

      if (!res) {
        return status(400, {
          message:
            "Error while getting the subscriptions. Please try again after some time.",
        });
      }

      return {
        success: true,
        data: res,
      };
    },
    {
      body: SubscriptionModel.getAllSubscriptionSchema,
      response: {
        200: SubscriptionModel.getAllSubscriptionResponseSchema,
        400: SubscriptionModel.getAllSubscriptionFailResponseSchema,
      },
    }
  );
