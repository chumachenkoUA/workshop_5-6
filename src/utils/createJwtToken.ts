import './ensureSlowBuffer';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

import { JwtPayload } from '../types/JwtPayload';

export const createJwtToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET as Secret;
  const expiresIn = process.env.JWT_EXPIRATION as SignOptions['expiresIn'];

  return jwt.sign(payload, secret, {
    expiresIn,
  });
};
