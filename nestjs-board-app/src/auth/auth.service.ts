import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { Auth } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Console } from 'console';

@Injectable()
export class AuthService {
    constructor(private userRepository: UserRepository) {}

    signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return this.userRepository.createUser(authCredentialsDto);
    }

    signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        return this.userRepository.signIn(authCredentialsDto);
    }
}
