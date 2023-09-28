export class User {
    isRegistrated: boolean
    scopes: number
    favoriteFuelType: string
    isBlocked: boolean
    lastAccountType: string
    bonusLevel: number
    arrFace: string[]

    constructor(
        isRegistrated: boolean,
        scopes: number,
        fuelType: string,
        isBlocked: boolean,
        lastAccountType: string,
        bonusLevel: number,
        arrFace: string[]
    ) {
        this.isRegistrated = isRegistrated
        this.scopes = scopes
        this.favoriteFuelType = fuelType
        this.isBlocked = isBlocked
        this.lastAccountType = lastAccountType
        this.bonusLevel = bonusLevel
        this.arrFace = arrFace
    }
}
