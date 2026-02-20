export interface CreateUserDTO {
    id : string;
    email: string;
    password: string;
    username : string;
}

export interface ModifyUserDTO {
    id: string;
    password?: string;
    display_name?: string;
    avatar?: string;
    bio?: string;
    website?: string;
}