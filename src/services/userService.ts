<<<<<<<< HEAD:src/services/user.services.ts
import { UserRepository} from "../repository/user.repository";
import { User} from "../types/user.types";
import { CreateUserDTO, LoginUserDTO, ModifyUserDTO} from "../DTO/user.dto";
========
import { UserRepository} from "../repository/userRepository";
import { User} from "../interfaces/userInterface";
import { CreateUserDTO, LoginUserDTO, ModifyUserDTO} from "../DTO/userDTO";
>>>>>>>> notification:src/services/userService.ts
import { randomUUID} from "node:crypto";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import logger from "../config/logger";

export class UserService {
    constructor(
        private readonly userRepository : UserRepository){}

    async createUser(dto: CreateUserDTO): Promise <{ token: string }>{
        logger.info(`Creating user with email: ${dto.email}`);
        if (!dto.email || !dto.password) {
            logger.error('Email and password are required');
            throw new Error('Email and password are required');
        }
        if (dto.password.length < 6) {
            logger.error('Password must be at least 6 characters long');
            throw new Error('Password must be at least 6 characters long');
        }
        if (dto.email.length < 6 || !dto.email.includes('@') || !dto.email.includes('.')) {
            logger.error('Email is not valid');
            throw new Error('Email is not valid');
        }

        const existingUser = await this.userRepository.findByEmail(dto.email);
        if(existingUser){
            logger.error('User with this email already exists');
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user: User = {
            id: randomUUID(),
            email : dto.email,
            username : dto.username || dto.email.split('@')[0],
            password : hashedPassword,
            display_name : dto.username || "",
            avatar : dto.avatar || '',
            bio : dto.bio || '',
            website : dto.website || '',
            privacy : "public",
            is_banned : false,
            created_at : new Date(Date.now()),
            updated_at : new Date(Date.now()),
        }

        const createdUser = await this.userRepository.create(user);
        logger.info(`User created with id: ${createdUser.id}`);

        const token = jwt.sign({ id: createdUser.id, email: createdUser.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return { token };
    }

    async login(dto: LoginUserDTO): Promise<{ token: string } | null> {
        logger.info(`User login attempt with email: ${dto.email}`);
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            logger.warn(`Login failed: User not found with email: ${dto.email}`);
            return null;
        }
        console.log("user");
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            logger.warn(`Login failed: Invalid password for user with email: ${dto.email}`);
            return null;
        }

        logger.info(`User logged in successfully with email: ${dto.email}`);
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '8h' });
        return { token };
    }

    async modifyUser(dto : ModifyUserDTO): Promise <User | null>{
        logger.info(`Modifying user with id: ${dto.id}`);
        const existingUser = await this.userRepository.findById(dto.id);
        if(!existingUser){
            logger.error('User not found');
            throw new Error('User not found');
        }

        const updatedUser: User = {
            ...existingUser,
            display_name : dto.display_name || existingUser.display_name,
            avatar : dto.avatar || existingUser.avatar,
            bio : dto.bio || existingUser.bio,
            website : dto.website || existingUser.website,
            updated_at : new Date(Date.now()),
        }
        const result = await this.userRepository.edit(updatedUser);
        logger.info(`User with id: ${dto.id} modified successfully`);
        return result;
    }

    async deleteUserById(id: string): Promise <User | null>{
        logger.info(`Deleting user with id: ${id}`);
        const result = await this.userRepository.deleteById(id);
        if (result) {
            logger.info(`User with id: ${id} deleted successfully`);
        } else {
            logger.warn(`User with id: ${id} not found for deletion`);
        }
        return result;
    }

    async getUserByEmail(email: string): Promise <User | null>{
        logger.info(`Fetching user by email: ${email}`);
        return this.userRepository.findByEmail(email);
    }
    async getUserById(id: string): Promise <User | null>{
        logger.info(`Getting user by id: ${id}`);
        return this.userRepository.findById(id);
    }

    async searchPublicUsers(query: string): Promise<User[]> {
        logger.info(`Searching public users with query: ${query}`);
        return this.userRepository.searchPublicUsers(query);
    }
}
