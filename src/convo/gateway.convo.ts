// import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

// @WebSocketGateway(80, { namespace: 'convo' })
// export class ConvoGateway {

//     @WebSocketServer()
//     server: any;

//     @SubscribeMessage('message')
//     handleMessage(@MessageBody() message: string): void {
//         this.server.emit('message', message);
//     }
// }