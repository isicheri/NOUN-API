import { Module } from "@nestjs/common";
import { NotificationService } from "./Notification.service";
import { PrismaService } from "src/prisma/prisma.service";
import { NotificationController } from "./Notification.controller";
import { UsersService } from "../users/users.service";



@Module({
    imports: [],
    controllers:[NotificationController],
    providers: [NotificationService,PrismaService,UsersService]
})
export class NotificationModule {}