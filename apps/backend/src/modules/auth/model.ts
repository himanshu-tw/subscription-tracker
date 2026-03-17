import { t } from "elysia";

export namespace AuthModel {
  export const signInSchema = t.Object({
    email: t.String(),
    password: t.String(),
  });

  export const signInResSchema = t.Object({
    message: t.Literal("signed in successfully"),
  });

  export const signInFailResSchema = t.Object({
    message: t.Literal("Error while signing in"),
  });

  export type signInResSchema = typeof signInResSchema.static;
  export type signInFailResSchema = typeof signInFailResSchema.static;
  export type signInSchema = typeof signInSchema.static;

  export const signUpSchema = t.Object({
    username: t.String(),
    email: t.String(),
    password: t.String(),
  });

  export const signUpResSchema = t.Object({
    id: t.String(),
  });

  export const signUpFailResSchema = t.Object({
    message: t.Literal("Error while signing up"),
  });

  export type signUpSchema = typeof signUpSchema.static;
  export type signUpResSchema = typeof signUpResSchema.static;
  export type signUpFailResSchema = typeof signUpFailResSchema.static;
}
