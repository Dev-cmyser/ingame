import { Author } from 'src/entities/Author.entity'
import { Genre } from 'src/entities/Genre.entity'

export class UpdateBook {
    id: string
    name?: string
    redaction?: string
    year?: Date
    authors?: string[]
    genres?: string[]
    constructor(
        id: string,
        name?: string,
        redaction?: string,
        year?: Date,
        authors?: string[],
        genres?: string[]
    ) {
        this.id = id
        this.name = name
        this.redaction = redaction
        this.year = year
        this.authors = authors
        this.genres = genres
    }
}
