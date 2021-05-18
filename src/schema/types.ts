export interface UserInput {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  birthDate: string;
}

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}