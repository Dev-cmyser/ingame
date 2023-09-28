import { IsNotEmpty, IsString } from 'class-validator'

export class AuthPhone {
    @IsNotEmpty()
    @IsString()
    phone: string
    typeLogin: string

    constructor(phone: string, typeLogin: string) {
        this.phone = phone
        this.typeLogin = typeLogin
    }
}
