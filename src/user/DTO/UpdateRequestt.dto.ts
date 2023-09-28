export class UpdateRequest {
    // userId?: string

    name?: string
    email?: string
    birthDay?: Date
    favoriteFuelType?: string
    // isEmail: boolean
    // isUr?: boolean
    //
    // isFiz?: boolean
    //
    // scopes?: number
    //
    // fuelType?: string
    //
    // isBlocked?: boolean

    constructor(
        name?: string,

        email?: string,
        birthDay?: Date,
        favoriteFuelType?: string

        // userId?: string,
        // scopes?: number,
        // fuelType?: string,
        // isBlocked?: boolean
    ) {
        this.name = name
        this.email = email
        this.birthDay = birthDay
        this.favoriteFuelType = favoriteFuelType
        // this.userId = userId
        // this.scopes = scopes
        // this.fuelType = fuelType
        // this.isBlocked = isBlocked
    }
}
