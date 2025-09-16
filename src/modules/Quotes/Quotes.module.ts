import { Module } from "@nestjs/common";
import { QuotesService } from "./Quotes.service";
import { QuotesController } from "./Quotes.controller";
import { PrismaService } from "src/prisma/prisma.service";




@Module({
   imports: [],
   controllers: [QuotesController],
   providers: [QuotesService,PrismaService] 
})
export class QuotesModule {

}