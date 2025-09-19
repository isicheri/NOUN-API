import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { OrdersService } from "./Orders.service";
import { JwtAuthGuard } from "../auth/guards/jwt-guard.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Role } from "src/common/enums/role.enum";
import { Roles } from "src/common/decorators/roles.decorator";
import { GetOrderQueryDto } from "./dto/get-order.dto";



@Controller("orders")
export class OrdersController {

    constructor(private orderService: OrdersService) {}


    @Get()
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN)
    async fetchOrders(
      @Query()  query: GetOrderQueryDto
    ) {
        return await this.orderService.fetchOrders(query)
    }

}