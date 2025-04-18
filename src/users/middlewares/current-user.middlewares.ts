import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: User;
  }
}
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = (req as any).session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);

      (req as any).currentUser = user;
    }
    next();
  }
}
