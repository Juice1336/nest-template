import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          // Extract JWT from cookie

          const authHeader = request?.headers['authorization'];

          if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
          }

          const cookieToken = request?.cookies['auth-cookie'];
          if (cookieToken) {
            return cookieToken;
          }

          // Extract JWT from Authorization header

          return null;
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: { email: payload.username },
    });
    if (!user?.blocked) {
      return { username: payload.username, role: payload.role, id: user?.id };
    } else {
      throw new UnauthorizedException();
    }
  }
}
