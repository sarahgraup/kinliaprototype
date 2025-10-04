// src/types/user.ts
import { Friend } from "./event";
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  friends: Friend[];
}

