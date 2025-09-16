import { Body, Controller, Post, UseGuards, Request, Get, Req, Delete, Param } from "@nestjs/common";
import { CartService } from "./Cart.service";
import { JwtAuthGuard } from "../auth/guards/jwt-guard.guard";
import { AuthRequest } from "../auth/types/auth-types";

@Controller("cart")
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Post("add")
  async addToCart(@Request() req:AuthRequest, @Body("pdfId") pdfId: string) {
    const userId = req.user.userId;
    return this.cartService.addToCart(userId, pdfId);
  }

  @Get("get")
async getUserCart(@Req() request:AuthRequest ) {
 let user = request.user;
  return this.cartService.getCart(user.userId);
}

@Delete('/:cartItemId')
async removeFromCart(
  @Param('cartItemId') cartItemId: string,
  @Req() request: AuthRequest
) {
  const userId = request.user.userId;
  return this.cartService.removeFromCart(userId, cartItemId);
}

@Post('/checkout')
async checkoutCart(
    @Req() request:AuthRequest
) {
 let user = request.user;
  return this.cartService.checkoutCart(user.userId);
}



}
