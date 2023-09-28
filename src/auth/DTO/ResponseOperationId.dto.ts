export class ResponseOperationId {
    operationId: string
    code: string

    constructor(operation: string, code: string) {
        this.operationId = operation
        this.code = code
    }
}
