import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: string, pdfId: string) {
    return await this.prisma.$transaction(async (tx) => {
      // Step 1: Check if PDF exists
      const pdf = await tx.pDF.findUnique({
        where: { id: pdfId },
      });

      if (!pdf) {
        throw new NotFoundException('PDF not found');
      }

      // Step 2: Find or create the user's cart
      let cart = await tx.cart.findFirst({
        where: { userId },
      });

    //   console.log("userId: ", userId)

      if (!cart) {
        cart = await tx.cart.create({
          data: {
            userId,
          },
        });
      }

      // Step 3: Check for existing cart item
      const existingItem = await tx.cartItem.findUnique({
        where: {
          cartId_pdfId: {
            cartId: cart.id,
            pdfId,
          },
        },
      });

      if (existingItem) {
        throw new ConflictException('Item already in cart');
      }

      // Step 4: Add to cart
      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          pdfId,
        },
      });

      return { message: 'Item added to cart successfully' };
    });
  }

  async getCart(userId: string) {
  const cart = await this.prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          pdf: {
            select: {
              id: true,
              title: true,
              price: true,
              isFree: true,
              level: true,
              courseCode: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return {
      cartId: null,
      items: [],
    };
  }

  return {
    cartId: cart.id,
    items: cart.items,
  };
}

async removeFromCart(userId: string, cartItemId: string) {
  const cartItem = await this.prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: {
      cart: true, // So we can access userId from the related cart
    },
  });

  if (!cartItem) {
    throw new NotFoundException("Cart item not found");
  }

  if (cartItem.cart.userId !== userId) {
    throw new ForbiddenException("You are not allowed to remove this item");
  }

  await this.prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  return { message: "Item removed from cart" };
}

async checkoutCart(userId: string) {
  const cart = await this.prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          pdf: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new BadRequestException("Cart is empty");
  }

  const paidItems = cart.items.filter((item) => !item.pdf.isFree);
  if (paidItems.length === 0) {
    throw new BadRequestException("No paid items in cart to checkout");
  }

  const total = paidItems.reduce((sum, item) => sum + item.pdf.price, 0);
  const reference = `PAY-${uuidv4()}`;

  const [order, payment] = await this.prisma.$transaction([
    this.prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: paidItems.map((item) => ({
            pdfId: item.pdfId,
            price: item.pdf.price,
            quantity: 1,
          })),
        },
      },
    }),

    this.prisma.payment.create({
      data: {
        amount: total,
        currency: "NGN",
        reference,
        userId,
        status: "PENDING",
        gateway: "paystack",
      },
    }),
  ]);

  // ✅ Link order to payment
  await this.prisma.order.update({
    where: { id: order.id },
    data: { paymentId: payment.id },
  });

  // ✅ Link payment to order (this was missing)
  await this.prisma.payment.update({
    where: { id: payment.id },
    data: { orderId: order.id },
  });

  return {
    message: "Checkout initiated",
    paymentReference: reference,
    amount: total,
  };
}



}
