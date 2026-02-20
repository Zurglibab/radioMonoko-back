import { UserRepository} from "./user.repository";
import { User} from "./user.types";
import { CreateUserDTO, ModifyUserDTO} from "./user.dto";
import { randomUUID} from "crypto";
import {hash} from "node:crypto";

export class UserService {
    constructor(private readonly userRepository : UserRepository){}

    async createUser(dto: CreateUserDTO): Promise <User>{
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if(existingUser){
            throw new Error('User with this email already exists');
        }
        const user: User = {
            id: randomUUID(),
            email : dto.email,
            username : dto.username,
            password : hash('sha256', dto.password),
            display_name : dto.username,
            avatar : '',
            bio : '',
            website : '',
            is_banned : false,
            created_at : new Date(Date.now()),
            updated_at : new Date(Date.now()),
        }

        return this.userRepository.create(user);
    }

    async modifyUser(dto : ModifyUserDTO): Promise <User | null>{
        const existingUser = await this.userRepository.findById(dto.id);
        if(!existingUser){
            throw new Error('User not found');
        }
        const updatedUser: User = {
            ...existingUser,
            password : dto.password ? hash('sha256', dto.password) : existingUser.password,
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
