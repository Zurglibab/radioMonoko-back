import { User} from "../types/user.types";

export interface  UserRepository {
    findByEmail(email: string): Promise <User | null>;
    findById(id: string): Promise <User | null>;
    create(user: User): Promise <User>;

    edit(updatedUser: User): Promise <User | null>;
    deleteById(id: string): Promise <User | null>;
    findByIds(ids: string[]): Promise<User[]>;
}