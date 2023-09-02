import { BadRequestException, PipeTransform } from "@nestjs/common";
import { BoardStatus } from "../board.model";

export class BoardStatusValidationPipe implements PipeTransform {
    readonly StatusOptions = [
        BoardStatus.PRIVATE,
        BoardStatus.PUBLIC,
    ]
    
    transform(value: any) {
        value = value.toUpperCase();

        if (this.isStatusValid(value) === false)
            throw new BadRequestException(`${value} is wrong status option`);
        
        return value;
    }
    
    isStatusValid(status: any) {
        const index = this.StatusOptions.indexOf(status);
        
        return index !== -1;
    }
}