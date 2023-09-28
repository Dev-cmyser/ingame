import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { ResponceGeneratorModule } from 'src/others/responce-generator/responce-generator.module'

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [ResponceGeneratorModule],
})
export class UserModule { }
