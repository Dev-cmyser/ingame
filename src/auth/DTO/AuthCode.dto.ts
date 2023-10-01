export class AuthCode {
    operationId: string
    code: string

    constructor(operationId: string, code: string) {
        this.operationId = operationId
        this.code = code
    }
}
