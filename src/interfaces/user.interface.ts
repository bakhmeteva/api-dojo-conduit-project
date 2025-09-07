

export interface User {
  email: string;
  token: string;
  username: string;
  bio?: string;
  image?: string;
}

export interface RegisterUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
  username?: string;
  password?: string;
  bio?: string;
  image?: string;
}

export interface UserResponse {
  user: User;
}

export interface Profile {
  username: string;
  bio?: string;
  image?: string;
  following: boolean;
}

export interface ProfileResponse {
  profile: Profile;
}