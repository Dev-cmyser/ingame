import { IsEnum } from 'class-validator'

enum TypeAcEnum {
    FIZ = 'Fiz',
    UR = 'Ur',
}
export class TypeRequest {
    @IsEnum(TypeAcEnum)
    accountType: TypeAcEnum

    constructor(accountType: TypeAcEnum) {
        this.accountType = accountType
    }
}
