import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "../auth/dto";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService {

    constructor(
        private prismaService: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) { }


    async signin(requestBody: AuthDto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: requestBody.email
            }
        });

        if (!user) throw new ForbiddenException('Who are you?');

        const pwMatch = argon.verify(user.hash, requestBody.password);

        if (!pwMatch) throw new ForbiddenException('Invalid credentials');


        return this.signToken(user.id, user.email);
    }

    async signup(requestBody: AuthDto) {
        try {
            const hash = await argon.hash(requestBody.password);
            const user = await this.prismaService.user.create({
                data: {
                    email: requestBody.email,
                    hash: hash,
                }
            });

            return this.signToken(user.id, user.email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const data = {
            sub: userId,
            email: email,
        };

        const accessToken = await this.jwt.signAsync(data, {
            expiresIn: this.config.get('JWT_EXPIRATION_TIME'),
            secret: this.config.get('JWT_SECRET'),
        });

        return {
            access_token: accessToken,
        };
    }

}