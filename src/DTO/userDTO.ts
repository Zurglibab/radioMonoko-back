export interface CreateUserDTO {
  id: string;
  email: string;
  password: string;
  username?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  role?: string;
}

export interface ModifyUserDTO {
  id: string;
  password?: string;
  display_name?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  is_banned?: boolean;
  role?: string;
}

export class LoginUserDTO {
  email: string;
  password: string;
}