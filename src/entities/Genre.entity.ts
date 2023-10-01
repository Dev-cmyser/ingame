import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { Book } from './Book.entity'

@Entity()
export class Genre {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @ManyToMany(() => Book, (book) => book.genres)
    @JoinTable()
    books: Book[]
}
