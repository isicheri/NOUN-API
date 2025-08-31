import { IsEmail, isString, IsString } from "class-validator";



export class EmailMessageBody {

    @IsEmail()
    @IsEmail()
    from: string;

    @IsEmail()
    @IsString()
    to: string;

    @IsString()
    messsage: string;

}