import { createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator((data: string | undefined, ctx: any) => {
    const request = ctx.switchToHttp().getRequest();
    if(data){
        return request.user[data];
    }
    return request.user;
});