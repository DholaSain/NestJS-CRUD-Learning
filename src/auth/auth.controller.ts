import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "../auth/dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signup(@Body() requestBody: AuthDto) {
        console.log("====================================");
        console.log({requestBody});
        return this.authService.signup(requestBody);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() requestBody: AuthDto) { 
        return this.authService.signin(requestBody);
    }
}