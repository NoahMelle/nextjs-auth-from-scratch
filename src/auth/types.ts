import { typeToFlattenedError } from "zod";

export interface SignUpFormStateType {
  errors?: typeToFlattenedError<{
    username: string;
    password: string;
    email: string;
  }>;
  email: string;
  password: string;
  username: string;
}

export interface LoginFormStateType {
  errors?: typeToFlattenedError<{
    password: string;
    email: string;
  }>;
  email: string;
  password: string;
}
