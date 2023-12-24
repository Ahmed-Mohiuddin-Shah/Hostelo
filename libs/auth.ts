import { jwtVerify } from "jose";

export const getJWTSecret = () => {
  const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("Missing JWT_SECRET env var");
  }
  return jwtSecret;
};

export const verifyJWT = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, getJWTSecret());
    return payload;
  } catch (err) {
    console.error(err);
    return null;
  }
};
