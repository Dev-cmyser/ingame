import { FieldError } from './FieldEror.dto'

export class Meta {
    message: string
    fieldErrors: FieldError[]

    constructor(message = 'successeful') {
        this.message = message
    }
}
