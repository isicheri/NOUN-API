// pipes/parse-enum.pipe.ts
import { PipeTransform, BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class ParseEnumPipe<T> implements PipeTransform {
  constructor(private readonly enumType: T, private readonly fieldName = "value") {}

  transform(value: any): T[keyof T] {
    const enumValues = Object.values(this.enumType as object); // ✅ Correct usage

    if (!enumValues.includes(value)) {
      throw new BadRequestException(
        `${this.fieldName} must be a valid enum value: ${enumValues.join(", ")}`
      );
    }

    return value;
  }
}
