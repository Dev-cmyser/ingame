import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { Book } from './Book.entity'

@Entity()
export class Author {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ default: 'New Person' })
    name: string

    @Column({ nullable: true })
    phone: string

    @Column({ nullable: true })
    email: string

    @Column({ type: 'date', nullable: true })
    birthday: Date

    @ManyToMany(() => Book, (book) => book.authors, { nullable: true })
    @JoinTable()
    books: Book[]
}
