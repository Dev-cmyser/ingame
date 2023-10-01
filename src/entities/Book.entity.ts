import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { Author } from './Author.entity'
import { Genre } from './Genre.entity'

@Entity()
export class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    redaction: string

    @Column()
    year: number

    @ManyToMany(() => Author, (author) => author.books)
    @JoinTable()
    authors: Author[]

    @ManyToMany(() => Genre, (genre) => genre.books)
    @JoinTable()
    genres: Genre[]
}
