import { UserRepository} from "./user.repository";
import { User} from "./user.types";
import { CreateUserDTO, LoginUserDTO, ModifyUserDTO} from "./user.dto";
import { randomUUID} from "crypto";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export class UserService {
    constructor(private readonly userRepository : UserRepository){}

    async createUser(dto: CreateUserDTO): Promise <{ token: string }>{

        if (!dto.email || !dto.password) {
            throw new Error('Email and password are required');
        }
        if (dto.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        if (dto.email.length < 6 || !dto.email.includes('@') || !dto.email.includes('.')) {
            throw new Error('Email is not valid');
        }

        const existingUser = await this.userRepository.findByEmail(dto.email);
        if(existingUser){
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user: User = {
            id: randomUUID(),
            email : dto.email,
            username : '',
            password : hashedPassword,
            display_name : '',
            avatar : '',
            bio : '',
            website : '',
            is_banned : false,
            created_at : new Date(Date.now()),
            updated_at : new Date(Date.now()),
        }

        const createdUser = await this.userRepository.create(user);

        const token = jwt.sign({ id: createdUser.id, email: createdUser.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return { token };
    }

    async login(dto: LoginUserDTO): Promise<{ token: string } | null> {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            return null; // User not found
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            return null; // Invalid password
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return { token };
    }

    async modifyUser(dto : ModifyUserDTO): Promise <User | null>{
        const existingUser = await this.userRepository.findById(dto.id);
        if(!existingUser){
            throw new Error('User not found');
        }

        const hashedPassword = dto.password ? await bcrypt.hash(dto.password, 10) : existingUser.password;

        const updatedUser: User = {
            ...existingUser,
            password : hashedPassword,
            display_name : dto.display_name || existingUser.display_name,
            avatar : dto.avatar || existingUser.avatar,
            bio : dto.bio || existingUser.bio,
            website : dto.website || existingUser.website,
            updated_at : new Date(Date.now()),
        }
        return this.userRepository.edit(updatedUser);
    }

    async deleteUserById(id: string): Promise <User | null>{
        return this.userRepository.deleteById(id);
    }

    async getUserByEmail(email: string): Promise <User | null>{
        return this.userRepository.findByEmail(email);
    }
    async getUserById(id: string): Promise <User | null>{
        return this.userRepository.findById(id);
    }
}
