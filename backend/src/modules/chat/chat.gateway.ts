import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UnauthorizedException } from '@nestjs/common'
import { ChatService } from './chat.service'

import { SendMessageDto } from './dto'

export interface AuthenticatedSocket extends Socket {
    data: {
        userId: number
    }
}

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly chatService: ChatService,
    ) {}

    afterInit(server: Server) {
        server.use(async (socket, next) => {
            const token = this.extractToken(socket)
            if (!token) return next(new UnauthorizedException('Unauthorized'))

            try {
                const payload = await this.jwtService.verifyAsync(token, {
                    secret: this.configService.get<string>('JWT_SECRET'),
                })

                socket.data.userId = payload.sub
                socket.join(this.userRoom(payload.sub))

                return next()
            } catch (e) {
                return next(new UnauthorizedException('Unauthorized'))
            }
        })
    }

    async handleConnection(client: AuthenticatedSocket) {
        client.emit('connected', { userId: client.data.userId })
    }

    handleDisconnect(_: AuthenticatedSocket) {}

    @SubscribeMessage('message:send')
    async onSendMessage(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() body: SendMessageDto) {
        try {
            if (!client.data.userId) throw new Error('Unauthorized')

            const saved = await this.chatService.createMessage(client.data.userId, body.id, body.content)

            this.server.to(this.userRoom(body.id)).emit('message:new', saved)
            client.emit('message:sent', saved)
        } catch (e) {
            client.emit('error', { message: e?.message || 'Failed to send message' })
        }
    }

    private extractToken(client: AuthenticatedSocket): string | undefined {
        return client.handshake.auth?.token
    }

    private userRoom(userid: number) {
        return `user:${userid}`
    }
}
