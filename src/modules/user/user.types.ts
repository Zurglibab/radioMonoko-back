export interface User {
    id: string;
    email: string;
    password: string;
    username : string;
    display_name : string;
    avatar : string;
    bio : string;
    website : string ;
    is_banned : boolean;
    created_at : Date;
    updated_at : Date;
}