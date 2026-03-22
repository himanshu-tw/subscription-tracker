import { Cookie, Elysia } from "elysia";
import { AuthModel } from "./model";
import { AuthService } from "./service";
import jwt from "@elysiajs/jwt";

export const app = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    }),
  )
  .post(
    "/sign-up",
    async ({ body, status }) => {
      try {
        const userId = await AuthService.signup(
          body.username,
          body.email,
          body.password,
        );
        return {
          id: userId,
        };
      } catch (e) {
        console.log(e);
        return status(400, {
          message: "Error while signing up",
        });
      }
    },
    {
      body: AuthModel.signUpSchema,
      response: {
        200: AuthModel.signUpResSchema,
        400: AuthModel.signUpFailResSchema,
      },
    },
  )
  .post(
    "/sign-in",
    async ({ jwt, body, status, cookie: { auth } }) => {
      const { correctCreds, userId } = await AuthService.signin(
        body.email,
        body.password,
      );
      if (correctCreds && userId) {
        const token = await jwt.sign({ userId });

        if (!auth) {
          auth = new Cookie("auth", {});
        }

        auth.set({
          value: token,
          httpOnly: true,
          maxAge: 7 * 86400,
          secure: true,
          sameSite: "strict"
        });

        return {
          message: "signed in successfully",
        };
      } else {
        return status(403, {
          message: "Error while signing in",
        });
      }
    },
    {
      body: AuthModel.signInSchema,
      response: {
        200: AuthModel.signInResSchema,
        403: AuthModel.signInFailResSchema,
      },
    },
  );
