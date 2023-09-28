import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
@Entity()
export class AuthPhoneEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createDateTime: Date

    @Column({ type: 'varchar', length: 12 })
    phone: string

    @Column({ type: 'varchar', length: 4 })
    code: string
}
