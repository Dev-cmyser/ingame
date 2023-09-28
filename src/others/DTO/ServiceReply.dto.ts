import { Meta } from './Meta.dto'

export class ServiceReply {
    data: any
    status: number
    meta: Meta

    constructor(data: any, status: number, message = 'successeful') {
        this.data = data
        this.status = status
        this.meta = new Meta(message)
    }
}
