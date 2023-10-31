import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    @Get('me')
    getMe(@GetUser() user: any) {
        return user;
    }

    @Patch()
    editUser(@GetUser('id') userId: number, @Body() userDtl: EditUserDto) {
        return this.userService.editUser(userId, userDtl);
    }
}
