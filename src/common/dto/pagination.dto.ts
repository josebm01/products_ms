import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto {

    @IsPositive()
    @IsOptional()
    @Type(() => Number) // String a número
    page?: number = 1;

    @IsPositive()
    @IsOptional()
    @Type(() => Number) // String a número
    limit?: number = 10;
}
