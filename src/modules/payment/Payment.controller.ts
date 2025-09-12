// payment.controller.ts
import { Controller, Headers, Post, Body } from "@nestjs/common";
import { PaymentService } from "./Payment.service";
import { Public } from "src/common/decorators/public.decorator";

@Controller("payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post("webhooks/paystack")
  @Public()
  async handleWebhook(@Headers() headers: any, @Body() body: any) {
    return this.paymentService.handlePaystackWebhook(headers, body);
  }
}
