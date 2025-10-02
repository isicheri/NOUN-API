// payment.controller.ts
import {
  Controller,
  Headers,
  Post,
  Body,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PaymentService } from './Payment.service';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-guard.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { GetPaymentsDto } from './dto/get-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('webhooks/paystack')
  @Public()
  async handleWebhook(@Headers() headers: any, @Body() body: any) {
    return this.paymentService.handlePaystackWebhook(headers, body);
  }

  @Get('admin-get-payments')
  @UseGuards(JwtAuthGuard, RolesGuard) // optional if needed
  async getAdminPayments(@Query() query: GetPaymentsDto) {
    return this.paymentService.fetchPayments(query);
  }
}
