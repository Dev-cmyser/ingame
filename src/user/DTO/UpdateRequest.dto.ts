export class UpdateRequest {
    name?: string
    email?: string
    birthday?: Date
    books?: string[]

    constructor(
        name?: string,

        email?: string,
        birthday?: Date,
        books?: string[]
    ) {
        this.name = name
        this.email = email
        this.birthday = birthday
        this.books = books
    }
}
