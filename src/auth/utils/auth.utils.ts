// here functions
export function getAuthorData(userId: string): { date: number; userId: string } {
    return {
        date: Date.now(),
        userId: userId,
    }
}
export function createCode() {
    return String(Math.floor(1000 + Math.random() * 9000))
}
