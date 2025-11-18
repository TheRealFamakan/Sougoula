import jwt, {
  JwtPayload as JwtPayloadBase,
  Secret,
  SignOptions,
} from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload extends JwtPayloadBase {
  userId: string;
  email: string;
  role: string;
}

const secret: Secret = env.jwtSecret;
const signOptions: SignOptions = {
  expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
};

export const signToken = (payload: JwtPayload) => {
  return jwt.sign(payload, secret, signOptions);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret) as JwtPayload & {
    iat: number;
    exp: number;
  };
};

