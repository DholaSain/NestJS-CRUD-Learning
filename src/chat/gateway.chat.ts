import { UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { JwtGuard } from "src/guard";

// @UseGuards(JwtGuard)
@WebSocketGateway(80, { namespace: 'chat' })
export class ChatGateway {

    @WebSocketServer()
    server: any;

    // implement OnGatewayConnection handleConnection
    handleConnection(client: any, ...args: any[]) {
        console.log('connected', client);
        // Handle JWT authentication here
    const token = client.handshake.auth.token;

    // try {
    //   const payload = this.jwtService.verify(token);
    //   // You can now access the payload to identify the user
    //   console.log(payload);
    // } catch (error) {
    //   // Handle authentication failure
    //   console.error(error);
    //   client.disconnect(true);
    // }

    }

    handleDisconnect(client: Socket) {
        // Handle disconnection logic
      }


    // implement OnGatewayDisconnect handleDisconnect
    
    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string): void {
        this.server.emit('message', message);
    }
}