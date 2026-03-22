export async function verifyJWT(jwt: any, token: string) {
  try {
    const payload = await jwt.verify(token);

    if (!payload) {
      throw new Error("Invalid token");
    }

    return payload;
  } catch {
    throw new Error("Invalid or expired token");
  }
}
