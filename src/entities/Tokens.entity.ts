import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
@Entity()
export class TokenEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date

    @Column({ type: 'varchar', length: 490 })
    refreshToken: string

    @Column({ type: 'varchar', length: 490 })
    accessToken: string

    @Index()
    @Column({ type: 'varchar', length: 90 })
    userId: string
}
