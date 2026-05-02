<<<<<<<< HEAD:src/repository/user.repository.ts
import { User} from "../types/user.types";
========
import { User} from "../interfaces/userInterface";
>>>>>>>> notification:src/repository/userRepository.ts

export interface  UserRepository {
    findByEmail(email: string): Promise <User | null>;
    findById(id: string): Promise <User | null>;
    create(user: User): Promise <User>;

    edit(updatedUser: User): Promise <User | null>;
    deleteById(id: string): Promise <User | null>;
    findByIds(ids: string[]): Promise<User[]>;
    searchPublicUsers(query: string): Promise<User[]>;
}