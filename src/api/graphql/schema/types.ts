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
  dog: Dog;
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

export interface Dog {
  id: number;
  name: string;
  user: User;
}
