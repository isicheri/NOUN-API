import { Controller, Delete, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-guard.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";
import { NotificationService } from "./Notification.service";
import { AuthRequest } from "../auth/types/auth-types";
import { UsersService } from "../users/users.service";



@Controller("notifications")
export class NotificationController {

constructor(private notificationService:NotificationService,private usersService:UsersService) {}


@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(Role.ADMIN)
@Get("admin-notification")    
async getAdminNotificaton(
@Req() request:AuthRequest
) {
const adminId = request.user.userId; // or however you get the admin id
  const notifications = await this.usersService.getNotificationsForAdmin(adminId);
  return notifications; // return notifications array directly
}


@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(Role.ADMIN)
@Patch("/:notificationId/admin-mark-notification") 
async markNotificationReadStatus(
    @Param("notificationId") id: string,
    @Req() request:AuthRequest
) {
return await this.notificationService.markAsRead(id,request.user.userId);
}

@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(Role.ADMIN)
@Get("/:notificationId/admin-view-notification") 
async getAdmingNotificationById(
    @Param("notificationId") id: string,
    @Req() request:AuthRequest
) {
return await this.notificationService.getAdmingNotificationById(id,request.user.userId);
}


@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(Role.ADMIN)
@Delete("/:notificationId/admin-delete-notification")
async deleteNotification(@Param("notificationId") id: string) {
  return await this.notificationService.deleteNotification(id);
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Get('/admin-unread-count')
async getUnreadNotificationCount(@Req() req:AuthRequest) {
  const adminId = req.user.userId;
  return this.notificationService.getUnreadNotificationCountForAdmin(adminId);
}




} 