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

    @Column({ default: new Date() })
    year: Date

    @ManyToMany(() => Author, (author) => author.books, { nullable: true })
    @JoinTable()
    authors: Author[]

    @ManyToMany(() => Genre, (genre) => genre.books, { nullable: true })
    @JoinTable()
    genres: Genre[]

    @Column({ default: 'Not Book' })
    filename: string
}
