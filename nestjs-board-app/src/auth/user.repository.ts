import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credential.dto";
import * as bcrypt from 'bcryptjs'
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(
        private jwtService: JwtService,
        dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const {username, password} = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = this.create( {username, password: hashedPassword} );

        try {
            await this.save(user);      
        } catch (error) {
            if (error.code === '23505')
                throw new ConflictException('username already exists');
            else
                throw new InternalServerErrorException();
        }
        return user;
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const {username, password} = authCredentialsDto;

        const user = await this.findOne({
            where : { username: username }
        });

        if (user && (await bcrypt.compare(password, user.password)))
        {
            //유저 토큰 생성 (Secret + Payload)
            const payload = { username };
            const accessToken = await this.jwtService.sign(payload);

            return { accessToken };
        }
        else
            throw new UnauthorizedException('logIn Failed');
    }
}