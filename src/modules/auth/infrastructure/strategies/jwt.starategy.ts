import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/shared/interface/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // Coba dari Authorization Header
          if (req.headers.authorization?.startsWith('Bearer ')) {
            return req.headers.authorization.split(' ')[1];
          }
          // Atau dari cookie
          return req.cookies?.access_token;
        },
      ]),
      secretOrKey: jwtSecret,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload) {
    return payload; // bisa tambahkan query ke DB jika perlu
  }
}
