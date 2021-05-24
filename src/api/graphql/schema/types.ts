export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface UserInput {
  id: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  birthDate: string;
}

export interface Users {
  users: User[];
  count: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UsersInput {
  take?: number;
  skip?: number;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}
