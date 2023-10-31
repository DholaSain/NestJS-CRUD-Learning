import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {

    }

    async editUser(id: number, userDtl: EditUserDto) {
        const user = await this.prismaService.user.update({
            where: { id: id },
            data: {
                ...userDtl,
            },
        });
        delete user.hash;
        return user;
    }
}
